'use client'

import Link from 'next/link'
import { useState } from 'react'
import GoogleButton from '@/components/auth/GoogleButton'
import InputField from '@/components/auth/InputField'
import { authClient } from "@/lib/auth-client";
import { checkIfUserExists } from '@/lib/prisma'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [isNewUser, setIsNewUser] = useState<boolean | null>(null)
  const [checkingUser, setCheckingUser] = useState(false)

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCheckingUser(true)

    try {
      const userExists = await checkIfUserExists(email)
      setIsNewUser(!userExists)
      setCheckingUser(false)
    } catch (error) {
      setCheckingUser(false)
      alert('Error checking user. Please try again.')
    }
  }

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let result;
      
      if (isNewUser) {
        // Sign up new user with name
        result = await authClient.signIn.magicLink({
          email,
          name,
        })
      } else {
        // Sign in existing user
        result = await authClient.signIn.magicLink({
          email,
        })
      }

      setIsLoading(false)

      if (result.error) {
        alert(result.error.message || 'Something went wrong. Please try again.')
        return
      }

      setIsEmailSent(true)
      setEmail('')
      setName('')
    } catch (error) {
      setIsLoading(false)
      alert('Something went wrong. Please try again.')
    }
  }

  const handleGoogleAuth = async () => {
    await authClient.signIn.social({
      provider: 'google',
      errorCallbackURL: '/error'
    })
  }

  const handleBack = () => {
    setIsNewUser(null)
    setName('')
  }

  // Email sent confirmation screen
  if (isEmailSent) {
    return (
      <div className="min-h-screen auth-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="glass-card rounded-2xl p-8 glow-shadow card-entrance text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h1>
            <p className="text-muted-foreground mb-6">
              We've sent a magic link to <strong>{email}</strong>
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Click the link in your email to {isNewUser ? 'complete your account setup' : 'sign in'}. The link will expire in 15 minutes.
            </p>
            <button
              onClick={() => {
                setIsEmailSent(false)
                setIsNewUser(null)
              }}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              ← Back to start
            </button>
          </div>
        </div>
      </div>
    )
  }

  // New user - collect name
  if (isNewUser === true) {
    return (
      <div className="min-h-screen auth-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="glass-card rounded-2xl p-8 glow-shadow card-entrance">
            <div className="text-center mb-8">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Welcome to Fomi!</h1>
              <p className="text-muted-foreground">We need your name to create your account</p>
              <p className="text-sm text-muted-foreground mt-2">
                Email: <strong>{email}</strong>
              </p>
            </div>

            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <InputField
                id="name"
                label="Full Name"
                type="text"
                placeholder="Enter your full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-1 rounded border-border text-primary focus:ring-primary focus:ring-2"
                />
                <label htmlFor="terms" className="ml-3 text-sm text-muted-foreground leading-relaxed">
                  I agree to the{' '}
                  <Link href="#" className="text-primary hover:text-primary/80 transition-colors font-medium">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="#" className="text-primary hover:text-primary/80 transition-colors font-medium">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full gradient-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : (
                  'Create Account & Send Magic Link'
                )}
              </button>
            </form>

            <button
              onClick={handleBack}
              className="w-full mt-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to email
            </button>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-background text-muted-foreground font-medium">Or continue with</span>
                </div>
              </div>

              <div className="mt-4">
                <GoogleButton onClick={handleGoogleAuth} text="Sign up with Google" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Existing user - direct login
  if (isNewUser === false) {
    return (
      <div className="min-h-screen auth-bg flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="glass-card rounded-2xl p-8 glow-shadow card-entrance">
            <div className="text-center mb-8">
              <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold gradient-text mb-2">Welcome Back!</h1>
              <p className="text-muted-foreground">Ready to continue with your account?</p>
              <p className="text-sm text-muted-foreground mt-2">
                Email: <strong>{email}</strong>
              </p>
            </div>

            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full gradient-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Magic Link...
                  </div>
                ) : (
                  'Send Magic Link'
                )}
              </button>
            </form>

            <button
              onClick={handleBack}
              className="w-full mt-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to email
            </button>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-background text-muted-foreground font-medium">Or continue with</span>
                </div>
              </div>

              <div className="mt-4">
                <GoogleButton onClick={handleGoogleAuth} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Initial email input screen
  return (
    <div className="min-h-screen auth-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-card rounded-2xl p-8 glow-shadow card-entrance">
          <div className="text-center mb-8">
            <div className="w-16 h-16 gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Get Started</h1>
            <p className="text-muted-foreground">Enter your email to continue</p>
          </div>

          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <InputField
              id="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="submit"
              disabled={checkingUser}
              className="w-full gradient-primary text-white py-3 rounded-lg font-medium hover:opacity-90 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkingUser ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Checking...
                </div>
              ) : (
                'Continue'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground font-medium">Or continue with</span>
              </div>
            </div>

            <div className="mt-4">
              <GoogleButton onClick={handleGoogleAuth} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}