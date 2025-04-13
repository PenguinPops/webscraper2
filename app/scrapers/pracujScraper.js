const puppeteer = require('puppeteer');
const crypto = require('crypto');

// Configuration - adjust as needed
const DEBUG = false;
const HEADLESS = true;
const TIMEOUT = 15000;
const MAX_CONCURRENT_PAGES = 5;
const JOB_DETAILS_TIMEOUT = 8000;

function generateJobHash(jobData) {
    const { addedDate, link, ...hashData } = jobData;
    const sortedString = JSON.stringify(hashData, Object.keys(hashData).sort());
    return crypto.createHash('sha256').update(sortedString).digest('hex');
}

function buildSearchUrl({ position = '', city = 'lublin', radius = 30 }) {
    const baseUrl = 'https://www.pracuj.pl/praca';
    let url = position 
        ? `${baseUrl}/${position.toLowerCase().replace(/\s+/g, '-')};kw/${city.toLowerCase()};wp`
        : `${baseUrl}/${city.toLowerCase()};wp`;
    
    const params = new URLSearchParams();
    params.set('rd', radius);
    params.set('et', '2,1,3,17');
    params.set('tc', '2,7,6,1');
    params.set('ws', '1,2');
    params.set('wm', 'full-office,hybrid');
    
    return `${url}?${params.toString()}`;
}

async function openJobPage(browser, index) {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setDefaultTimeout(JOB_DETAILS_TIMEOUT);
    return page;
}

async function scrapeJobPage(jobPage, jobLink, searchLocation, addedDate) {
    await jobPage.goto(jobLink, {
        waitUntil: 'domcontentloaded',
        timeout: JOB_DETAILS_TIMEOUT
    });

    await jobPage.waitForSelector('#offer-details', { timeout: JOB_DETAILS_TIMEOUT });

    const jobDetails = await jobPage.evaluate((searchLocation, addedDate) => {
        const title = document.querySelector('[data-test="text-positionName"]')?.textContent?.trim() || '';
        const company = document.querySelector('[data-test="text-employerName"]')?.textContent?.trim() || '';
        const salary = document.querySelector('[data-test="text-earningAmount"]')?.textContent?.trim() || 'Nie podano';
        const cleanedDate = addedDate.replace(/^Opublikowana:\s*/i, '');
        const allText = document.querySelector('#offer-details')?.textContent?.toLowerCase() || '';
        
        const isForStudents = /student|uczeń|uczniowski|studencki/i.test(allText);
        const isInternship = /staż|praktyk|internship|praktyki/i.test(allText);
        
        let experienceRequired = null;
        const experienceMatch = allText.match(/(\d+)\s*(rok|lat|miesiąc|miesięcy|roku|latach|miesiące|miesiącach)\s*[^\w]*dośw/i);
        if (experienceMatch) {
            experienceRequired = `${experienceMatch[1]} ${experienceMatch[2]}`;
        } else if (/dośw/i.test(allText)) {
            experienceRequired = "Wymagane doświadczenie (nieokreślone)";
        }

        const requirements = [];
        const reqItems = document.querySelectorAll('[data-test="section-requirements"] li');
        for (let i = 0; i < Math.min(reqItems.length, 5); i++) {
            requirements.push(reqItems[i].textContent.trim());
        }

        return {
            title,
            company,
            location: searchLocation,
            salary,
            addedDate: cleanedDate,
            isForStudents,
            isInternship,
            experienceRequired,
            requirements,
            link: window.location.href
        };
    }, searchLocation, addedDate);

    const hash = generateJobHash(jobDetails);
    return { ...jobDetails, hash };
}

export default async function scrapeJobs(position = '', city = 'lublin', radius = 30) {
    const searchUrl = buildSearchUrl({ position, city, radius });
    console.log(`Scraping URL: ${searchUrl}`);

    const browser = await puppeteer.launch({
        headless: HEADLESS,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--disable-gpu'
        ],
        defaultViewport: null
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    try {
        console.log('Navigating to search page...');
        await page.goto(searchUrl, { 
            waitUntil: 'domcontentloaded',
            timeout: TIMEOUT
        });

        console.log('Waiting for job listings to load...');
        await page.waitForSelector('[data-test="section-offers"]', { timeout: TIMEOUT });

        const jobData = await page.evaluate(() => {
            const results = [];
            const jobCards = document.querySelectorAll('[data-test="default-offer"]');
            
            jobCards.forEach(card => {
                const linkElement = card.querySelector('[data-test="link-offer"]');
                const dateElement = card.querySelector('[data-test="text-added"]');
                
                if (linkElement && linkElement.href) {
                    results.push({
                        url: linkElement.href,
                        addedDate: dateElement?.textContent?.trim() || ''
                    });
                }
            });
            
            return results;
        });

        console.log(`Found ${jobData.length} job offers. Now scraping details...`);
        await page.close();

        const jobs = [];
        const jobPagePromises = [];

        for (let i = 0; i < Math.min(jobData.length, MAX_CONCURRENT_PAGES); i++) {
            jobPagePromises.push(openJobPage(browser, i));
        }

        for (let i = 0; i < jobData.length; i++) {
            const jobPage = await jobPagePromises[i % MAX_CONCURRENT_PAGES];
            const { url: jobLink, addedDate } = jobData[i];
            
            try {
                console.log(`Scraping job ${i + 1}/${jobData.length}`);
                const jobDetails = await scrapeJobPage(jobPage, jobLink, city, addedDate);
                jobs.push(jobDetails);
            } catch (error) {
                console.error(`Error scraping job ${i + 1}: ${error.message}`);
                if (DEBUG) {
                    await jobPage.screenshot({ path: `error-job-${i + 1}.png` });
                }
            }

            if (i + MAX_CONCURRENT_PAGES < jobData.length) {
                jobPagePromises[i % MAX_CONCURRENT_PAGES] = openJobPage(browser, i + MAX_CONCURRENT_PAGES);
            }
        }

        await browser.close();
        console.log(`Successfully scraped ${jobs.length} jobs with details`);
        return jobs;

    } catch (error) {
        console.error('Error during scraping:', error);
        if (DEBUG) {
            await page.screenshot({ path: 'error-main.png' });
        }
        await browser.close();
        throw error;
    }
}