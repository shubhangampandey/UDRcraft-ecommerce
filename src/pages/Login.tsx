import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const location = useLocation();
const navigate = useNavigate();
const from = location.state?.from?.pathname || "/checkout";
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <main className="pt-20 md:pt-24 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-12">
          <h1 className="luxury-heading mb-3">Welcome To UDRcraft</h1>
          <p className="luxury-subheading">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="border border-destructive/50 bg-destructive/5 text-destructive text-sm p-3 font-body">
              {error}
            </div>
          )}

          <div>
            <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-foreground transition-colors"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-foreground transition-colors pr-10"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background py-3.5 font-body text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="font-body text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/register" className="text-foreground underline luxury-hover">Create one</Link>
          </p>
        </div>

        

        <div className="py-20" />
      </div>
    </main>
  );
};

export default Login;
