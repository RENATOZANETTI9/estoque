'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    // Simulação de autenticação
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === 'admin@example.com' && password === 'password') {
      alert('Login bem-sucedido!');
      // Redirecionar ou atualizar estado de autenticação aqui
    } else {
      setError('Email ou senha inválidos');
    }

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded bg-gray-800 p-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">Login</h2>

        <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded border border-gray-600 bg-gray-700 p-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
          placeholder="email@example.com"
          required
          aria-label="Email"
        />

        <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-300">
          Senha
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full rounded border border-gray-600 bg-gray-700 p-2 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none"
          placeholder="Senha"
          required
          aria-label="Senha"
        />

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-cyan-400 py-2 font-semibold text-gray-900 hover:bg-cyan-500 disabled:opacity-50"
          aria-busy={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
