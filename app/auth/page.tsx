'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import { Lock, Mail, User, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const { login, signup, isAuthenticated, error, clearError, loading } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Clear errors when switching tabs
  useEffect(() => {
    clearError();
  }, [activeTab, clearError]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/profile');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (activeTab === 'signin') {
      const success = await login(email, password);
      if (success) {
        toast({
          title: 'Welcome Back',
          description: 'Logged in successfully.',
          type: 'success'
        });
      }
    } else {
      if (!name) return;
      if (password !== confirmPassword) {
        toast({
          title: 'Mismatch Password',
          description: 'Passwords do not match.',
          type: 'error'
        });
        return;
      }
      
      const success = await signup(name, email, password);
      if (success) {
        toast({
          title: 'Account Created',
          description: 'Your account is ready for premium purchases.',
          type: 'success'
        });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 font-sans text-foreground">
        <div className="max-w-md w-full bg-card border border-border p-8 shadow-2xl flex flex-col gap-6 animate-fade-in">
          
          {/* Tab controllers */}
          <div className="flex border-b border-border font-serif text-sm tracking-widest font-bold">
            <button
              onClick={() => setActiveTab('signin')}
              className={`flex-1 pb-3 text-center uppercase tracking-widest cursor-pointer transition-all border-b-2 ${
                activeTab === 'signin' 
                  ? 'border-foreground text-foreground' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 pb-3 text-center uppercase tracking-widest cursor-pointer transition-all border-b-2 ${
                activeTab === 'signup' 
                  ? 'border-foreground text-foreground' 
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="text-center mt-2 flex flex-col gap-1.5">
            <h2 className="font-serif text-xl tracking-wide uppercase font-light text-foreground">
              {activeTab === 'signin' ? 'Welcome Back' : 'Create Luxury Account'}
            </h2>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
              {activeTab === 'signin' ? 'ENTER DETAILS TO ACCESS SESSION' : 'JOIN THE ARCHIVE FOR EARLY DROPS'}
            </p>
          </div>

          {/* Error Alert Display */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 text-center font-medium">
              Error: {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
            
            {/* Full Name input (Rendered if Sign Up active) */}
            {activeTab === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-muted-foreground uppercase tracking-wider">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    required
                    className="bg-background text-foreground border border-border focus:border-foreground outline-none pl-10 pr-4 py-3 font-medium w-full transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Address */}
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-muted-foreground uppercase tracking-wider">Email Address *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@example.com"
                  required
                  className="bg-background text-foreground border border-border focus:border-foreground outline-none pl-10 pr-4 py-3 font-medium w-full transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-baseline font-semibold uppercase tracking-wider text-muted-foreground">
                <label>Password *</label>
                {activeTab === 'signin' && (
                  <span className="hover:text-foreground cursor-pointer underline underline-offset-2">Forgot Password?</span>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="bg-background text-foreground border border-border focus:border-foreground outline-none pl-10 pr-10 py-3 font-medium w-full transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password input (Rendered if Sign Up active) */}
            {activeTab === 'signup' && (
              <div className="flex flex-col gap-1.5">
                <label className="font-semibold text-muted-foreground uppercase tracking-wider">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-background text-foreground border border-border focus:border-foreground outline-none pl-10 pr-4 py-3 font-medium w-full transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Action submit */}
            <div className="mt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-foreground text-background text-xs uppercase tracking-[0.2em] py-3.5 font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-md disabled:bg-gray-400"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> VERIFYING DETAILS...
                  </>
                ) : (
                  activeTab === 'signin' ? 'Sign In Securely' : 'Create Luxury Account'
                )}
              </button>
            </div>
          </form>

          {/* Guest Account Info alert */}
          <div className="border-t border-border/70 pt-4 text-[10px] text-muted-foreground text-center leading-relaxed">
            💡 **Developer Preview Note**: You can log in using `jane@example.com` or `admin@maisonrk.com` to test Customer vs. Admin privileges, or simply register a new custom account!
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
