'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Upload, FileText, CheckCircle, Loader2, User, Briefcase, GraduationCap, Code } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function UploadResumePage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [parsing, setParsing] = useState(false)
  const [parsedData, setParsedData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf') {
        setFile(selectedFile)
        setError(null)
      } else {
        setError('Please select a PDF file')
        setFile(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    try {
      setUploading(true)
      setError(null)

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('You must be logged in to upload a resume')
        return
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}-${Date.now()}.${fileExt}`
      const filePath = `resumes/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath)

      setUploading(false)
      setParsing(true)

      // Call Edge Function to parse resume
      const { data, error: functionError } = await supabase.functions.invoke('parse_resume', {
        body: { 
          resumeUrl: publicUrl,
          userId: user.id 
        }
      })

      if (functionError) throw functionError

      setParsedData(data)
      setParsing(false)

    } catch (err: any) {
      setError(err.message || 'An error occurred')
      setUploading(false)
      setParsing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Upload Your Resume
          </h1>
          <p className="text-lg text-gray-600">
            Let AI analyze your resume and unlock personalized job opportunities
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col items-center">
            {!file ? (
              <label className="w-full cursor-pointer">
                <div className="border-3 border-dashed border-indigo-300 rounded-2xl p-12 text-center hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300">
                  <Upload className="w-16 h-16 mx-auto mb-4 text-indigo-500" />
                  <p className="text-xl font-semibold text-gray-700 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">PDF files only (Max 10MB)</p>
                </div>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="w-full">
                <div className="flex items-center justify-between bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 mb-6">
                  <div className="flex items-center space-x-4">
                    <FileText className="w-10 h-10 text-indigo-600" />
                    <div>
                      <p className="font-semibold text-gray-800">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={uploading || parsing}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  {uploading || parsing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{uploading ? 'Uploading...' : 'Parsing Resume...'}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      <span>Upload & Parse Resume</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-center">{error}</p>
            </div>
          )}
        </div>

        {/* Parsed Data Display */}
        {parsedData && (
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-800">Resume Parsed Successfully!</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Skills */}
              {parsedData.skills && parsedData.skills.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <Code className="w-6 h-6 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {parsedData.skills.map((skill: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {parsedData.experience && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <Briefcase className="w-6 h-6 text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
                  </div>
                  <div className="space-y-3">
                    {Array.isArray(parsedData.experience) ? (
                      parsedData.experience.map((exp: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-lg p-3">
                          <p className="font-semibold text-gray-800">{exp.title || exp.role}</p>
                          <p className="text-sm text-gray-600">{exp.company}</p>
                          <p className="text-xs text-gray-500">{exp.duration || exp.period}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600">{JSON.stringify(parsedData.experience)}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Education */}
              {parsedData.education && (
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <GraduationCap className="w-6 h-6 text-green-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Education</h3>
                  </div>
                  <div className="space-y-3">
                    {Array.isArray(parsedData.education) ? (
                      parsedData.education.map((edu: any, idx: number) => (
                        <div key={idx} className="bg-white rounded-lg p-3">
                          <p className="font-semibold text-gray-800">{edu.degree}</p>
                          <p className="text-sm text-gray-600">{edu.institution || edu.school}</p>
                          <p className="text-xs text-gray-500">{edu.year || edu.period}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-600">{JSON.stringify(parsedData.education)}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Projects */}
              {parsedData.projects && parsedData.projects.length > 0 && (
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 border border-orange-200">
                  <div className="flex items-center space-x-2 mb-4">
                    <User className="w-6 h-6 text-orange-600" />
                    <h3 className="text-lg font-semibold text-gray-800">Projects</h3>
                  </div>
                  <div className="space-y-3">
                    {parsedData.projects.map((project: any, idx: number) => (
                      <div key={idx} className="bg-white rounded-lg p-3">
                        <p className="font-semibold text-gray-800">{project.name || project.title}</p>
                        <p className="text-sm text-gray-600">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={() => router.push('/jobs')}
                className="bg-gradient-to-r from-green-600 to-teal-600 text-white font-bold py-3 px-8 rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Discover Jobs
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-gray-600 to-gray-700 text-white font-bold py-3 px-8 rounded-xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
