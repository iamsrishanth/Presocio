"use client";

import { useState } from "react";
import {
    Layers,
    Sparkles,
    Copy,
    CheckCheck,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface Slide {
    slideNumber: number;
    headline: string;
    body: string;
    isCover?: boolean;
    isCta?: boolean;
}

export default function CarouselCreatorPage() {
    const [topic, setTopic] = useState("");
    const [numSlides, setNumSlides] = useState(5);
    const [tone, setTone] = useState("educational");
    const [audience, setAudience] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [slides, setSlides] = useState<Slide[]>([]);
    const [copied, setCopied] = useState<string | null>(null);
    const [activeSlide, setActiveSlide] = useState(0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim() || !audience.trim()) return;

        setLoading(true);
        setError("");
        setSlides([]);
        setActiveSlide(0);

        try {
            const res = await fetch("/api/ai/carousel", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, numSlides, tone, audience }),
            });
            if (!res.ok) throw new Error("Failed to generate carousel");
            const data = await res.json();
            setSlides(data.slides);
        } catch {
            setError("Failed to generate carousel content. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copySlide = async (slide: Slide, key: string) => {
        const text = `${slide.headline}\n\n${slide.body}`;
        await navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const copyAll = async () => {
        const full = slides
            .map((s) => `Slide ${s.slideNumber}:\n${s.headline}\n${s.body}`)
            .join("\n\n---\n\n");
        await navigator.clipboard.writeText(full);
        setCopied("all");
        setTimeout(() => setCopied(null), 2000);
    };

    const slideColors = [
        "from-[var(--color-primary)] to-indigo-600",
        "from-violet-500 to-purple-600",
        "from-blue-500 to-cyan-500",
        "from-emerald-500 to-teal-600",
        "from-amber-500 to-orange-500",
        "from-pink-500 to-rose-500",
        "from-indigo-500 to-blue-600",
        "from-teal-500 to-emerald-500",
        "from-orange-500 to-red-500",
        "from-fuchsia-500 to-pink-500",
    ];

    return (
        <div className="space-y-8 animate-in">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <Layers size={20} className="text-purple-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Carousel Creator</h1>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        Create slide-by-slide carousel content with AI
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="card space-y-5">
                <div>
                    <label className="label">Topic / Theme</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. 7 productivity hacks for remote workers"
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="label">Target Audience</label>
                    <input
                        type="text"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        placeholder="e.g. freelancers and remote workers"
                        className="input-field"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="label">Number of Slides</label>
                        <select
                            value={numSlides}
                            onChange={(e) => setNumSlides(Number(e.target.value))}
                            className="input-field"
                        >
                            {[3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                <option key={n} value={n}>
                                    {n} slides
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="label">Tone</label>
                        <select
                            value={tone}
                            onChange={(e) => setTone(e.target.value)}
                            className="input-field"
                        >
                            <option value="educational">Educational</option>
                            <option value="entertaining">Entertaining</option>
                            <option value="motivational">Motivational</option>
                            <option value="professional">Professional</option>
                            <option value="casual">Casual</option>
                        </select>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading || !topic.trim() || !audience.trim()}
                    className="btn-primary w-full justify-center py-3"
                >
                    {loading ? (
                        <>
                            <span className="spinner w-4 h-4 border-2 border-white/30 border-t-white" />
                            Generating Carousel...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} />
                            Generate Carousel Content
                        </>
                    )}
                </button>
            </form>

            {/* Error */}
            {error && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && <LoadingSpinner text="Creating your carousel slides..." />}

            {/* Slides Output */}
            {slides.length > 0 && !loading && (
                <div className="space-y-6 animate-in">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[var(--color-text)]">
                            Carousel Preview ({slides.length} slides)
                        </h2>
                        <button onClick={copyAll} className="btn-secondary text-xs px-3 py-2">
                            {copied === "all" ? <CheckCheck size={14} /> : <Copy size={14} />}
                            {copied === "all" ? "Copied All!" : "Copy All"}
                        </button>
                    </div>

                    {/* Live Preview */}
                    <div className="card p-8">
                        <div className="max-w-sm mx-auto">
                            <div
                                className={`aspect-square rounded-2xl bg-gradient-to-br ${slideColors[activeSlide % slideColors.length]} p-8 flex flex-col justify-center items-center text-center text-white shadow-xl transition-all duration-300`}
                            >
                                {slides[activeSlide]?.isCover && (
                                    <span className="text-xs font-bold uppercase tracking-widest mb-3 opacity-70">
                                        Cover Slide
                                    </span>
                                )}
                                {slides[activeSlide]?.isCta && (
                                    <span className="text-xs font-bold uppercase tracking-widest mb-3 opacity-70">
                                        Call to Action
                                    </span>
                                )}
                                <h3 className="text-xl font-bold leading-tight mb-4">
                                    {slides[activeSlide]?.headline}
                                </h3>
                                <p className="text-sm opacity-90 leading-relaxed">
                                    {slides[activeSlide]?.body}
                                </p>
                                <span className="mt-6 text-xs font-semibold opacity-50">
                                    {activeSlide + 1} / {slides.length}
                                </span>
                            </div>

                            {/* Navigation */}
                            <div className="flex items-center justify-center gap-4 mt-6">
                                <button
                                    onClick={() => setActiveSlide(Math.max(0, activeSlide - 1))}
                                    disabled={activeSlide === 0}
                                    className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-surface-hover)] disabled:opacity-30 transition-all"
                                >
                                    <ChevronLeft size={18} />
                                </button>
                                <div className="flex gap-1.5">
                                    {slides.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setActiveSlide(i)}
                                            className={`w-2 h-2 rounded-full transition-all ${i === activeSlide
                                                    ? "bg-[var(--color-primary)] w-6"
                                                    : "bg-[var(--color-border)]"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <button
                                    onClick={() => setActiveSlide(Math.min(slides.length - 1, activeSlide + 1))}
                                    disabled={activeSlide === slides.length - 1}
                                    className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-surface-hover)] disabled:opacity-30 transition-all"
                                >
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Slide List */}
                    <div className="space-y-3">
                        {slides.map((slide, i) => (
                            <div
                                key={i}
                                className={`card cursor-pointer transition-all ${i === activeSlide ? "border-[var(--color-primary)] shadow-md" : ""
                                    }`}
                                onClick={() => setActiveSlide(i)}
                            >
                                <div className="flex items-start gap-4">
                                    <div
                                        className={`w-10 h-10 rounded-lg bg-gradient-to-br ${slideColors[i % slideColors.length]} flex items-center justify-center text-white text-sm font-bold shrink-0`}
                                    >
                                        {slide.slideNumber}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-semibold text-[var(--color-text)] text-sm">
                                                {slide.headline}
                                            </h4>
                                            {slide.isCover && (
                                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase">
                                                    Cover
                                                </span>
                                            )}
                                            {slide.isCta && (
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase">
                                                    CTA
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed line-clamp-2">
                                            {slide.body}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            copySlide(slide, `slide-${i}`);
                                        }}
                                        className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors shrink-0"
                                        title="Copy slide"
                                    >
                                        {copied === `slide-${i}` ? (
                                            <CheckCheck size={16} className="text-emerald-500" />
                                        ) : (
                                            <Copy size={16} />
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
