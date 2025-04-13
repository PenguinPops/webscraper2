import { NextResponse } from 'next/server';
import scrapeJobs from '@/scrapers/pracujScraper';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position') || '';
    const location = searchParams.get('location') || 'chelm';
    const radius = parseInt(searchParams.get('radius')) || 30;

    console.log(`Starting scrape with params: position=${position}, location=${location}, radius=${radius}`);
    
    const jobs = await scrapeJobs(position, location, radius);

    // Add some metadata to the response
    const responseData = {
      success: true,
      count: jobs.length,
      params: {
        position,
        location,
        radius
      },
      data: jobs,
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error scraping jobs:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch job listings',
        details: error.message 
      },
      { status: 500 }
    );
  }
}