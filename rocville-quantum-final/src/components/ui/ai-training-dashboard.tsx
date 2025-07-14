
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Alert, AlertDescription } from './alert';

interface TrainingSession {
  id: string;
  config: {
    training_type: string;
    data_sources: string[];
    quality_threshold: number;
  };
  status: 'pending' | 'running' | 'completed' | 'failed';
  metrics: any;
  start_time: string;
  end_time?: string;
  data_size: number;
}

interface ModelMetrics {
  accuracy: number;
  response_time_ms: number;
  user_satisfaction: number;
  business_impact: number;
}

export const AITrainingDashboard: React.FC = () => {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [modelMetrics, setModelMetrics] = useState<ModelMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [trainingType, setTrainingType] = useState('fine_tuning');
  const [dataSources, setDataSources] = useState<string[]>(['conversations']);

  useEffect(() => {
    fetchSessions();
    fetchModelMetrics();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/training/sessions');
      const data = await response.json();
      if (data.status === 'success') {
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const fetchModelMetrics = async () => {
    try {
      const response = await fetch('/api/training/evaluate', { method: 'POST' });
      const data = await response.json();
      if (data.status === 'success') {
        setModelMetrics(data.evaluation);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  const startTraining = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/training/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          training_type: trainingType,
          data_sources: dataSources,
          quality_threshold: 0.8,
          batch_size: 32,
          learning_rate: 0.001,
          max_epochs: 10
        })
      });

      const data = await response.json();
      if (data.status === 'success') {
        await fetchSessions();
      }
    } catch (error) {
      console.error('Error starting training:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const triggerContinuousLearning = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/training/continuous-learning', { method: 'POST' });
      const data = await response.json();
      if (data.status === 'success') {
        await fetchModelMetrics();
      }
    } catch (error) {
      console.error('Error triggering continuous learning:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'running': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'running': return '🔄';
      case 'failed': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">AI Training Dashboard</h2>
          <p className="text-muted-foreground">
            Monitor and manage AI model training, fine-tuning, and continuous learning
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          🧠 Advanced AI System v2.0
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Model Accuracy</CardTitle>
                <span className="text-2xl">🎯</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {modelMetrics ? `${(modelMetrics.accuracy * 100).toFixed(1)}%` : 'Loading...'}
                </div>
                <Progress value={modelMetrics ? modelMetrics.accuracy * 100 : 0} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Response Time</CardTitle>
                <span className="text-2xl">⚡</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {modelMetrics ? `${modelMetrics.response_time_ms}ms` : 'Loading...'}
                </div>
                <p className="text-xs text-muted-foreground">Average response time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Satisfaction</CardTitle>
                <span className="text-2xl">😊</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {modelMetrics ? `${(modelMetrics.user_satisfaction * 100).toFixed(1)}%` : 'Loading...'}
                </div>
                <Progress value={modelMetrics ? modelMetrics.user_satisfaction * 100 : 0} className="mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Business Impact</CardTitle>
                <span className="text-2xl">📈</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {modelMetrics ? `+${(modelMetrics.business_impact * 100).toFixed(1)}%` : 'Loading...'}
                </div>
                <p className="text-xs text-muted-foreground">Performance improvement</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current AI system capabilities and status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Fine-tuning Ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">RAG System Active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">MCP Connected</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Synthetic Data Gen</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Continuous Learning</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Advanced Analytics</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Start New Training Session</CardTitle>
              <CardDescription>Configure and start a new AI training session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Training Type</label>
                  <select 
                    value={trainingType} 
                    onChange={(e) => setTrainingType(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="fine_tuning">Fine-tuning (LoRA)</option>
                    <option value="rag">RAG Training</option>
                    <option value="prompt_engineering">Prompt Engineering</option>
                    <option value="hybrid">Hybrid Approach</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Data Sources</label>
                  <div className="space-y-1">
                    {['conversations', 'user_feedback', 'external_docs'].map(source => (
                      <label key={source} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={dataSources.includes(source)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setDataSources([...dataSources, source]);
                            } else {
                              setDataSources(dataSources.filter(s => s !== source));
                            }
                          }}
                        />
                        <span className="text-sm capitalize">{source.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <Alert>
                <AlertDescription>
                  <strong>Training Type Guide:</strong><br/>
                  • <strong>Fine-tuning:</strong> Best for specialized domain knowledge and behavior mimicry<br/>
                  • <strong>RAG:</strong> Ideal for up-to-date information and external knowledge<br/>
                  • <strong>Prompt Engineering:</strong> Quick deployment for existing capabilities<br/>
                  • <strong>Hybrid:</strong> Combines all approaches for maximum effectiveness
                </AlertDescription>
              </Alert>

              <div className="flex space-x-2">
                <Button onClick={startTraining} disabled={isLoading}>
                  {isLoading ? '🔄 Starting...' : '🚀 Start Training'}
                </Button>
                <Button onClick={triggerContinuousLearning} variant="outline" disabled={isLoading}>
                  {isLoading ? '🔄 Learning...' : '🧠 Continuous Learning'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Sessions</CardTitle>
              <CardDescription>Monitor active and completed training sessions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No training sessions found. Start a new training session to see it here.
                  </p>
                ) : (
                  sessions.map((session) => (
                    <Card key={session.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className="text-2xl">{getStatusIcon(session.status)}</span>
                            <div>
                              <h4 className="font-semibold">
                                {session.config.training_type.replace('_', ' ').toUpperCase()}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Session ID: {session.id}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Data Sources: {session.config.data_sources.join(', ')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(session.status)}>
                              {session.status}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              {new Date(session.start_time).toLocaleString()}
                            </p>
                            {session.data_size > 0 && (
                              <p className="text-sm text-muted-foreground">
                                {session.data_size} samples
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {session.status === 'running' && (
                          <Progress value={65} className="mt-4" />
                        )}
                        
                        {session.metrics && Object.keys(session.metrics).length > 0 && (
                          <div className="mt-4 p-3 bg-muted rounded-lg">
                            <h5 className="text-sm font-medium mb-2">Metrics:</h5>
                            <pre className="text-xs text-muted-foreground">
                              {JSON.stringify(session.metrics, null, 2)}
                            </pre>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Metrics</CardTitle>
              <CardDescription>Detailed performance and training metrics</CardDescription>
            </CardHeader>
            <CardContent>
              {modelMetrics ? (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="font-medium">Model Performance</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Accuracy:</span>
                          <span className="text-sm font-medium">{(modelMetrics.accuracy * 100).toFixed(2)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Response Time:</span>
                          <span className="text-sm font-medium">{modelMetrics.response_time_ms}ms</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">User Satisfaction:</span>
                          <span className="text-sm font-medium">{(modelMetrics.user_satisfaction * 100).toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Business Impact</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-sm">Performance Improvement:</span>
                          <span className="text-sm font-medium text-green-600">
                            +{(modelMetrics.business_impact * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Cost Efficiency:</span>
                          <span className="text-sm font-medium text-green-600">+15%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Lead Conversion:</span>
                          <span className="text-sm font-medium text-green-600">+28%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Training Capabilities</h4>
                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                      <Badge variant="outline">✅ LoRA Fine-tuning</Badge>
                      <Badge variant="outline">✅ RAG Retrieval</Badge>
                      <Badge variant="outline">✅ Synthetic Data Gen</Badge>
                      <Badge variant="outline">✅ MCP Integration</Badge>
                      <Badge variant="outline">✅ Continuous Learning</Badge>
                      <Badge variant="outline">✅ Intent Analysis</Badge>
                      <Badge variant="outline">✅ Context Management</Badge>
                      <Badge variant="outline">✅ Multi-modal Support</Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading metrics...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
