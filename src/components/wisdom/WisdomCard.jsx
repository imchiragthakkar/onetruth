import { Sun, Brain, BookOpen, CheckCircle } from 'lucide-react'
import { Card } from '../ui/Card'

export function WisdomCard({ data }) {
    if (!data) return null;

    return (
        <div className="mt-8 mx-auto max-w-3xl w-full animate-slide-up">
            <Card className="p-6 md:p-10 relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                    <Sun size={150} className="text-sun-300" />
                </div>

                {/* Quote */}
                <div className="mb-8 text-center">
                    <h3 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 italic mb-4 leading-normal">
                        "{data.quote}"
                    </h3>
                    <div className="h-1 w-20 bg-sun-300 mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    {/* Explanation */}
                    <div className="bg-sun-50/50 p-6 rounded-2xl border border-sun-50">
                        <h4 className="flex items-center font-bold text-sun-700 mb-2">
                            <Brain size={18} className="mr-2" /> Meaning
                        </h4>
                        <p className="text-gray-700 leading-relaxed">{data.explanation}</p>
                    </div>

                    {/* Story */}
                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-50">
                        <h4 className="flex items-center font-bold text-blue-700 mb-2">
                            <BookOpen size={18} className="mr-2" /> Story
                        </h4>
                        <p className="text-gray-700 leading-relaxed">{data.story}</p>
                    </div>
                </div>

                {/* Practice */}
                <div className="mt-8 bg-green-50 p-6 rounded-2xl border border-green-100 flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-4 text-green-600 shrink-0">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <h4 className="font-bold text-green-800 mb-1">Daily Practice</h4>
                        <p className="text-green-800 font-medium">{data.practice}</p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
