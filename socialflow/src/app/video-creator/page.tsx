"use client";

import { useState } from "react";
import {
    Video,
    Sparkles,
    Copy,
    CheckCheck,
    AlertCircle,
    Clapperboard,
    Type,
    Film,
} from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface VideoScript {
    hook: string;
    body: string;
    cta: string;
    onScreenText: string[];
    bRollSuggestions: string[];
}

export default function VideoCreatorPage() {
    const [topic, setTopic] = useState("");
    const [audience, setAudience] = useState("");
    const [tone, setTone] = useState("educational");
    const [duration, setDuration] = useState("30s");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [script, setScript] = useState<VideoScript | null>(null);
    const [copied, setCopied] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim() || !audience.trim()) return;

        setLoading(true);
        setError("");
        setScript(null);

        try {
            const res = await fetch("/api/ai/video-script", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, audience, tone, duration }),
            });
            if (!res.ok) throw new Error("Failed to generate script");
            const data = await res.json();
            setScript(data);
        } catch {
            setError("Failed to generate video script. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = async (text: string, key: string) => {
        await navigator.clipboard.writeText(text);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const copyAll = () => {
        if (!script) return;
        const full = `HOOK:\n${script.hook}\n\nBODY:\n${script.body}\n\nCTA:\n${script.cta}\n\nON-SCREEN TEXT:\n${script.onScreenText.map((t, i) => `${i + 1}. ${t}`).join("\n")}\n\nB-ROLL SUGGESTIONS:\n${script.bRollSuggestions.map((s, i) => `${i + 1}. ${s}`).join("\n")}`;
        copyToClipboard(full, "all");
    };

    return (
        <div className="space-y-8 animate-in">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                    <Video size={20} className="text-red-500" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-text)]">Video Creator</h1>
                    <p className="text-sm text-[var(--color-text-muted)]">
                        Generate AI-powered video scripts for social media
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="card space-y-5">
                <div>
                    <label className="label">Video Topic / Hook</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. 5 morning routines of successful entrepreneurs"
                        className="input-field"
                    />
                </div>
                <div>
                    <label className="label">Target Audience</label>
                    <input
                        type="text"
                        value={audience}
                        onChange={(e) => setAudience(e.target.value)}
                        placeholder="e.g. young professionals aged 25-35"
                        className="input-field"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
                            <option value="storytelling">Storytelling</option>
                            <option value="humorous">Humorous</option>
                        </select>
                    </div>
                    <div>
                        <label className="label">Duration</label>
                        <select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="input-field"
                        >
                            <option value="15s">15 seconds</option>
                            <option value="30s">30 seconds</option>
                            <option value="60s">60 seconds</option>
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
                            Generating Script...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} />
                            Generate Video Script
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
            {loading && <LoadingSpinner text="Crafting your video script with AI..." />}

            {/* Script Output */}
            {script && !loading && (
                <div className="space-y-5 animate-in">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[var(--color-text)]">Generated Script</h2>
                        <button onClick={copyAll} className="btn-secondary text-xs px-3 py-2">
                            {copied === "all" ? <CheckCheck size={14} /> : <Copy size={14} />}
                            {copied === "all" ? "Copied!" : "Copy All"}
                        </button>
                    </div>

                    {/* Hook */}
                    <div className="card border-l-4 border-l-amber-400">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Clapperboard size={16} className="text-amber-500" />
                                <h3 className="font-semibold text-[var(--color-text)]">Hook</h3>
                            </div>
                            <button onClick={() => copyToClipboard(script.hook, "hook")} className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                                {copied === "hook" ? <CheckCheck size={14} /> : <Copy size={14} />}
                            </button>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{script.hook}</p>
                    </div>

                    {/* Body */}
                    <div className="card border-l-4 border-l-[var(--color-primary)]">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Type size={16} className="text-[var(--color-primary)]" />
                                <h3 className="font-semibold text-[var(--color-text)]">Body</h3>
                            </div>
                            <button onClick={() => copyToClipboard(script.body, "body")} className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                                {copied === "body" ? <CheckCheck size={14} /> : <Copy size={14} />}
                            </button>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed whitespace-pre-line">{script.body}</p>
                    </div>

                    {/* CTA */}
                    <div className="card border-l-4 border-l-emerald-400">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-emerald-500" />
                                <h3 className="font-semibold text-[var(--color-text)]">Call to Action</h3>
                            </div>
                            <button onClick={() => copyToClipboard(script.cta, "cta")} className="text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors">
                                {copied === "cta" ? <CheckCheck size={14} /> : <Copy size={14} />}
                            </button>
                        </div>
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{script.cta}</p>
                    </div>

                    {/* On-screen Text */}
                    <div className="card">
                        <div className="flex items-center gap-2 mb-3">
                            <Type size={16} className="text-blue-500" />
                            <h3 className="font-semibold text-[var(--color-text)]">On-Screen Text Suggestions</h3>
                        </div>
                        <div className="space-y-2">
                            {script.onScreenText.map((text, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg)]">
                                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    <p className="text-sm text-[var(--color-text-secondary)] flex-1">{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* B-Roll */}
                    <div className="card">
                        <div className="flex items-center gap-2 mb-3">
                            <Film size={16} className="text-purple-500" />
                            <h3 className="font-semibold text-[var(--color-text)]">B-Roll / Visual Suggestions</h3>
                        </div>
                        <div className="space-y-2">
                            {script.bRollSuggestions.map((suggestion, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-bg)]">
                                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                                        {i + 1}
                                    </span>
                                    <p className="text-sm text-[var(--color-text-secondary)] flex-1">{suggestion}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
