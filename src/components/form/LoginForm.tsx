import { useState } from 'react';

export default function LoginForm({
  onSubmit,
  isLoading,
}: {
  onSubmit: (values: { email: string; password: string }) => void;
  isLoading: boolean;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-xs text-gray-600">Email Address</label>
        <input
          type="email"
          placeholder="robertallen@example.com"
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="text-xs text-gray-600">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
          className="h-4 w-4 text-blue-600"
        />
        <label className="text-sm text-gray-700">Remember Me</label>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-900 text-white py-2 rounded-md hover:bg-blue-800 transition duration-300"
        disabled={isLoading}
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
