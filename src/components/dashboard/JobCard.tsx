"use client";

import { Job } from "@/types";
import { Button } from "../ui/Button";
import { MapPin, Building2, ExternalLink, Bookmark, Target, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn, formatScore } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface JobCardProps {
    job: Job;
    isSaved?: boolean;
    onSave?: (id: string) => void;
}

export function JobCard({ job, isSaved, onSave }: JobCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-green-500 bg-green-500/10";
        if (score >= 50) return "text-yellow-500 bg-yellow-500/10";
        return "text-red-500 bg-red-500/10";
    };

    return (
        <div className={cn(
            "job-card-hover bg-card border border-border rounded-2xl p-6 relative overflow-hidden",
            job.match_score && job.match_score >= 80 && "border-primary/30"
        )}>
            {job.match_score && (
                <div className={cn(
                    "absolute top-0 right-0 px-4 py-1 rounded-bl-xl font-bold flex items-center gap-1 text-sm",
                    getScoreColor(job.match_score)
                )}>
                    <Target size={14} />
                    {formatScore(job.match_score)} Match
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-4 justify-between items-start">
                <div className="space-y-2">
                    <h3 className="text-xl font-bold leading-tight">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1.5 font-medium text-foreground">
                            <Building2 size={16} className="text-primary" />
                            {job.company}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MapPin size={16} />
                            {job.location}
                        </span>
                    </div>
                </div>

                <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                    <Button
                        variant={isSaved ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => onSave?.(job.id)}
                        className={isSaved ? "text-primary" : ""}
                    >
                        <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                    </Button>
                    <a href={job.apply_url} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none">
                        <Button size="sm" className="w-full gap-2">
                            Apply <ExternalLink size={14} />
                        </Button>
                    </a>
                </div>
            </div>

            <div className="mt-6">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"
                >
                    {isExpanded ? "Show Less" : "View Details & AI Analysis"}
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-6 space-y-6">
                                {/* AI Summary Section */}
                                {job.match_summary && (
                                    <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                                        <h4 className="text-sm font-bold flex items-center gap-2 mb-2 text-primary">
                                            <Target size={16} /> AI Match Breakdown
                                        </h4>
                                        <p className="text-sm text-foreground/80 leading-relaxed italic">
                                            "{job.match_summary}"
                                        </p>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                            <div>
                                                <h5 className="text-[10px] uppercase tracking-wider font-bold text-green-600 mb-2">Matched Skills</h5>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {job.matched_skills?.map(s => (
                                                        <span key={s} className="px-2 py-0.5 bg-green-50 text-green-700 rounded-md text-xs font-medium border border-green-100 italic">
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <h5 className="text-[10px] uppercase tracking-wider font-bold text-red-600 mb-2">Missing Skills</h5>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {job.missing_skills?.map(s => (
                                                        <span key={s} className="px-2 py-0.5 bg-red-50 text-red-700 rounded-md text-xs font-medium border border-red-100 italic">
                                                            {s}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <h4 className="text-sm font-bold mb-2">Description</h4>
                                    <div className="text-sm text-muted-foreground prose prose-sm max-w-none line-clamp-[10] whitespace-pre-line italic">
                                        {job.description}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
