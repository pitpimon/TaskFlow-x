/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckSquare, Mail, Lock, ShieldAlert, ArrowRight, Chrome } from 'lucide-react';

export default function Login() {
  const { login } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const validateEmail = (input: string) => {
    return /\S+@\S+\.\S+/.test(input);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!validateEmail(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }
    if (password.length < 4) {
      setErrorMsg('Password should be at least 4 characters long.');
      return;
    }

    // Success login
    login(email.trim());
    navigate('/');
  };

  const handleGuestAccess = () => {
    login('alice@example.com');
    navigate('/');
  };

  return (
    <div id="login-container" className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased">
      <div id="login-card" className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Visual brand header banner */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center text-white space-y-2 relative">
          <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto shadow-inner">
            <CheckSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Welcome to TaskFlow</h1>
            <p className="text-xs text-blue-100 font-medium">Coordinate, iterate, and track project matrices</p>
          </div>
        </div>

        {/* Input parameters container */}
        <div className="p-8 space-y-6">
          {errorMsg && (
            <div id="form-error-display" className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs font-semibold animate-shake">
              <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form id="frm-login" onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email field */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="email-input"
                  type="email"
                  placeholder="alice@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-100 text-slate-800 text-xs font-medium"
                />
              </div>
            </div>

            {/* Password field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Mock Forgot Password triggered! Since this is a client mock experience, you can use any email/password values."); }} className="text-[11px] text-blue-600 hover:underline font-bold">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="password-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-100 text-slate-800 text-xs font-medium"
                />
              </div>
            </div>

            {/* Remember Me Toggle Options */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded-sm border-slate-350 text-blue-600 focus:ring-blue-400 h-4 w-4"
                />
                <span className="text-xs text-slate-600 font-medium">Remember me</span>
              </label>
            </div>

            {/* Login button */}
            <button
              id="login-submit-button"
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/15 transition active:scale-[0.98] cursor-pointer"
            >
              <span>Authenticate Session</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Social login / Fast guest mode */}
          <div className="relative text-center py-1">
            <span className="absolute inset-x-0 top-1/2 h-px bg-slate-100" />
            <span className="relative bg-white px-3 text-[10px] uppercase font-bold tracking-widest text-slate-400">
              Instant explore
            </span>
          </div>

          <button
            id="guest-access-btn"
            onClick={handleGuestAccess}
            className="flex items-center justify-center gap-2 w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition cursor-pointer"
          >
            <span>Run Guest Demo Workspace</span>
          </button>

          {/* Footer link to Register */}
          <div className="text-center">
            <p className="text-xs text-slate-600">
              New team member?{' '}
              <Link to="/register" className="text-blue-600 font-bold hover:underline">
                Create new profile
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
