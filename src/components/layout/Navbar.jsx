import { Link, useNavigate } from 'react-router-dom'
import { Sun, LogOut, User } from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { Button } from '../ui/Button'

export function Navbar() {
    const { user, signOut } = useAuthStore()
    const navigate = useNavigate()

    const handleSignOut = async () => {
        await signOut()
        navigate('/')
    }

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-sun-100">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="flex items-center space-x-2">
                    <Sun className="text-sun-500 w-7 h-7 animate-spin-slow" />
                    <span className="text-xl font-serif font-bold text-gray-800 tracking-tight">Ansure</span>
                </Link>

                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <Link to="/dashboard">
                                <Button variant="ghost" size="sm">Hub</Button>
                            </Link>
                            <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
                                <div className="w-8 h-8 rounded-full bg-sun-100 flex items-center justify-center text-sun-700">
                                    <User size={16} />
                                </div>
                                <button onClick={handleSignOut} className="text-gray-400 hover:text-red-500 transition-colors">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <Link to="/auth">
                            <Button size="sm">Sign In</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    )
}
