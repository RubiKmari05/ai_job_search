import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { firecrawl } from '@/lib/firecrawl';
import { aiService } from '@/lib/ai';

export async function POST(request: Request) {
    try {
        const cookieStore = cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                },
            }
        );

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Get user profile for matching
        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found. Please complete your profile first.' }, { status: 400 });
        }

        const { query, location } = await request.json();

        // 2. Scrape jobs using Firecrawl
        const scrapedJobs = await firecrawl.scrapeJobs(
            query || profile.preferred_role,
            location || profile.location
        );

        if (scrapedJobs.length === 0) {
            return NextResponse.json({ message: 'No jobs found', jobs: [] });
        }

        // 3. Match each job using AI (in parallel with concurrency control if needed)
        // For now, we'll process them and store the results
        const processedJobs = await Promise.all(scrapedJobs.map(async (jobData) => {
            const matchResult = await aiService.matchJob(jobData.description, profile);

            return {
                ...jobData,
                match_score: matchResult.score,
                matched_skills: matchResult.matchedSkills,
                missing_skills: matchResult.missingSkills,
                match_summary: matchResult.summary,
            };
        }));

        // 4. Save jobs to database (Upsert based on apply_url)
        const { data: savedJobs, error: dbError } = await supabase
            .from('jobs')
            .upsert(
                processedJobs.map(job => ({
                    title: job.title,
                    company: job.company,
                    location: job.location,
                    description: job.description,
                    apply_url: job.apply_url,
                    source: job.source,
                    match_score: job.match_score,
                    matched_skills: job.matched_skills,
                    missing_skills: job.missing_skills,
                    match_summary: job.match_summary
                })),
                { onConflict: 'apply_url' }
            )
            .select();

        if (dbError) throw dbError;

        return NextResponse.json({
            message: `Found and analyzed ${processedJobs.length} jobs`,
            jobs: savedJobs
        });

    } catch (error: any) {
        console.error('Search API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
