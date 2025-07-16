import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { supabase, savedPromptsService, queryHistoryService } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Database, AlertCircle, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';

export function DebugPanel() {
  const { user, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDiagnostics = async () => {
    setIsLoading(true);
    const info: any = {
      timestamp: new Date().toISOString(),
      environment: {},
      supabase: {},
      auth: {},
      database: {},
      errors: []
    };

    try {
      // Check environment variables
      info.environment = {
        supabaseUrl: !!import.meta.env.VITE_SUPABASE_URL,
        supabaseAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
        supabaseUrlValue: import.meta.env.VITE_SUPABASE_URL ? 'Set' : 'Missing',
        supabaseAnonKeyValue: import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing'
      };

      // Check Supabase client
      try {
        const { data, error } = await supabase.from('saved_prompts').select('count', { count: 'exact', head: true });
        info.supabase.connection = !error ? 'Connected' : 'Error';
        info.supabase.error = error?.message || null;
      } catch (error) {
        info.supabase.connection = 'Failed';
        info.supabase.error = error instanceof Error ? error.message : 'Unknown error';
        info.errors.push(`Supabase connection: ${info.supabase.error}`);
      }

      // Check authentication
      info.auth = {
        isAuthenticated,
        hasUser: !!user,
        userId: user?.id || null,
        email: user?.email || null,
        provider: user?.app_metadata?.provider || null
      };

      // Test database operations if authenticated
      if (user) {
        try {
          // Test reading saved prompts
          const prompts = await savedPromptsService.getAll(user.id);
          info.database.savedPromptsRead = `Success (${prompts.length} items)`;
          
          // Test reading query history
          const history = await queryHistoryService.getAll(user.id);
          info.database.queryHistoryRead = `Success (${history.length} items)`;

          // Test writing (create a test record and delete it)
          try {
            const testPrompt = await savedPromptsService.save(user.id, {
              name: 'Test Prompt (will be deleted)',
              prompt: 'This is a test prompt to verify write access',
              image_url: 'data:image/png;base64,test',
              style: 'test'
            });
            
            if (testPrompt) {
              info.database.savedPromptsWrite = 'Success';
              // Clean up test record
              await savedPromptsService.delete(user.id, testPrompt.id);
              info.database.savedPromptsDelete = 'Success';
            } else {
              info.database.savedPromptsWrite = 'Failed - No data returned';
              info.errors.push('Write test failed: No data returned');
            }
          } catch (writeError) {
            info.database.savedPromptsWrite = `Failed: ${writeError instanceof Error ? writeError.message : 'Unknown error'}`;
            info.errors.push(`Write test error: ${info.database.savedPromptsWrite}`);
          }

        } catch (dbError) {
          info.database.error = dbError instanceof Error ? dbError.message : 'Unknown error';
          info.errors.push(`Database test error: ${info.database.error}`);
        }
      } else {
        info.database.status = 'Skipped - User not authenticated';
      }

      // Check table permissions
      if (user) {
        try {
          const { data: tablesData, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .in('table_name', ['saved_prompts', 'query_history']);
            
          if (!tablesError && tablesData) {
            const tableNames = tablesData.map(t => t.table_name);
            info.database.tables = {
              saved_prompts: tableNames.includes('saved_prompts'),
              query_history: tableNames.includes('query_history')
            };
          }
        } catch (error) {
          // Ignore this error as not all users have access to information_schema
        }
      }

    } catch (error) {
      info.errors.push(`Diagnostic error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    setDebugInfo(info);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen && !debugInfo) {
      runDiagnostics();
    }
  }, [isOpen]);

  const getStatusIcon = (status: string | boolean) => {
    if (typeof status === 'boolean') {
      return status ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />;
    }
    if (status?.includes('Success') || status === 'Connected' || status === 'Set') {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    }
    return <XCircle className="h-4 w-4 text-red-600" />;
  };

  const getStatusColor = (status: string | boolean) => {
    if (typeof status === 'boolean') {
      return status ? 'text-green-600' : 'text-red-600';
    }
    if (status?.includes('Success') || status === 'Connected' || status === 'Set') {
      return 'text-green-600';
    }
    return 'text-red-600';
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          size="sm"
          className="bg-white/90 backdrop-blur-sm shadow-lg"
        >
          <Database className="h-4 w-4 mr-2" />
          Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Supabase Debug Panel
          </CardTitle>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p>Running diagnostics...</p>
            </div>
          ) : debugInfo ? (
            <>
              {/* Errors Summary */}
              {debugInfo.errors.length > 0 && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p className="font-medium text-red-800">Issues Found:</p>
                      {debugInfo.errors.map((error: string, index: number) => (
                        <p key={index} className="text-sm text-red-700">• {error}</p>
                      ))}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Environment Variables */}
              <div className="space-y-3">
                <h3 className="font-medium">Environment Variables</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm">VITE_SUPABASE_URL</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(debugInfo.environment.supabaseUrl)}
                      <span className={`text-sm ${getStatusColor(debugInfo.environment.supabaseUrlValue)}`}>
                        {debugInfo.environment.supabaseUrlValue}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm">VITE_SUPABASE_ANON_KEY</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(debugInfo.environment.supabaseAnonKey)}
                      <span className={`text-sm ${getStatusColor(debugInfo.environment.supabaseAnonKeyValue)}`}>
                        {debugInfo.environment.supabaseAnonKeyValue}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Supabase Connection */}
              <div className="space-y-3">
                <h3 className="font-medium">Supabase Connection</h3>
                <div className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database Connection</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(debugInfo.supabase.connection)}
                      <span className={`text-sm ${getStatusColor(debugInfo.supabase.connection)}`}>
                        {debugInfo.supabase.connection}
                      </span>
                    </div>
                  </div>
                  {debugInfo.supabase.error && (
                    <p className="text-xs text-red-600 mt-2">{debugInfo.supabase.error}</p>
                  )}
                </div>
              </div>

              {/* Authentication */}
              <div className="space-y-3">
                <h3 className="font-medium">Authentication</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm">Authenticated</span>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(debugInfo.auth.isAuthenticated)}
                      <span className={`text-sm ${getStatusColor(debugInfo.auth.isAuthenticated)}`}>
                        {debugInfo.auth.isAuthenticated ? 'Yes' : 'No'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm">User ID</span>
                    <span className="text-sm text-slate-600">
                      {debugInfo.auth.userId ? 'Present' : 'Missing'}
                    </span>
                  </div>
                  {debugInfo.auth.email && (
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg md:col-span-2">
                      <span className="text-sm">Email</span>
                      <span className="text-sm text-slate-600">{debugInfo.auth.email}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Database Operations */}
              {debugInfo.auth.isAuthenticated && (
                <div className="space-y-3">
                  <h3 className="font-medium">Database Operations</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(debugInfo.database).map(([key, value]) => {
                      if (key === 'error' || key === 'status' || key === 'tables') return null;
                      return (
                        <div key={key} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                          <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(value as string)}
                            <span className={`text-sm ${getStatusColor(value as string)}`}>
                              {value as string}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {debugInfo.database.error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-red-700">
                        Database Error: {debugInfo.database.error}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={runDiagnostics} variant="outline" size="sm">
                  Refresh Diagnostics
                </Button>
                <Button onClick={() => setIsOpen(false)} size="sm">
                  Close
                </Button>
              </div>

              {/* Debug Data (for developers) */}
              <details className="mt-4">
                <summary className="text-sm text-slate-600 cursor-pointer">View Raw Debug Data</summary>
                <pre className="text-xs bg-slate-100 p-4 rounded-lg mt-2 overflow-auto">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            </>
          ) : (
            <div className="text-center py-8">
              <p>Click "Refresh Diagnostics" to run tests</p>
              <Button onClick={runDiagnostics} className="mt-4">
                Run Diagnostics
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}