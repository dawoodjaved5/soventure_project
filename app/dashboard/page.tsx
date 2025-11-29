'use client'

import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import LogoutButton from '@/components/LogoutButton'
import {
  User,
  Briefcase,
  FileText,
  Brain,
  TrendingUp,
  Award,
  Calendar,
  Target,
  Code,
  Building2
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'
import Link from 'next/link'

interface Profile {
  id: string
  name: string | null
  avatar_url: string | null
  resume_url: string | null
  skills: string[] | null
  experience: any
  education: any
  projects: any
}

interface JobMatch {
  id: string
  title: string
  company: string
  score: number
  date_found: string
}

interface InterviewHistory {
  id: string
  company: string
  role: string
  date: string
  questions: any
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [jobs, setJobs] = useState<JobMatch[]>([])
  const [interviews, setInterviews] = useState<InterviewHistory[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (!authUser) {
        redirect('/login')
        return
      }

      setUser(authUser)

      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single()

      setProfile(profileData)

      // Load job matches
      const { data: jobsData } = await supabase
        .from('job_matches')
        .select('*')
        .eq('user_id', authUser.id)
        .order('date_found', { ascending: false })
        .limit(10)

      setJobs(jobsData || [])

      // Load interview history
      const { data: interviewsData } = await supabase
        .from('interview_history')
        .select('*')
        .eq('user_id', authUser.id)
        .order('date', { ascending: false })
        .limit(5)

      setInterviews(interviewsData || [])

    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  // Prepare chart data
  const skillsData = profile?.skills?.slice(0, 6).map(skill => ({
    name: skill,
    value: 1
  })) || []

  const jobScoresData = jobs.slice(0, 5).map(job => ({
    name: job.company.substring(0, 15),
    score: job.score,
    title: job.title
  }))

  const interviewTimelineData = interviews.map(interview => ({
    date: new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    questions: interview.questions?.length || 0,
    company: interview.company
  }))

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']

  const stats = [
    {
      icon: FileText,
      label: 'Resume Uploaded',
      value: profile?.resume_url ? 'Yes' : 'No',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50'
    },
    {
      icon: Briefcase,
      label: 'Job Matches',
      value: jobs.length,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50'
    },
    {
      icon: Brain,
      label: 'Interviews Prepped',
      value: interviews.length,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50'
    },
    {
      icon: Code,
      label: 'Skills',
      value: profile?.skills?.length || 0,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50'
    }
  ]

  const quickActions = [
    {
      icon: FileText,
      label: 'Upload Resume',
      href: '/upload-resume',
      color: 'from-blue-600 to-cyan-600',
      description: 'Upload and parse your resume'
    },
    {
      icon: Briefcase,
      label: 'Discover Jobs',
      href: '/jobs',
      color: 'from-purple-600 to-pink-600',
      description: 'Find AI-matched opportunities'
    },
    {
      icon: Brain,
      label: 'Interview Prep',
      href: '/interview',
      color: 'from-orange-600 to-red-600',
      description: 'Generate practice questions'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">
                  Welcome back{profile?.name ? `, ${profile.name}` : ''}!
                </h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-600 mb-1">{stat.label}</p>
              <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {quickActions.map((action, idx) => (
            <Link
              key={idx}
              href={action.href}
              className="group bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`bg-gradient-to-r ${action.color} p-4 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{action.label}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </Link>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Skills Distribution */}
          {skillsData.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <Code className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Top Skills</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={skillsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name }) => name}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {skillsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Job Match Scores */}
          {jobScoresData.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Job Match Scores</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobScoresData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Interview Timeline */}
        {interviewTimelineData.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <Calendar className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Interview Prep Timeline</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={interviewTimelineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="questions"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          {jobs.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Recent Job Matches</h2>
                </div>
                <Link href="/jobs" className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {jobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{job.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Building2 className="w-4 h-4" />
                          <span>{job.company}</span>
                        </div>
                      </div>
                      <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        {job.score}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Interviews */}
          {interviews.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-orange-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Recent Interview Prep</h2>
                </div>
                <Link href="/interview" className="text-orange-600 hover:text-orange-700 font-semibold text-sm">
                  View All →
                </Link>
              </div>
              <div className="space-y-4">
                {interviews.slice(0, 3).map((interview) => (
                  <div
                    key={interview.id}
                    className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200 hover:shadow-lg transition-all duration-300"
                  >
                    <h3 className="font-bold text-gray-900 mb-1">
                      {interview.company} - {interview.role}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {new Date(interview.date).toLocaleDateString()} • {interview.questions?.length || 0} questions
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
