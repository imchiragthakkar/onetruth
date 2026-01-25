import React from 'react'
import { ArrowLeft, BookOpen, Sun, Sparkles } from 'lucide-react'
import { Button } from './ui/Button'
import { useWisdomStore } from '../store/useWisdomStore'

export const StoryView = () => {
    const { closeStory, getContentForUser } = useWisdomStore()
    const content = getContentForUser()

    if (!content) return null

    return (
        <div className="fixed inset-0 z-50 bg-secondary-100 overflow-y-auto animate-slide-up">
            {/* Header */}
            <div className="sticky top-0 bg-white/80 backdrop-blur-md p-4 border-b border-gray-100 flex items-center justify-between z-10">
                <Button variant="ghost" onClick={closeStory} className="text-gray-600">
                    <ArrowLeft size={20} className="mr-2" /> Back
                </Button>
                <h2 className={`font-serif font-bold text-xl ${content.categoryColor}`}>
                    {content.categoryName}
                </h2>
                <div className="w-10" /> {/* Spacer */}
            </div>

            <div className="max-w-2xl mx-auto p-6 space-y-24 pb-32">

                {/* Section 1: The Situation (Logic) */}
                <section className="min-h-[50vh] flex flex-col justify-center text-center space-y-6">
                    <div className={`mx-auto p-4 rounded-full ${content.categoryBg} w-fit`}>
                        <Sparkles size={32} className={content.categoryColor} />
                    </div>
                    <h3 className="text-2xl font-serif text-gray-800 leading-relaxed">
                        "{content.logic}"
                    </h3>
                </section>

                {/* Section 2: The Truth */}
                <section className="bg-white p-8 rounded-3xl shadow-xl border border-primary-100 transform -rotate-1">
                    <div className="flex items-center gap-3 mb-4 text-primary-500">
                        <Sun size={24} />
                        <span className="font-bold tracking-widest uppercase text-xs">The Truth</span>
                    </div>
                    <p className="text-3xl font-serif font-bold text-gray-900 leading-tight">
                        {content.truth}
                    </p>
                </section>

                {/* Section 3: The Principle */}
                <section className="border-l-4 border-accent pl-6 py-2">
                    <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">The Principle</span>
                    <p className="text-xl text-gray-700 mt-2 font-medium">
                        {content.principle}
                    </p>
                </section>

                {/* Section 4: The Story */}
                <section className="bg-secondary p-8 rounded-3xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 bg-accent opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-6 text-gray-500">
                            <BookOpen size={20} />
                            <span className="text-sm font-bold uppercase tracking-wider">Story Mode</span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-gray-900 mb-2">
                            {content.story.title}
                        </h3>
                        <p className="text-gray-600 italic mb-6">
                            "{content.story.summary}"
                        </p>
                        <div className="prose prose-lg text-gray-700 leading-relaxed font-serif">
                            {content.story.fullText}
                        </div>
                        <div className="mt-8 pt-6 border-t border-gray-200/50">
                            <p className="font-bold text-primary-600 flex items-center gap-2">
                                <span className="text-2xl">✨</span>
                                Moral: {content.story.moral}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 5: The Action */}
                <section className="bg-gray-900 text-white p-10 rounded-3xl text-center space-y-6">
                    <h3 className="text-xl font-medium text-gray-300">Your Practice for Today</h3>
                    <p className="text-2xl font-serif font-bold text-accent">
                        {content.action}
                    </p>
                    <Button onClick={closeStory} className="bg-white text-gray-900 hover:bg-gray-100 w-full md:w-auto px-8">
                        I Will Do This
                    </Button>
                </section>

            </div>
        </div>
    )
}
