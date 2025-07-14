import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth';
import { Camera, AlertCircle, Settings, Eye, EyeOff, Shield, Zap, Palette } from 'lucide-react';

export function LoginPage() {
  const { signInWithGoogle, signInWithApple, isLoading } = useAuth();
  const [showConfigInfo, setShowConfigInfo] = useState(false);
  const [signingInWith, setSigningInWith] = useState<'google' | 'apple' | null>(null);

  const handleGoogleSignIn = async () => {
    setSigningInWith('google');
    try {
      await signInWithGoogle();
    } finally {
      setSigningInWith(null);
    }
  };

  const handleAppleSignIn = async () => {
    setSigningInWith('apple');
    try {
      await signInWithApple();
    } finally {
      setSigningInWith(null);
    }
  };

  const configStatus = authService.getConfigStatus();
  const isConfigured = authService.isConfigured();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 rounded-2xl p-3">
              <Camera className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl tracking-tight">Welcome to Image to Prompt</h1>
          <p className="text-gray-600">
            Transform your images into AI-powered prompts with advanced analysis
          </p>
        </div>

        {/* Features Preview */}
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="text-center space-y-2">
            <div className="bg-green-100 rounded-full p-2 w-fit mx-auto">
              <Eye className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-xs text-gray-600">AI Vision Analysis</p>
          </div>
          <div className="text-center space-y-2">
            <div className="bg-purple-100 rounded-full p-2 w-fit mx-auto">
              <Zap className="h-4 w-4 text-purple-600" />
            </div>
            <p className="text-xs text-gray-600">Instant Prompts</p>
          </div>
          <div className="text-center space-y-2">
            <div className="bg-orange-100 rounded-full p-2 w-fit mx-auto">
              <Palette className="h-4 w-4 text-orange-600" />
            </div>
            <p className="text-xs text-gray-600">Style Detection</p>
          </div>
        </div>

        {/* Configuration Status */}
        {!isConfigured && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>
                🔧 Demo mode - OAuth not configured. Sign in to try the interface!
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfigInfo(!showConfigInfo)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* OAuth Configuration Info */}
        {showConfigInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">OAuth Configuration</CardTitle>
              <CardDescription>
                To enable real authentication, configure OAuth credentials
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Google OAuth</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    configStatus.google 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {configStatus.google ? 'Configured' : 'Demo Mode'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Apple OAuth</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    configStatus.apple 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {configStatus.apple ? 'Configured' : 'Demo Mode'}
                  </span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Setup Instructions:</h4>
                <ol className="text-xs space-y-1 list-decimal list-inside">
                  <li>Configure OAuth apps in Google Cloud Console & Apple Developer Portal</li>
                  <li>Update client IDs in <code className="bg-gray-200 px-1 rounded">/services/auth.ts</code></li>
                  <li>Set up proper redirect URIs and domains</li>
                  <li>For production, use environment variables</li>
                </ol>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sign In Options */}
        <Card>
          <CardHeader>
            <CardTitle>Sign in to continue</CardTitle>
            <CardDescription>
              Choose your preferred sign-in method to access your personalized workspace
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Google Sign In */}
            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 flex items-center justify-center gap-3 hover:bg-gray-50"
            >
              {signingInWith === 'google' ? (
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span className="text-sm font-medium">
                {signingInWith === 'google' ? 'Signing in...' : 'Continue with Google'}
              </span>
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">or</span>
              </div>
            </div>

            {/* Apple Sign In */}
            <Button
              onClick={handleAppleSignIn}
              disabled={isLoading}
              variant="outline"
              className="w-full h-12 flex items-center justify-center gap-3 hover:bg-gray-50"
            >
              {signingInWith === 'apple' ? (
                <div className="w-5 h-5 border-2 border-gray-800 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                </svg>
              )}
              <span className="text-sm font-medium">
                {signingInWith === 'apple' ? 'Signing in...' : 'Continue with Apple'}
              </span>
            </Button>
          </CardContent>
        </Card>

        {/* Privacy & Security */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span>Your data is secure and private</span>
          </div>
          <p className="text-xs text-gray-500 leading-relaxed">
            We use secure OAuth authentication and don't store your passwords. 
            Your images and prompts are saved locally and can be exported at any time.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-400">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}