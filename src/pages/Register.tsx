import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'customer' as UserRole, storeName: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate(form.role === 'vendor' ? '/vendor' : '/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const update = (key: string, value: string) => setForm(p => ({ ...p, [key]: value }));

  return (
    <main className="pt-20 md:pt-24 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-12">
          <h1 className="luxury-heading mb-3">Create Account</h1>
          <p className="luxury-subheading">Join the UDRcraft community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="border border-destructive/50 bg-destructive/5 text-destructive text-sm p-3 font-body">{error}</div>
          )}

          {/* Role selector */}
          <div>
            <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-3 block">I want to</label>
            <div className="grid grid-cols-3 gap-2">
              {([
                { value: 'customer', label: 'Shop' },
                { value: 'vendor', label: 'Sell' },
                
              ] as { value: UserRole; label: string }[]).map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update('role', opt.value)}
                  className={`py-2.5 border font-body text-xs uppercase tracking-wider transition-colors ${
                    form.role === opt.value
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border hover:bg-secondary'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">Full Name</label>
            <input type="text" value={form.name} onChange={e => update('name', e.target.value)} required
              className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-foreground transition-colors"
              placeholder="Your full name" />
          </div>

          {form.role === 'vendor' && (
            <div>
              <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">Store Name</label>
              <input type="text" value={form.storeName} onChange={e => update('storeName', e.target.value)} required
                className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-foreground transition-colors"
                placeholder="Your store name" />
            </div>
          )}

          <div>
            <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">Email</label>
            <input type="email" value={form.email} onChange={e => update('email', e.target.value)} required
              className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-foreground transition-colors"
              placeholder="your@email.com" />
          </div>

          <div>
            <label className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2 block">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => update('password', e.target.value)} required
                className="w-full border border-border bg-transparent px-4 py-3 font-body text-sm outline-none focus:border-foreground transition-colors pr-10"
                placeholder="Min 6 characters" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-foreground text-background py-3.5 font-body text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-opacity disabled:opacity-50">
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="font-body text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-foreground underline luxury-hover">Sign in</Link>
          </p>
        </div>

        <div className="py-20" />
      </div>
    </main>
  );
};

export default Register;
