import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { resumeUrl, userId } = await req.json()

        if (!resumeUrl || !userId) {
            throw new Error('Missing resumeUrl or userId')
        }

        // Initialize Supabase client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // TODO: Implement actual PDF parsing logic here
        // For now, return a mock response to verify connection
        const mockParsedData = {
            skills: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Node.js', 'Supabase'],
            experience: [
                {
                    role: 'Senior Frontend Developer',
                    company: 'Tech Corp',
                    period: '2020 - Present',
                    description: 'Leading frontend development using React and Next.js.'
                },
                {
                    role: 'Web Developer',
                    company: 'StartUp Inc',
                    period: '2018 - 2020',
                    description: 'Full stack development with Node.js and React.'
                }
            ],
            education: [
                {
                    degree: 'B.S. Computer Science',
                    school: 'University of Technology',
                    year: '2018'
                }
            ],
            projects: [
                {
                    name: 'E-commerce Platform',
                    description: 'Built a full-featured e-commerce site using Next.js and Stripe.'
                }
            ]
        }

        return new Response(
            JSON.stringify(mockParsedData),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            },
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            },
        )
    }
})
