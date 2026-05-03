'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Lógica simples para submissão do form
    alert(`Email: ${email}\nSenha: ${password}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 p-4">
      <h1 className="text-3xl font-bold text-white mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 bg-gray-800 p-6 rounded-lg">
        <div>
          <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-300">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-300">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-md border border-gray-700 bg-gray-900 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-cyan-400 py-2 font-semibold text-gray-900 hover:bg-cyan-500"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}
