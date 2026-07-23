import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import Button from '../components/Button';
import { Field, Input } from '../components/Input';

export default function Login({ onLogin, onBack, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post(`/auth/${mode}`, { username, password });
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!');
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative overflow-hidden">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[36rem] h-[36rem] rounded-full bg-primary-container/15 blur-3xl motion-safe:animate-[blob-float_22s_ease-in-out_infinite]" />

      <div className="relative w-full max-w-sm">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-background transition-colors duration-150 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </button>
        )}

        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center p-2 mb-3">
            <img src="/logo-icon.png" alt="BrandForge" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl font-semibold text-on-background">BrandForge</h1>
          <p className="text-sm text-on-surface-variant mt-1">On-brand social designs, generated instantly.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container-low rounded-2xl border border-surface-variant p-6 space-y-4">
          <Field label="Username">
            <Input
              placeholder="e.g. alice"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              required
            />
          </Field>

          {error && <p className="text-sm text-error">{error}</p>}

          <Button type="submit" loading={loading} className="w-full" size="lg">
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </Button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="w-full text-sm text-primary hover:text-primary font-medium"
          >
            {mode === 'login' ? "Need an account? Register" : 'Already have an account? Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}
