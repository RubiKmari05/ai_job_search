"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase";
import toast from "react-hot-toast";
import { User, MapPin, Briefcase, Award, X } from "lucide-react";

export default function ProfilePage() {
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [skills, setSkills] = useState<string[]>([]);
    const [skillInput, setSkillInput] = useState("");
    const [profile, setProfile] = useState({
        name: "",
        preferred_role: "",
        location: "",
        experience: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile({
                    name: data.name || "",
                    preferred_role: data.preferred_role || "",
                    location: data.location || "",
                    experience: data.experience || ""
                });
                setSkills(data.skills || []);
            }
        } catch (error) {
            console.error("Error fetching profile:", error);
        } finally {
            setFetching(false);
        }
    };

    const addSkill = (e: React.FormEvent) => {
        e.preventDefault();
        if (skillInput && !skills.includes(skillInput)) {
            setSkills([...skills, skillInput]);
            setSkillInput("");
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const handleUpdateProfile = async () => {
        setLoading(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase.from('profiles').upsert({
                id: user.id,
                email: user.email,
                ...profile,
                skills,
                updated_at: new Date().toISOString()
            });

            if (error) throw error;
            toast.success("Profile updated successfully!");
        } catch (error: any) {
            toast.error(error.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-primary/10 p-4 rounded-xl">
                        <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">Your Profile</h1>
                        <p className="text-muted-foreground italic">Tell us what you're looking for so AI can find the right match.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Full Name"
                        value={profile.name}
                        onChange={e => setProfile({ ...profile, name: e.target.value })}
                        placeholder="John Doe"
                    />
                    <Input
                        label="Preferred Role"
                        value={profile.preferred_role}
                        onChange={e => setProfile({ ...profile, preferred_role: e.target.value })}
                        placeholder="Senior Frontend Engineer"
                    />
                    <Input
                        label="Location"
                        value={profile.location}
                        onChange={e => setProfile({ ...profile, location: e.target.value })}
                        placeholder="San Francisco, Remote"
                    />
                    <Input
                        label="Experience Level"
                        value={profile.experience}
                        onChange={e => setProfile({ ...profile, experience: e.target.value })}
                        placeholder="5+ years, Mid-Senior"
                    />
                </div>

                <div className="mt-8">
                    <form onSubmit={addSkill} className="flex gap-2 mb-4">
                        <Input
                            label="Skills"
                            value={skillInput}
                            onChange={e => setSkillInput(e.target.value)}
                            placeholder="e.g. React, Node.js, Python"
                        />
                        <Button type="submit" variant="secondary" className="mt-7">Add</Button>
                    </form>

                    <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                            <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm font-medium">
                                {skill}
                                <button onClick={() => removeSkill(skill)} className="hover:text-red-500">
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                        {skills.length === 0 && <p className="text-muted-foreground text-sm italic">No skills added yet.</p>}
                    </div>
                </div>

                <div className="mt-12">
                    <Button
                        onClick={handleUpdateProfile}
                        size="lg"
                        isLoading={loading}
                        className="w-full md:w-auto"
                    >
                        Save Profile
                    </Button>
                </div>
            </div>
        </div>
    );
}
