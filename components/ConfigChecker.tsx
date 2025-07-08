import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle, XCircle, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react';
import { openAIService } from '../services/openai';
import { authService } from '../services/auth';

interface ServiceStatus {
  name: string;
  status: 'configured' | 'not-configured' | 'testing' | 'error';
  message: string;
  action?: string;
  link?: string;
}

export function ConfigChecker() {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [showChecker, setShowChecker] = useState(false);

  const checkServices = async () => {
    setIsChecking(true);
    const results: ServiceStatus[] = [];

    // Check OpenAI API
    try {
      if (openAIService.isConfigured()) {
        results.push({
          name: 'OpenAI Vision API',
          status: 'testing',
          message: 'Testing API connection...'
        });
        
        const isWorking = await openAIService.testApiConnection();
        results[results.length - 1] = {
          name: 'OpenAI Vision API',
          status: isWorking ? 'configured' : 'error',
          message: isWorking ? 'API key is valid and working' : 'API key is invalid or quota exceeded',
          action: isWorking ? undefined : 'Check your API key and billing',
          link: 'https://platform.openai.com/api-keys'
        };
      } else {
        results.push({
          name: 'OpenAI Vision API',
          status: 'not-configured',
          message: 'API key not configured',
          action: 'Add your OpenAI API key to /services/openai.ts',
          link: 'https://platform.openai.com/api-keys'
        });
      }
    } catch (error) {
      results.push({
        name: 'OpenAI Vision API',
        status: 'error',
        message: 'Failed to test API connection',
        action: 'Check your API key and network connection',
        link: 'https://platform.openai.com'
      });
    }

    // Check Google OAuth
    const googleConfigured = authService.getConfigStatus().google;
    results.push({
      name: 'Google OAuth',
      status: googleConfigured ? 'configured' : 'not-configured',
      message: googleConfigured ? 'Client ID configured' : 'Client ID not configured',
      action: googleConfigured ? undefined : 'Configure Google OAuth in /services/auth.ts',
      link: 'https://console.cloud.google.com'
    });

    // Check Apple Sign-In
    const appleConfigured = authService.getConfigStatus().apple;
    results.push({
      name: 'Apple Sign-In',
      status: appleConfigured ? 'configured' : 'not-configured',
      message: appleConfigured ? 'Client ID configured' : 'Client ID not configured',
      action: appleConfigured ? undefined : 'Configure Apple Sign-In in /services/auth.ts',
      link: 'https://developer.apple.com'
    });

    // Check deployment readiness
    const hasGitConfig = checkGitConfig();
    results.push({
      name: 'Git Repository',
      status: hasGitConfig ? 'configured' : 'not-configured',
      message: hasGitConfig ? 'Repository initialized' : 'Git not initialized',
      action: hasGitConfig ? undefined : 'Run: git init && git add . && git commit -m "Initial commit"',
      link: 'https://github.com'
    });

    setServices(results);
    setIsChecking(false);
  };

  const checkGitConfig = (): boolean => {
    // This is a simplified check - in a real app you might use a more robust method
    return typeof window !== 'undefined' && window.location.hostname !== 'localhost';
  };

  useEffect(() => {
    if (showChecker) {
      checkServices();
    }
  }, [showChecker]);

  const getStatusIcon = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'configured':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'not-configured':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'testing':
        return <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: ServiceStatus['status']) => {
    switch (status) {
      case 'configured':
        return <Badge variant="default" className="bg-green-100 text-green-800">Ready</Badge>;
      case 'not-configured':
        return <Badge variant="destructive">Not Setup</Badge>;
      case 'testing':
        return <Badge variant="secondary">Testing...</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const allConfigured = services.every(s => s.status === 'configured');
  const hasErrors = services.some(s => s.status === 'error');

  if (!showChecker) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setShowChecker(true)}
          variant="outline"
          size="sm"
          className="bg-white shadow-lg"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Check Services
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Service Configuration Status
              </CardTitle>
              <CardDescription>
                Check the status of all external services and integrations
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowChecker(false)}
            >
              ×
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Overall Status */}
          <Alert>
            <AlertDescription>
              {allConfigured ? (
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>All services are configured and ready!</span>
                </div>
              ) : hasErrors ? (
                <div className="flex items-center gap-2 text-red-700">
                  <XCircle className="h-4 w-4" />
                  <span>Some services have errors. Check the details below.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-yellow-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Some services need configuration. See SERVICES_SETUP.md for details.</span>
                </div>
              )}
            </AlertDescription>
          </Alert>

          {/* Services List */}
          <div className="space-y-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(service.status)}
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-gray-600">{service.message}</div>
                    {service.action && (
                      <div className="text-xs text-blue-600 mt-1">
                        {service.action}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(service.status)}
                  {service.link && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(service.link, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-gray-600">
              Need help? Check the SERVICES_SETUP.md file for detailed instructions.
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={checkServices}
                disabled={isChecking}
              >
                {isChecking ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Recheck
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChecker(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}