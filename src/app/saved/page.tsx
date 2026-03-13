"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { JobCard } from "@/components/dashboard/JobCard";
import { Bookmark, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Job } from "@/types";

export default function SavedJobsPage() {
    const supabase = createClient();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedJobs();
    }, []);

    const fetchSavedJobs = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('saved_jobs')
                .select(`
          job_id,
          jobs (*)
        `)
                .eq('user_id', user.id);

            if (error) throw error;

            const formattedJobs = data?.map((item: any) => item.jobs) || [];
            setJobs(formattedJobs);
        } catch (error: any) {
            toast.error("Failed to load saved jobs");
        } finally {
            setLoading(false);
        }
    };

    const handleUnsave = async (jobId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            await supabase
                .from('saved_jobs')
                .delete()
                .eq('user_id', user.id)
                .eq('job_id', jobId);

            setJobs(jobs.filter(j => j.id !== jobId));
            toast.success("Job removed from saved");
        } catch (error) {
            toast.error("Failed to remove job");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-10">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                    <Bookmark size={24} />
                </div>
                <h1 className="text-3xl font-bold">Saved Opportunities</h1>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 gap-6">
                    {[1, 2].map(i => (
                        <div key={i} className="h-48 bg-card animate-pulse rounded-2xl" />
                    ))}
                </div>
            ) : jobs.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {jobs.map(job => (
                        <JobCard
                            key={job.id}
                            job={job}
                            isSaved={true}
                            onSave={handleUnsave}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-32 bg-secondary/20 rounded-3xl border border-dashed border-border">
                    <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No saved jobs</h3>
                    <p className="text-muted-foreground italic">Jobs you save will appear here for easy access.</p>
                </div>
            )}
        </div>
    );
}
