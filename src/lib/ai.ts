import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export interface JobMatchResult {
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    summary: string;
}

export class AIService {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async matchJob(jobDescription: string, userProfile: any): Promise<JobMatchResult> {
        try {
            const prompt = `
        You are an expert AI Career Coach. Your task is to match a job description with a user's profile and provide a relevance score (0-100).
        
        USER PROFILE:
        Role: ${userProfile.preferred_role}
        Location: ${userProfile.location}
        Skills: ${userProfile.skills.join(', ')}
        Experience: ${userProfile.experience}
        
        JOB DESCRIPTION:
        ${jobDescription}
        
        INSTRUCTIONS:
        1. Compare the skills, role, and experience required in the job description with the user's profile.
        2. Calculate a match score from 0 to 100.
        3. Identify specific skills that match.
        4. Identify missing skills that are required or highly recommended for this job.
        5. Provide a brief (2-3 sentences) summary of why this job is or isn't a good match.
        
        OUTPUT FORMAT (JSON ONLY):
        {
          "score": number,
          "matchedSkills": string[],
          "missingSkills": string[],
          "summary": string
        }
      `;

            const response = await axios.post(
                OPENROUTER_API_URL,
                {
                    model: 'meta-llama/llama-3-8b-instruct:free', // Default free model or configurable
                    messages: [{ role: 'user', content: prompt }],
                    response_format: { type: 'json_object' }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://ai-job-search.app', // Optional for OpenRouter
                        'X-Title': 'AI Job Search App',
                    },
                }
            );

            const resContent = response.data.choices[0].message.content;
            return JSON.parse(resContent);
        } catch (error: any) {
            console.error('AI Matching Error:', error.response?.data || error.message);
            return {
                score: 0,
                matchedSkills: [],
                missingSkills: [],
                summary: 'Failed to match job due to AI error.'
            };
        }
    }
}

export const aiService = new AIService(process.env.OPENROUTER_API_KEY || '');
