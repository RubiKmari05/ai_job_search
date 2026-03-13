"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { JobCard } from "@/components/dashboard/JobCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, Filter, Loader2, Sparkles, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { Job } from "@/types";

export default function Dashboard() {
    const supabase = createClient();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [searching, setSearching] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");
    const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchJobs();
        fetchSavedJobIds();
    }, []);

    const fetchJobs = async () => {
        try {
            const { data, error } = await supabase
                .from('jobs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) throw error;
            setJobs(data || []);
        } catch (error: any) {
            toast.error("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedJobIds = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('saved_jobs')
            .select('job_id')
            .eq('user_id', user.id);

        if (data) {
            setSavedJobIds(new Set(data.map(item => item.job_id)));
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setSearching(true);
        try {
            const response = await fetch('/api/jobs/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: searchQuery, location: locationQuery }),
            });

            const data = await response.json();
            if (data.error) throw new Error(data.error);

            setJobs(data.jobs);
            toast.success(data.message);
        } catch (error: any) {
            toast.error(error.message || "Search failed");
        } finally {
            setSearching(false);
        }
    };

    const toggleSaveJob = async (jobId: string) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                toast.error("Please login to save jobs");
                return;
            }

            const isCurrentlySaved = savedJobIds.has(jobId);

            if (isCurrentlySaved) {
                await supabase
                    .from('saved_jobs')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('job_id', jobId);

                const newIds = new Set(savedJobIds);
                newIds.delete(jobId);
                setSavedJobIds(newIds);
                toast.success("Job removed from saved");
            } else {
                await supabase
                    .from('saved_jobs')
                    .insert({ user_id: user.id, job_id: jobId });

                const newIds = new Set(savedJobIds);
                newIds.add(jobId);
                setSavedJobIds(newIds);
                toast.success("Job saved!");
            }
        } catch (error: any) {
            toast.error("Operation failed");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Search Header */}
            <div className="bg-card border border-border rounded-3xl p-8 mb-12 shadow-sm">
                <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
                    Discover Matches <Sparkles className="text-accent" />
                </h1>

                <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <Input
                        label="Job Role"
                        placeholder="e.g. Product Designer"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Input
                        label="Location"
                        placeholder="e.g. Remote, NY"
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                    />
                    <Button size="lg" className="gap-2" isLoading={searching} type="submit">
                        <Search size={18} /> {searching ? "Scraping & Analyzing..." : "Fine-Tune Search"}
                    </Button>
                </form>

                {searching && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-primary animate-pulse">
                        <Loader2 className="animate-spin" size={16} />
                        AI is currently crawling job sites and calculating match scores for you...
                    </div>
                )}
            </div>

            {/* Results Section */}
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Top Recommendations</h2>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="gap-1">
                            <Filter size={14} /> High Match
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-48 bg-card animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {jobs.map(job => (
                            <JobCard
                                key={job.id}
                                job={job}
                                isSaved={savedJobIds.has(job.id)}
                                onSave={toggleSaveJob}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-secondary/30 rounded-3xl border border-dashed border-border">
                        <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">No jobs found yet</h3>
                        <p className="text-muted-foreground italic">Try adjusting your profile or running a manual search above.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
