import { redirect } from 'next/navigation'
import { createServerClient } from '@/utils/supabase/server'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const supabase = await createServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  
  const profile = data as { full_name: string | null; avatar_url: string | null } | null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                Welcome to your Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                You're successfully authenticated!
              </p>
            </div>
            <LogoutButton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                User Information
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-base text-gray-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">User ID</p>
                  <p className="text-base text-gray-900 font-mono text-sm">
                    {user.id}
                  </p>
                </div>
                {profile?.full_name && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Full Name
                    </p>
                    <p className="text-base text-gray-900">
                      {profile.full_name}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Last Sign In
                  </p>
                  <p className="text-base text-gray-900">
                    {user.last_sign_in_at
                      ? new Date(user.last_sign_in_at).toLocaleString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Authentication Status
              </h2>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <p className="ml-3 text-sm text-gray-900">Authenticated</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Provider
                  </p>
                  <p className="text-base text-gray-900 capitalize">
                    {user.app_metadata?.provider || 'email'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Email Verified
                  </p>
                  <p className="text-base text-gray-900">
                    {user.email_confirmed_at ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {profile?.avatar_url && (
            <div className="mt-6">
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-primary-200"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
