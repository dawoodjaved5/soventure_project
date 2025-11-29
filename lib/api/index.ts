import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Resume API
export const resumeAPI = {
    async uploadResume(file: File, userId: string) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${userId}-${Date.now()}.${fileExt}`
        const filePath = `resumes/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('resumes')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('resumes')
            .getPublicUrl(filePath)

        return publicUrl
    },

    async parseResume(resumeUrl: string, userId: string) {
        const { data, error } = await supabase.functions.invoke('parse_resume', {
            body: { resumeUrl, userId }
        })

        if (error) throw error
        return data
    }
}

// Jobs API
export const jobsAPI = {
    async getJobMatches(userId: string) {
        const { data, error } = await supabase
            .from('job_matches')
            .select('*')
            .eq('user_id', userId)
            .order('date_found', { ascending: false })

        if (error) throw error
        return data
    },

    async discoverJobs(userId: string, query?: string) {
        const { data, error } = await supabase.functions.invoke('discover_jobs', {
            body: { userId, query }
        })

        if (error) throw error
        return data
    }
}

// Interview API
export const interviewAPI = {
    async getInterviewHistory(userId: string) {
        const { data, error } = await supabase
            .from('interview_history')
            .select('*')
            .eq('user_id', userId)
            .order('date', { ascending: false })

        if (error) throw error
        return data
    },

    async generateInterview(userId: string, company: string, role: string, techStack: string[]) {
        const { data, error } = await supabase.functions.invoke('interview_generator', {
            body: { userId, company, role, techStack }
        })

        if (error) throw error
        return data
    }
}

// Profile API
export const profileAPI = {
    async getProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single()

        if (error) throw error
        return data
    },

    async updateProfile(userId: string, updates: any) {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single()

        if (error) throw error
        return data
    }
}
