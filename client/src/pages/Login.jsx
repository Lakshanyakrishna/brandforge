import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import Button from '../components/Button';
import { Field, Input } from '../components/Input';

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('login');
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center mb-3">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-gray-900">BrandForge</h1>
          <p className="text-sm text-gray-500 mt-1">On-brand social designs, generated instantly.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
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

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" loading={loading} className="w-full" size="lg">
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </Button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            className="w-full text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {mode === 'login' ? "Need an account? Register" : 'Already have an account? Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}
