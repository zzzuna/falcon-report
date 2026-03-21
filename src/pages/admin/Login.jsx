import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthContext';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/admin');
        } catch (err) {
            setError('Failed to sign in. Hint: use "admin" in email for mockup access.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-black font-sans px-4">
            <div className="max-w-md w-full relative">
                <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full z-0"></div>
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl z-10 relative">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg transform rotate-3">
                            <span className="text-2xl font-black text-white transform -rotate-3">FI</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">Falcon Island Portal</h2>
                    </div>

                    {error && <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-3 rounded-lg text-sm mb-6 text-center">{error}</div>}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                                placeholder="admin@falconisland.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-300 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all active:scale-[0.98] mt-4 disabled:opacity-50"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <span className="text-sm text-slate-600 font-medium">Restricted Access Portal</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
