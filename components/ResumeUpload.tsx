'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'

interface ResumeUploadProps {
  userId: string
  currentResumeUrl?: string | null
}

export default function ResumeUpload({ userId, currentResumeUrl }: ResumeUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    
    if (!selectedFile) return

    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      setError('Please upload a PDF file only')
      return
    }

    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB')
      return
    }

    setError(null)
    setFile(selectedFile)
    setSuccess(false)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first')
      return
    }

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`

      // Delete old resume if it exists
      if (currentResumeUrl) {
        try {
          const urlParts = currentResumeUrl.split('/resumes/')
          if (urlParts.length >= 2) {
            const oldFileName = urlParts[1].split('?')[0] // Remove query params
            await supabase.storage
              .from('resumes')
              .remove([oldFileName])
          }
        } catch (err) {
          console.error('Error deleting old resume:', err)
          // Continue anyway - old file will be overwritten
        }
      }

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true // Allow overwriting
        })

      if (uploadError) {
        throw uploadError
      }

      // Get URL (use public URL if bucket is public, signed URL if private)
      const { data: urlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(fileName)

      // Update profile with resume URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ resume_url: urlData.publicUrl })
        .eq('id', userId)

      if (updateError) throw updateError

      setSuccess(true)
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Refresh the page to show updated resume
      setTimeout(() => {
        router.refresh()
      }, 1000)
    } catch (err: any) {
      console.error('Error uploading resume:', err)
      setError(err.message || 'Failed to upload resume. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentResumeUrl) return

    setUploading(true)
    setError(null)

    try {
      // Extract file name from URL
      const urlParts = currentResumeUrl.split('/resumes/')
      if (urlParts.length < 2) {
        throw new Error('Invalid resume URL')
      }

      const fileName = urlParts[1].split('?')[0] // Remove query params

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('resumes')
        .remove([fileName])

      if (deleteError) throw deleteError

      // Update profile to remove resume URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ resume_url: null })
        .eq('id', userId)

      if (updateError) throw updateError

      setSuccess(true)
      router.refresh()
    } catch (err: any) {
      console.error('Error deleting resume:', err)
      setError(err.message || 'Failed to delete resume. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-8">
      <div className="text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          stroke="currentColor"
          fill="none"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path
            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="mt-4">
          <label
            htmlFor="resume-upload"
            className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            {currentResumeUrl ? 'Replace Resume' : 'Upload Resume'}
          </label>
          <input
            id="resume-upload"
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
          <p className="mt-2 text-sm text-gray-600">
            PDF files only (max 5MB)
          </p>
        </div>

        {file && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="h-8 w-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        )}

        {currentResumeUrl && (
          <div className="mt-4 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="h-8 w-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-900">
                    Resume Uploaded
                  </p>
                  <a
                    href={currentResumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:text-green-700 underline"
                  >
                    View Resume
                  </a>
                </div>
              </div>
              <button
                onClick={handleDelete}
                disabled={uploading}
                className="ml-4 px-3 py-1 text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">
              {currentResumeUrl ? 'Resume deleted successfully!' : 'Resume uploaded successfully!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

