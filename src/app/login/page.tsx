import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#F7F6F3]">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded shadow-sm border border-[#E9E9E7]">
                <div className="text-center">
                    <div className="text-5xl mb-4">🐈</div>
                    <h2 className="text-2xl font-bold text-[#37352F]">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-[#787774]">
                        Sign in to continue your reading journey
                    </p>
                </div>

                <div className="mt-8">
                    <button type="button" className="w-full flex items-center justify-center px-4 py-3 border border-[#E9E9E7] rounded hover:bg-[#F2F1EE] transition-colors text-sm font-medium text-[#37352F]">
                        <svg aria-hidden="true" className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.26.81-.58z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#E9E9E7]"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-[#9B9A97]">Or continue with email</span>
                    </div>
                </div>

                <form className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#37352F]">Email address</label>
                        <div className="mt-1">
                            <input type="email" name="email" id="email" className="block w-full px-3 py-2 rounded border border-[#E9E9E7] shadow-sm focus:ring-black focus:border-black sm:text-sm" placeholder="you@example.com" />
                        </div>
                    </div>

                    <Link href="/dashboard" className="w-full flex justify-center py-2 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-[#6D4C41] hover:bg-[#5D4037] transition-colors">
                        Sign in
                    </Link>
                </form>
            </div>
        </div>
    );
}
