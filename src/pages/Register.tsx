/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CheckSquare, User, Mail, Lock, ShieldAlert, ArrowRight } from 'lucide-react';

export default function Register() {
  const { register } = useApp();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const validateEmail = (input: string) => {
    return /\S+@\S+\.\S+/.test(input);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Full name is required.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!validateEmail(email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Passwords should be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    try {
      // On Register, automatically log in the newly registered profile to explore the applet
      await register(fullName.trim(), email.trim(), password);
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed.');
    }
  };

  return (
    <div id="register-container" className="min-h-screen bg-slate-50 flex items-center justify-center p-4 antialiased">
      <div id="register-card" className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        {/* Banner */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center text-white space-y-2 relative">
          <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mx-auto shadow-inner">
            <CheckSquare className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Register Team Member</h1>
            <p className="text-xs text-blue-100 font-medium">Configure your Workspace matrix credentials</p>
          </div>
        </div>

        {/* Inputs */}
        <div className="p-8 space-y-6">
          {errorMsg && (
            <div id="register-error-display" className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-rose-800 text-xs font-semibold animate-shake">
              <ShieldAlert className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form id="frm-register" onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="reg-name-input"
                  type="text"
                  placeholder="e.g. Alice Johnson"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-100 text-slate-800 text-xs font-medium"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="reg-email-input"
                  type="email"
                  placeholder="alice@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-100 text-slate-800 text-xs font-medium"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Configure Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="reg-pass-input"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-100 text-slate-800 text-xs font-medium"
                />
              </div>
            </div>

            {/* Password confirm */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="reg-confirm-input"
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-100 text-slate-800 text-xs font-medium"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              id="register-submit-button"
              type="submit"
              className="flex items-center justify-center gap-2 w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/15 transition active:scale-[0.98] cursor-pointer"
            >
              <span>Build Credentials Matrix</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Footer Backlink */}
          <div className="text-center pt-2">
            <p className="text-xs text-slate-600">
              Already have a profile key?{' '}
              <Link to="/login" className="text-blue-600 font-bold hover:underline">
                Authenticate here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
