'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, FileText, Briefcase, Brain } from 'lucide-react'

export default function Navigation() {
    const pathname = usePathname()

    const navItems = [
        {
            href: '/dashboard',
            label: 'Dashboard',
            icon: LayoutDashboard
        },
        {
            href: '/upload-resume',
            label: 'Upload Resume',
            icon: FileText
        },
        {
            href: '/jobs',
            label: 'Job Discovery',
            icon: Briefcase
        },
        {
            href: '/interview',
            label: 'Interview Prep',
            icon: Brain
        }
    ]

    return (
        <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-2 rounded-lg">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            Soventure
                        </span>
                    </div>

                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isActive
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden flex items-center space-x-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            const Icon = item.icon

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`p-2 rounded-lg transition-all duration-300 ${isActive
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </nav>
    )
}
