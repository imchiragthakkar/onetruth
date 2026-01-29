import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import { useSessionStore } from '../store/useSessionStore';
import { Button } from './ui/Button';

export default function ProblemIntake() {
    const navigate = useNavigate();
    const { addSession } = useSessionStore();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const [formData, setFormData] = useState({
        raw_text: '',
        life_area: '',
        intensity_level: 5,
        duration_category: '',
        state_tags: []
    });

    const LIFE_AREAS = [
        "Mind / Emotions", "Relationships", "Work / Purpose",
        "Health / Energy", "Money / Stability", "Meaning / Direction", "Other"
    ];

    const DURATIONS = [
        "Just now", "Few days", "Few weeks", "Few months", "Long time"
    ];

    const STATES = [
        "Confused", "Overwhelmed", "Anxious", "Angry",
        "Sad", "Numb", "Curious", "Seeking clarity"
    ];

    const handleTagToggle = (tag) => {
        setFormData(prev => ({
            ...prev,
            state_tags: prev.state_tags.includes(tag)
                ? prev.state_tags.filter(t => t !== tag)
                : [...prev.state_tags, tag]
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // Simulate a small delay for "processing" feel
            await new Promise(resolve => setTimeout(resolve, 800));

            addSession({
                raw_text: formData.raw_text,
                life_area: formData.life_area,
                intensity_level: formData.intensity_level,
                duration_category: formData.duration_category,
                emotional_tags: formData.state_tags,
                language_code: 'en-US' // Default for now
            });

            setIsComplete(true);
        } catch (error) {
            console.error("Failed to save session", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isComplete) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-sm text-center space-y-6 animate-fade-in">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-gray-800">Received.</h2>
                    <p className="text-gray-600 leading-relaxed">
                        Your situation has been securely recorded. Take a moment to breathe.
                        <br />No immediate action is required.
                    </p>
                    <Button onClick={() => navigate('/dashboard')} className="w-full">
                        Return to Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-10 border-b border-gray-100">
                <div className="container max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 text-gray-500 hover:text-gray-800">
                        <ArrowLeft size={24} />
                    </button>
                    <span className="font-medium text-gray-500 text-sm">Describe Your Situation</span>
                    <div className="w-8" />
                </div>
            </header>

            <main className="container max-w-2xl mx-auto px-4 pt-24 pb-20 space-y-12">

                {/* 1. The Core Problem */}
                <section className="space-y-4 animate-slide-up" style={{ animationDelay: '0ms' }}>
                    <label className="block text-xl font-serif font-bold text-gray-900">
                        What are you going through right now?
                    </label>
                    <textarea
                        value={formData.raw_text}
                        onChange={(e) => setFormData({ ...formData, raw_text: e.target.value })}
                        placeholder="Write freely. There is no right or wrong..."
                        className="w-full h-40 p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-primary-200 resize-none text-lg leading-relaxed placeholder-gray-400"
                        maxLength={1000}
                    />
                    <div className="flex justify-between items-center text-xs text-gray-400">
                        <span className="flex items-center gap-1"><ShieldCheck size={12} /> Private & Secure</span>
                        <span>{formData.raw_text.length}/1000</span>
                    </div>
                </section>

                {/* 2. Context Fields */}
                <section className="space-y-8 animate-slide-up" style={{ animationDelay: '100ms' }}>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Main area affected</label>
                        <div className="flex flex-wrap gap-2">
                            {LIFE_AREAS.map(area => (
                                <button
                                    key={area}
                                    onClick={() => setFormData({ ...formData, life_area: area })}
                                    className={`px-4 py-2 rounded-full text-sm transition-all ${formData.life_area === area
                                            ? 'bg-gray-900 text-white shadow-md'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {area}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <label className="block text-sm font-medium text-gray-700">Intensity (1-10)</label>
                            <span className="text-gray-900 font-bold">{formData.intensity_level}</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="10"
                            value={formData.intensity_level}
                            onChange={(e) => setFormData({ ...formData, intensity_level: parseInt(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                        />
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">How long has this been affecting you?</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {DURATIONS.map(dur => (
                                <button
                                    key={dur}
                                    onClick={() => setFormData({ ...formData, duration_category: dur })}
                                    className={`px-3 py-2 rounded-lg text-sm transition-colors border ${formData.duration_category === dur
                                            ? 'border-gray-900 bg-gray-50 text-gray-900'
                                            : 'border-gray-100 text-gray-500 hover:border-gray-300'
                                        }`}
                                >
                                    {dur}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Current emotional state</label>
                        <div className="flex flex-wrap gap-2">
                            {STATES.map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => handleTagToggle(tag)}
                                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${formData.state_tags.includes(tag)
                                            ? 'bg-primary-100 text-primary-700 border border-primary-200'
                                            : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'
                                        }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                </section>

                <div className="h-8" /> {/* Spacer */}
            </main>

            <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-10">
                <div className="container max-w-2xl mx-auto">
                    <Button
                        onClick={handleSubmit}
                        disabled={!formData.raw_text.trim() || !formData.life_area || isSubmitting}
                        className="w-full py-4 text-lg shadow-lg"
                    >
                        {isSubmitting ? 'Saving...' : 'Complete Check-in'}
                    </Button>
                </div>
            </footer>
        </div>
    );
}
