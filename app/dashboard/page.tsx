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
  Code,
  Building2,
  Activity,
  Target,
  Calendar,
  CheckCircle,
  Clock
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
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadialBarChart,
  RadialBar
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
        .limit(20)

      setJobs(jobsData || [])

      // Load interview history
      const { data: interviewsData } = await supabase
        .from('interview_history')
        .select('*')
        .eq('user_id', authUser.id)
        .order('date', { ascending: false })
        .limit(10)

      setInterviews(interviewsData || [])

    } catch (error) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  // Chart data preparations
  const skillsData = profile?.skills?.slice(0, 8).map((skill, index) => ({
    name: skill,
    value: 100 - (index * 10),
    fullMark: 100
  })) || []

  const jobScoresData = jobs.slice(0, 10).map(job => ({
    name: job.company.substring(0, 12),
    score: job.score,
    title: job.title
  }))

  const interviewTimelineData = interviews.map((interview, index) => ({
    date: new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    questions: interview.questions?.length || 0,
    company: interview.company,
    index: interviews.length - index
  }))

  const activityData = [
    { week: 'Week 1', jobs: Math.min(jobs.filter(j => new Date(j.date_found) > new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)).length, 5), interviews: Math.min(interviews.length, 2) },
    { week: 'Week 2', jobs: Math.min(jobs.filter(j => new Date(j.date_found) > new Date(Date.now() - 21 * 24 * 60 * 60 * 1000)).length, 8), interviews: Math.min(interviews.length, 3) },
    { week: 'Week 3', jobs: Math.min(jobs.filter(j => new Date(j.date_found) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)).length, 10), interviews: Math.min(interviews.length, 4) },
    { week: 'Week 4', jobs: jobs.length, interviews: interviews.length },
  ]

  const scoreDistribution = [
    { range: '0-20', count: jobs.filter(j => j.score <= 20).length },
    { range: '21-40', count: jobs.filter(j => j.score > 20 && j.score <= 40).length },
    { range: '41-60', count: jobs.filter(j => j.score > 40 && j.score <= 60).length },
    { range: '61-80', count: jobs.filter(j => j.score > 60 && j.score <= 80).length },
    { range: '81-100', count: jobs.filter(j => j.score > 80).length },
  ]

  const progressData = [
    { metric: 'Resume', value: profile?.resume_url ? 100 : 0 },
    { metric: 'Skills', value: Math.min((profile?.skills?.length || 0) * 10, 100) },
    { metric: 'Jobs', value: Math.min(jobs.length * 5, 100) },
    { metric: 'Interviews', value: Math.min(interviews.length * 10, 100) },
  ]

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#06b6d4']

  const stats = [
    {
      icon: FileText,
      label: 'Resume Status',
      value: profile?.resume_url ? 'Uploaded' : 'Pending',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      change: profile?.resume_url ? '✓ Complete' : 'Upload needed'
    },
    {
      icon: Briefcase,
      label: 'Job Matches',
      value: jobs.length,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      change: `${jobs.filter(j => new Date(j.date_found) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length} this week`
    },
    {
      icon: Brain,
      label: 'Interviews Prepped',
      value: interviews.length,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      change: `${interviews.reduce((sum, i) => sum + (i.questions?.length || 0), 0)} questions`
    },
    {
      icon: Code,
      label: 'Skills Tracked',
      value: profile?.skills?.length || 0,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      change: 'Keep learning!'
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
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full blur-3xl opacity-30 -mr-32 -mt-32"></div>
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 rounded-2xl shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900">
                  Welcome back{profile?.name ? `, ${profile.name}` : ''}!
                </h1>
                <p className="text-gray-600 flex items-center mt-1">
                  <Activity className="w-4 h-4 mr-2" />
                  {user?.email}
                </p>
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
              className={`bg-gradient-to-br ${stat.bgColor} rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`bg-gradient-to-r ${stat.color} p-3 rounded-xl shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  {stat.change}
                </span>
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
              className="group bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -mr-16 -mt-16"></div>
              <div className={`bg-gradient-to-r ${action.color} p-4 rounded-xl inline-block mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <action.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{action.label}</h3>
              <p className="text-gray-600 text-sm">{action.description}</p>
            </Link>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Skills Radar Chart */}
          {skillsData.length > 0 && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <Code className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900">Skills Proficiency</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={skillsData}>
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#6b7280' }} />
                  <Radar
                    name="Proficiency"
                    dataKey="value"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Job Match Scores Bar Chart */}
          {jobScoresData.length > 0 && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Top Job Matches</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={jobScoresData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                    {jobScoresData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* More Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Activity Area Chart */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <Activity className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Activity Overview</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorInterviews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="week" tick={{ fill: '#6b7280' }} />
                <YAxis tick={{ fill: '#6b7280' }} />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="jobs"
                  stroke="#8b5cf6"
                  fillOpacity={1}
                  fill="url(#colorJobs)"
                  name="Jobs Discovered"
                />
                <Area
                  type="monotone"
                  dataKey="interviews"
                  stroke="#ec4899"
                  fillOpacity={1}
                  fill="url(#colorInterviews)"
                  name="Interviews Prepped"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Progress Radial Chart */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="flex items-center space-x-3 mb-6">
              <Target className="w-6 h-6 text-orange-600" />
              <h2 className="text-2xl font-bold text-gray-900">Progress Metrics</h2>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="10%"
                outerRadius="90%"
                data={progressData}
                startAngle={180}
                endAngle={0}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                  fill="#8b5cf6"
                >
                  {progressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </RadialBar>
                <Legend
                  iconSize={10}
                  layout="vertical"
                  verticalAlign="middle"
                  align="right"
                />
                <Tooltip />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Score Distribution & Interview Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Score Distribution Pie Chart */}
          {scoreDistribution.some(s => s.count > 0) && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
                <h2 className="text-2xl font-bold text-gray-900">Match Score Distribution</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={scoreDistribution.filter(s => s.count > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.range}: ${entry.count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {scoreDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Interview Timeline */}
          {interviewTimelineData.length > 0 && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-6">
                <Calendar className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900">Interview Prep Timeline</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={interviewTimelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#6b7280' }} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="questions"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', r: 6 }}
                    activeDot={{ r: 8 }}
                    name="Questions Generated"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Jobs */}
          {jobs.length > 0 && (
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Recent Job Matches</h2>
                </div>
                <Link href="/jobs" className="text-purple-600 hover:text-purple-700 font-semibold text-sm flex items-center">
                  View All <TrendingUp className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="space-y-4">
                {jobs.slice(0, 3).map((job) => (
                  <div
                    key={job.id}
                    className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-1">{job.title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Building2 className="w-4 h-4" />
                          <span>{job.company}</span>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
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
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <Brain className="w-6 h-6 text-orange-600" />
                  <h2 className="text-2xl font-bold text-gray-900">Recent Interview Prep</h2>
                </div>
                <Link href="/interview" className="text-orange-600 hover:text-orange-700 font-semibold text-sm flex items-center">
                  View All <TrendingUp className="w-4 h-4 ml-1" />
                </Link>
              </div>
              <div className="space-y-4">
                {interviews.slice(0, 3).map((interview) => (
                  <div
                    key={interview.id}
                    className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <h3 className="font-bold text-gray-900 mb-1">
                      {interview.company} - {interview.role}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(interview.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm font-semibold text-orange-600 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {interview.questions?.length || 0} questions
                      </p>
                    </div>
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
