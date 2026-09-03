import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';
import FluidDropdown from '../components/FluidDropdown';

const ROLE_OPTIONS = [
  { value: 'admin', label: 'Administrator' },
  { value: 'finance_manager', label: 'Finance Manager' },
  { value: 'operations_manager', label: 'Operations Manager' },
  { value: 'clinical_manager', label: 'Clinical Manager' }
];

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'admin' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await register(form.name, form.email, form.password, form.role);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (email, password) => {
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-950 p-4">
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl 
            bg-primary-600 shadow-lg shadow-primary-600/20 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-primary-700">HospIntel</h1>
          <p className="text-surface-500 text-sm mt-1">Healthcare Intelligence Platform</p>
        </div>

        {/* Card */}
        <div className="bg-surface-900/80 backdrop-blur-xl border border-surface-700/50 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-surface-100 mb-6">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-surface-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-surface-800 border border-surface-600 rounded-lg px-4 py-2.5 text-surface-200
                    focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                  placeholder="Dr. Rajesh Kumar"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-surface-400 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-surface-800 border border-surface-600 rounded-lg px-4 py-2.5 text-surface-200
                  focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                placeholder="admin@hospintel.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-surface-400 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-surface-800 border border-surface-600 rounded-lg px-4 py-2.5 pr-10 text-surface-200
                    focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="z-20 relative">
                <label className="block text-sm text-surface-400 mb-1">Role</label>
                <FluidDropdown
                  options={ROLE_OPTIONS}
                  value={form.role}
                  onChange={(val) => setForm({ ...form, role: val })}
                  className="w-full"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-50"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign In'}
            </button>
          </div>

          {/* Demo Credentials */}
          {isLogin && (
            <div className="mt-6 pt-6 border-t border-surface-700/50">
              <p className="text-xs text-surface-500 mb-3 text-center">Quick Demo Access</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Admin', email: 'admin@hospintel.com', pw: 'admin123' },
                  { label: 'Finance', email: 'finance@hospintel.com', pw: 'finance123' },
                  { label: 'Operations', email: 'operations@hospintel.com', pw: 'operations123' },
                  { label: 'Clinical', email: 'clinical@hospintel.com', pw: 'clinical123' },
                ].map((demo) => (
                  <ShiningButton
                    key={demo.label}
                    label={demo.label}
                    onClick={() => demoLogin(demo.email, demo.pw)}
                    disabled={loading}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ShiningButton({ label, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="group/shine w-full cursor-pointer rounded-xl border-2 border-primary-600/0 bg-transparent p-0.5 transition-colors duration-500 hover:border-primary-600/100 disabled:opacity-50"
    >
      <div className="relative flex items-center justify-between overflow-hidden rounded-lg bg-primary-600 px-3 py-2 font-semibold text-white text-xs shadow-sm">
        {label}
        <ArrowRight className="w-3 h-3 transition-all duration-700 ease-in-out group-hover/shine:translate-x-1 group-hover/shine:scale-125" />
        <div
          className="absolute -left-16 top-0 h-full w-10 rotate-[30deg] scale-y-150 bg-white/20 transition-all duration-700 ease-in-out group-hover/shine:left-[calc(100%+1rem)]"
        />
      </div>
    </button>
  );
}

