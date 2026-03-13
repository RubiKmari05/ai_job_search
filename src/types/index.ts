export interface UserProfile {
    id: string;
    email: string;
    name: string;
    skills: string[];
    preferred_role: string;
    location: string;
    experience: string;
    updated_at?: string;
}

export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    apply_url: string;
    source: string;
    created_at: string;
    match_score?: number;
    matched_skills?: string[];
    missing_skills?: string[];
    match_summary?: string;
}

export interface SavedJob {
    id: string;
    user_id: string;
    job_id: string;
    saved_at: string;
    job?: Job; // Joined job data
}
