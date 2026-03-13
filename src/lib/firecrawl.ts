import axios from 'axios';

const FIRECRAWL_API_URL = 'https://api.firecrawl.dev/v0';

export interface ScrapedJob {
    title: string;
    company: string;
    location: string;
    description: string;
    apply_url: string;
    source: string;
}

export class FirecrawlService {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async scrapeJobs(query: string, location: string): Promise<ScrapedJob[]> {
        try {
            // For demonstration, we'll use Firecrawl's search/crawl feature
            // Note: Implementation details depend on specific Firecrawl API version
            // This is a generic implementation for searching job sites
            const response = await axios.post(
                `${FIRECRAWL_API_URL}/search`,
                {
                    query: `site:linkedin.com/jobs OR site:indeed.com/jobs "${query}" in "${location}"`,
                    limit: 10,
                    scrapeOptions: {
                        formats: ['markdown'],
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const data = response.data;

            if (!data.success) {
                throw new Error(data.error || 'Firecrawl search failed');
            }

            // Map Firecrawl results to our Job format
            // Firecrawl returns an array of results with content
            return data.data.map((result: any) => ({
                title: result.metadata?.title || 'Unknown Title',
                company: result.metadata?.author || 'Unknown Company',
                location: location,
                description: result.markdown || '',
                apply_url: result.url,
                source: result.metadata?.source || 'Web',
            }));
        } catch (error: any) {
            console.error('Firecrawl Error:', error.response?.data || error.message);
            return [];
        }
    }

    async crawlUrl(url: string): Promise<string> {
        const response = await axios.post(
            `${FIRECRAWL_API_URL}/scrape`,
            {
                url,
                formats: ['markdown'],
            },
            {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        return response.data.data.markdown;
    }
}

export const firecrawl = new FirecrawlService(process.env.FIRECRAWL_API_KEY || '');
