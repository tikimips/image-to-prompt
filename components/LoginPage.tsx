import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Alert, AlertDescription } from './ui/alert'
import { useAuth } from '../contexts/AuthContext'
import { Camera, Sparkles, Shield, Zap } from 'lucide-react'

export function LoginPage() {
  const { signInWithGoogle, isLoading, error } = useAuth()

  const handleGoogleSignIn = async () => {
    await signInWithGoogle()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4">
            <Camera className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl tracking-tight">Welcome to Prompt Shop</h1>
          <p className="text-gray-600">
            Transform your images into creative AI prompts with advanced computer vision
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-2 gap-4 py-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-sm text-gray-600">AI Analysis</p>
          </div>
          <div className="text-center space-y-2">
            <div className="mx-auto w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-sm text-gray-600">Instant Prompts</p>
          </div>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Sign In to Continue</CardTitle>
            <CardDescription>
              Secure authentication to access your prompt library and history
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert>
                <AlertDescription className="text-sm">
                  {error}
                  {error.includes('provider is not enabled') && (
                    <div className="mt-2 text-xs">
                      <strong>Note:</strong> Google authentication setup is in progress. 
                      Check back shortly or contact support if this persists.
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full h-12 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  Connecting...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </div>
              )}
            </Button>

            <div className="flex items-center gap-2 text-xs text-gray-500 mt-4">
              <Shield className="h-3 w-3" />
              <span>Secure authentication • Privacy protected • No spam</span>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">Why sign in?</p>
          <div className="space-y-2 text-xs text-gray-500">
            <p>• Save your generated prompts</p>
            <p>• Access your query history</p>
            <p>• Sync across devices</p>
            <p>• Get priority support</p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 border-t pt-4">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          <p className="mt-1">promptshop.com • Powered by OpenAI</p>
        </div>
      </div>
    </div>
  )
}