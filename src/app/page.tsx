"use client";

import { Button } from "@/components/ui/Button";
import { Briefcase, Zap, Shield, Search, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-primary/10 to-transparent -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-primary uppercase bg-primary/10 rounded-full">
              AI-Powered Career Discovery
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Stop Searching. <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient">
                Start Matching.
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10">
              The only job platform that actually understands your skills. We crawl the web, scrape descriptions, and tell you exactly why a job is a 95% match for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto gap-2">
                  Get Started for Free <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  How it Works
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why JobPulse AI?</h2>
            <p className="text-muted-foreground">Traditional job boards are broken. We fixed them with AI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="w-8 h-8 text-primary" />}
              title="Automated Scraping"
              description="Our Firecrawl engine scours LinkedIn, Indeed, and company career pages so you don't have to."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-accent" />}
              title="AI Skill Matching"
              description="Get a percentage compatibility score for every job based on your unique skills and experience."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-green-500" />}
              title="Smart Filters"
              description="Filter by match score, location, and role. Never waste time reading a bad job description again."
            />
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-20 bg-background border-y border-border">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary mb-2">10k+</div>
            <div className="text-sm text-muted-foreground">Jobs Scraped Daily</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent mb-2">98%</div>
            <div className="text-sm text-muted-foreground">Match Accuracy</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary mb-2">500+</div>
            <div className="text-sm text-muted-foreground">Hiring Companies</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-accent mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Auto-Discovery</div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-2xl border border-border bg-background hover:shadow-xl transition-all duration-300 group">
      <div className="mb-6 p-4 rounded-xl bg-secondary w-fit group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed italic line-clamp-3">
        {description}
      </p>
    </div>
  );
}
