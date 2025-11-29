'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Brain, Building2, Code, Loader2, MessageSquare, Lightbulb, Clock, ChevronDown, ChevronUp } from 'lucide-react'

interface InterviewQuestion {
    question: string
    type: 'technical' | 'behavioral' | 'system_design'
    difficulty: 'easy' | 'medium' | 'hard'
    answer?: string
    explanation?: string
}

interface InterviewHistory {
    id: string
    company: string
    role: string
    tech_stack: string[]
    date: string
    questions: InterviewQuestion[]
}

export default function InterviewPrepPage() {
    const [company, setCompany] = useState('')
    const [role, setRole] = useState('')
    const [techStack, setTechStack] = useState('')
    const [generating, setGenerating] = useState(false)
    const [questions, setQuestions] = useState<InterviewQuestion[]>([])
    const [history, setHistory] = useState<InterviewHistory[]>([])
    const [error, setError] = useState<string | null>(null)
    const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set())

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    useEffect(() => {
        loadHistory()
    }, [])

    const loadHistory = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('interview_history')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false })
                .limit(10)

            if (error) throw error
            setHistory(data || [])
        } catch (err: any) {
            console.error('Failed to load history:', err)
        }
    }

    const generateInterview = async () => {
        if (!company || !role) {
            setError('Please fill in company and role')
            return
        }

        try {
            setGenerating(true)
            setError(null)

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setError('You must be logged in')
                return
            }

            const techStackArray = techStack
                .split(',')
                .map(t => t.trim())
                .filter(t => t.length > 0)

            // Call Edge Function
            const { data, error: functionError } = await supabase.functions.invoke('interview_generator', {
                body: {
                    userId: user.id,
                    company,
                    role,
                    techStack: techStackArray
                }
            })

            if (functionError) throw functionError

            setQuestions(data.questions || [])
            await loadHistory()

        } catch (err: any) {
            setError(err.message || 'Failed to generate interview questions')
        } finally {
            setGenerating(false)
        }
    }

    const toggleQuestion = (index: number) => {
        const newExpanded = new Set(expandedQuestions)
        if (newExpanded.has(index)) {
            newExpanded.delete(index)
        } else {
            newExpanded.add(index)
        }
        setExpandedQuestions(newExpanded)
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-800 border-green-300'
            case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
            case 'hard': return 'bg-red-100 text-red-800 border-red-300'
            default: return 'bg-gray-100 text-gray-800 border-gray-300'
        }
    }

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'technical': return <Code className="w-5 h-5" />
            case 'behavioral': return <MessageSquare className="w-5 h-5" />
            case 'system_design': return <Brain className="w-5 h-5" />
            default: return <MessageSquare className="w-5 h-5" />
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'technical': return 'from-blue-500 to-cyan-500'
            case 'behavioral': return 'from-purple-500 to-pink-500'
            case 'system_design': return 'from-orange-500 to-red-500'
            default: return 'from-gray-500 to-gray-600'
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                        Interview Preparation
                    </h1>
                    <p className="text-lg text-gray-600">
                        Generate AI-powered technical and behavioral interview questions
                    </p>
                </div>

                {/* Input Form */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Company Name *
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="e.g., Google, Microsoft, Startup XYZ"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-700"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Role *
                            </label>
                            <div className="relative">
                                <Brain className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="e.g., Senior Software Engineer"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tech Stack (comma-separated)
                        </label>
                        <div className="relative">
                            <Code className="absolute left-4 top-4 text-gray-400 w-5 h-5" />
                            <textarea
                                placeholder="e.g., React, Node.js, PostgreSQL, AWS"
                                value={techStack}
                                onChange={(e) => setTechStack(e.target.value)}
                                rows={3}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-gray-700 resize-none"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    <button
                        onClick={generateInterview}
                        disabled={generating}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                        {generating ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Generating Questions...</span>
                            </>
                        ) : (
                            <>
                                <Brain className="w-5 h-5" />
                                <span>Generate Interview Questions</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Generated Questions */}
                {questions.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">
                            Generated Questions for {company} - {role}
                        </h2>

                        <div className="space-y-4">
                            {questions.map((q, idx) => (
                                <div
                                    key={idx}
                                    className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-purple-300 transition-all duration-300"
                                >
                                    <div
                                        onClick={() => toggleQuestion(idx)}
                                        className="cursor-pointer bg-gradient-to-r from-gray-50 to-gray-100 p-5 flex items-start justify-between hover:from-purple-50 hover:to-pink-50 transition-all duration-300"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-3 mb-2">
                                                <div className={`bg-gradient-to-r ${getTypeColor(q.type)} p-2 rounded-lg text-white`}>
                                                    {getTypeIcon(q.type)}
                                                </div>
                                                <span className="text-xs font-bold uppercase tracking-wide text-gray-600">
                                                    {q.type.replace('_', ' ')}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(q.difficulty)}`}>
                                                    {q.difficulty}
                                                </span>
                                            </div>
                                            <p className="text-lg font-semibold text-gray-800 leading-relaxed">
                                                {q.question}
                                            </p>
                                        </div>
                                        <div className="ml-4">
                                            {expandedQuestions.has(idx) ? (
                                                <ChevronUp className="w-6 h-6 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                    </div>

                                    {expandedQuestions.has(idx) && (
                                        <div className="p-5 bg-white border-t-2 border-gray-100">
                                            {q.answer && (
                                                <div className="mb-4">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <MessageSquare className="w-5 h-5 text-green-600" />
                                                        <h4 className="font-bold text-gray-800">Sample Answer:</h4>
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed bg-green-50 p-4 rounded-lg border border-green-200">
                                                        {q.answer}
                                                    </p>
                                                </div>
                                            )}

                                            {q.explanation && (
                                                <div>
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                                                        <h4 className="font-bold text-gray-800">Explanation:</h4>
                                                    </div>
                                                    <p className="text-gray-700 leading-relaxed bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                                                        {q.explanation}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Interview History */}
                {history.length > 0 && (
                    <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                        <div className="flex items-center space-x-3 mb-6">
                            <Clock className="w-8 h-8 text-purple-600" />
                            <h2 className="text-3xl font-bold text-gray-800">Interview History</h2>
                        </div>

                        <div className="space-y-4">
                            {history.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200 hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 mb-1">
                                                {item.company} - {item.role}
                                            </h3>
                                            <p className="text-sm text-gray-600 mb-3">
                                                {new Date(item.date).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                            {item.tech_stack && item.tech_stack.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {item.tech_stack.map((tech, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold"
                                                        >
                                                            {tech}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4 bg-white rounded-lg px-4 py-2 border border-purple-300">
                                            <p className="text-2xl font-bold text-purple-600">
                                                {item.questions?.length || 0}
                                            </p>
                                            <p className="text-xs text-gray-600">Questions</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
