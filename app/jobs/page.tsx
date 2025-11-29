'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Search, Briefcase, Building2, TrendingUp, ExternalLink, Loader2, Star, MapPin, DollarSign } from 'lucide-react'

interface JobMatch {
    id: string
    title: string
    company: string
    link: string
    score: number
    reasons: string
    requirements: string[]
    date_found: string
    location?: string
    salary?: string
}

export default function JobDiscoveryPage() {
    const [jobs, setJobs] = useState<JobMatch[]>([])
    const [loading, setLoading] = useState(false)
    const [discovering, setDiscovering] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Load existing job matches
    useEffect(() => {
        loadJobs()
    }, [])

    const loadJobs = async () => {
        try {
            setLoading(true)
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data, error } = await supabase
                .from('job_matches')
                .select('*')
                .eq('user_id', user.id)
                .order('date_found', { ascending: false })

            if (error) throw error
            setJobs(data || [])
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const discoverJobs = async () => {
        try {
            setDiscovering(true)
            setError(null)

            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                setError('You must be logged in')
                return
            }

            // Call Edge Function
            const { data, error: functionError } = await supabase.functions.invoke('discover_jobs', {
                body: {
                    userId: user.id,
                    query: searchQuery || undefined
                }
            })

            if (functionError) throw functionError

            // Reload jobs
            await loadJobs()

        } catch (err: any) {
            setError(err.message || 'Failed to discover jobs')
        } finally {
            setDiscovering(false)
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'from-green-500 to-emerald-500'
        if (score >= 60) return 'from-blue-500 to-cyan-500'
        if (score >= 40) return 'from-yellow-500 to-orange-500'
        return 'from-red-500 to-pink-500'
    }

    const getScoreBadgeColor = (score: number) => {
        if (score >= 80) return 'bg-green-100 text-green-800 border-green-300'
        if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-300'
        if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
        return 'bg-red-100 text-red-800 border-red-300'
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                        Job Discovery
                    </h1>
                    <p className="text-lg text-gray-600">
                        AI-powered job matching based on your resume and skills
                    </p>
                </div>

                {/* Search & Discover Section */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search for specific roles or companies (optional)..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-gray-700 font-medium"
                                />
                            </div>
                        </div>
                        <button
                            onClick={discoverJobs}
                            disabled={discovering}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 whitespace-nowrap"
                        >
                            {discovering ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Discovering...</span>
                                </>
                            ) : (
                                <>
                                    <TrendingUp className="w-5 h-5" />
                                    <span>Discover Jobs</span>
                                </>
                            )}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}
                </div>

                {/* Jobs List */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
                        <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No Jobs Found</h3>
                        <p className="text-gray-500 mb-6">
                            Click "Discover Jobs" to find personalized job matches
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {jobs.map((job) => (
                            <div
                                key={job.id}
                                className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                            >
                                {/* Score Bar */}
                                <div className={`h-2 bg-gradient-to-r ${getScoreColor(job.score)}`} />

                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                                        <div className="flex-1">
                                            <div className="flex items-start space-x-3 mb-3">
                                                <div className="bg-indigo-100 p-3 rounded-xl">
                                                    <Briefcase className="w-6 h-6 text-indigo-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                                                        {job.title}
                                                    </h3>
                                                    <div className="flex items-center space-x-2 text-gray-600">
                                                        <Building2 className="w-4 h-4" />
                                                        <span className="font-medium">{job.company}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Additional Info */}
                                            <div className="flex flex-wrap gap-3 mb-4">
                                                {job.location && (
                                                    <div className="flex items-center space-x-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>{job.location}</span>
                                                    </div>
                                                )}
                                                {job.salary && (
                                                    <div className="flex items-center space-x-1 text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                                                        <DollarSign className="w-4 h-4" />
                                                        <span>{job.salary}</span>
                                                    </div>
                                                )}
                                                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                                    {new Date(job.date_found).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Match Score */}
                                        <div className="flex flex-col items-end space-y-2">
                                            <div className={`px-4 py-2 rounded-xl border-2 ${getScoreBadgeColor(job.score)}`}>
                                                <div className="flex items-center space-x-2">
                                                    <Star className="w-5 h-5" />
                                                    <span className="text-2xl font-bold">{job.score}%</span>
                                                </div>
                                                <p className="text-xs font-medium">Match Score</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Reasons */}
                                    {job.reasons && (
                                        <div className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                                            <p className="text-sm font-semibold text-gray-700 mb-2">Why this matches:</p>
                                            <p className="text-sm text-gray-600 leading-relaxed">{job.reasons}</p>
                                        </div>
                                    )}

                                    {/* Requirements */}
                                    {job.requirements && job.requirements.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-sm font-semibold text-gray-700 mb-2">Key Requirements:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {job.requirements.map((req, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                                                    >
                                                        {req}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Apply Button */}
                                    <a
                                        href={job.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                                    >
                                        <span>View Job</span>
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
