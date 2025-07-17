
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { Progress } from './progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Alert, AlertDescription } from './alert';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  Mail, 
  Phone, 
  DollarSign, 
  Activity,
  Database,
  Settings,
  PlayCircle,
  StopCircle,
  RefreshCw,
  Download,
  Upload,
  BarChart3,
  Target,
  Zap,
  MessageSquare,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

interface TrainingMetrics {
  total_samples: number;
  model_accuracy: number;
  conversion_rate: number;
  leads_generated: number;
  emails_sent: number;
  calls_made: number;
  revenue_generated: number;
  last_training: string;
  performance_trends: {
    accuracy_trend: number[];
    conversion_trend: number[];
    revenue_trend: number[];
  };
}

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'call' | 'mixed';
  status: 'active' | 'paused' | 'completed';
  leads_targeted: number;
  responses: number;
  conversions: number;
  revenue: number;
  created_at: string;
}

export const AITrainingDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<TrainingMetrics>({
    total_samples: 0,
    model_accuracy: 0,
    conversion_rate: 0,
    leads_generated: 0,
    emails_sent: 0,
    calls_made: 0,
    revenue_generated: 0,
    last_training: '',
    performance_trends: {
      accuracy_trend: [],
      conversion_trend: [],
      revenue_trend: []
    }
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState<Array<{
    type: 'success' | 'error' | 'info';
    message: string;
    timestamp: Date;
  }>>([]);

  useEffect(() => {
    fetchMetrics();
    fetchCampaigns();
    
    // Set up real-time updates
    const interval = setInterval(() => {
      fetchMetrics();
      fetchCampaigns();
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/training/analytics');
      const data = await response.json();
      
      if (data.success) {
        setMetrics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch metrics:', error);
      addNotification('error', 'Failed to fetch training metrics');
    }
  };

  const fetchCampaigns = async () => {
    try {
      // Mock campaign data - would fetch from API
      const mockCampaigns: Campaign[] = [
        {
          id: '1',
          name: 'Tech Startup Outreach',
          type: 'email',
          status: 'active',
          leads_targeted: 250,
          responses: 78,
          conversions: 19,
          revenue: 15000,
          created_at: '2025-01-10'
        },
        {
          id: '2',
          name: 'E-commerce Growth Campaign',
          type: 'mixed',
          status: 'active',
          leads_targeted: 180,
          responses: 51,
          conversions: 14,
          revenue: 12000,
          created_at: '2025-01-08'
        },
        {
          id: '3',
          name: 'Digital Marketing Agency',
          type: 'call',
          status: 'completed',
          leads_targeted: 120,
          responses: 32,
          conversions: 8,
          revenue: 8000,
          created_at: '2025-01-05'
        }
      ];
      
      setCampaigns(mockCampaigns);
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    }
  };

  const addNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotifications(prev => [...prev, { type, message, timestamp: new Date() }]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 5000);
  };

  const startTraining = async () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    try {
      // Simulate training progress
      const progressInterval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            setIsTraining(false);
            addNotification('success', 'AI model training completed successfully!');
            return 100;
          }
          return prev + 10;
        });
      }, 1000);

      const response = await fetch('/api/training/train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      const result = await response.json();
      
      if (result.success) {
        addNotification('success', 'Training initiated successfully');
        fetchMetrics();
      } else {
        addNotification('error', 'Training failed to start');
        setIsTraining(false);
      }
    } catch (error) {
      console.error('Training error:', error);
      addNotification('error', 'Training failed');
      setIsTraining(false);
    }
  };

  const optimizePrompts = async () => {
    try {
      const response = await fetch('/api/training/optimize-prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      
      if (result.success) {
        addNotification('success', 'Prompt optimization completed');
        fetchMetrics();
      } else {
        addNotification('error', 'Prompt optimization failed');
      }
    } catch (error) {
      console.error('Optimization error:', error);
      addNotification('error', 'Optimization failed');
    }
  };

  const launchColdOutreach = async () => {
    try {
      // Mock lead data
      const mockLeads = [
        {
          company: "TechCorp Inc",
          contact_email: "ceo@techcorp.com",
          contact_name: "John Smith",
          industry: "Technology",
          personalization_data: {
            recent_funding: "$2M Series A",
            employees: "25-50",
            technologies: ["React", "Node.js", "AWS"]
          }
        }
      ];

      const response = await fetch('/api/training/execute-cold-campaign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          leads: mockLeads,
          template_type: 'introduction',
          campaign_name: 'Q1 2025 Outreach'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        addNotification('success', `Cold outreach launched: ${result.data.emails_sent} emails sent`);
        fetchCampaigns();
      } else {
        addNotification('error', 'Cold outreach failed');
      }
    } catch (error) {
      console.error('Outreach error:', error);
      addNotification('error', 'Outreach campaign failed');
    }
  };

  const researchLeads = async () => {
    try {
      const response = await fetch('/api/training/research-leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industry: 'Technology',
          company_size: '25-100',
          location: 'United States',
          limit: 50
        })
      });

      const result = await response.json();
      
      if (result.success) {
        addNotification('success', `Found ${result.data.total_found} new leads`);
      } else {
        addNotification('error', 'Lead research failed');
      }
    } catch (error) {
      console.error('Research error:', error);
      addNotification('error', 'Lead research failed');
    }
  };

  const getCampaignStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map((notification, index) => (
          <Alert key={index} className={`
            ${notification.type === 'success' ? 'bg-green-50 border-green-200' : ''}
            ${notification.type === 'error' ? 'bg-red-50 border-red-200' : ''}
            ${notification.type === 'info' ? 'bg-blue-50 border-blue-200' : ''}
          `}>
            <AlertDescription className="flex items-center gap-2">
              {notification.type === 'success' && <CheckCircle className="w-4 h-4 text-green-600" />}
              {notification.type === 'error' && <AlertCircle className="w-4 h-4 text-red-600" />}
              {notification.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
              {notification.message}
            </AlertDescription>
          </Alert>
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Training Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor and optimize your AI sales agent performance</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={researchLeads} className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            Research Leads
          </Button>
          <Button onClick={launchColdOutreach} className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Cold Outreach
          </Button>
          <Button onClick={optimizePrompts} className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Optimize
          </Button>
        </div>
      </div>

      {/* Training Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5" />
            AI Training Controls
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button 
              onClick={startTraining}
              disabled={isTraining}
              className="flex items-center gap-2"
            >
              {isTraining ? <StopCircle className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
              {isTraining ? 'Training...' : 'Start Training'}
            </Button>
            
            {isTraining && (
              <div className="flex-1 max-w-md">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-600">Training Progress:</span>
                  <span className="text-sm font-medium">{trainingProgress}%</span>
                </div>
                <Progress value={trainingProgress} className="h-2" />
              </div>
            )}
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Model Accuracy</p>
                <p className="text-2xl font-bold">{formatPercent(metrics.model_accuracy)}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{formatPercent(metrics.conversion_rate)}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Leads Generated</p>
                <p className="text-2xl font-bold">{metrics.leads_generated.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue Generated</p>
                <p className="text-2xl font-bold">{formatCurrency(metrics.revenue_generated)}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-full">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Training Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Training Samples</span>
                    <Badge variant="secondary">{metrics.total_samples.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last Training</span>
                    <Badge variant="outline">{metrics.last_training || 'Never'}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Emails Sent</span>
                    <Badge variant="secondary">{metrics.emails_sent.toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Calls Made</span>
                    <Badge variant="secondary">{metrics.calls_made.toLocaleString()}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Model training completed</span>
                    <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm">Cold outreach campaign launched</span>
                    <span className="text-xs text-gray-500 ml-auto">4 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">Lead research completed</span>
                    <span className="text-xs text-gray-500 ml-auto">6 hours ago</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-sm">Prompts optimized</span>
                    <span className="text-xs text-gray-500 ml-auto">8 hours ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Active Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-3 h-3 rounded-full ${getCampaignStatusColor(campaign.status)}`}></div>
                      <div>
                        <h3 className="font-medium">{campaign.name}</h3>
                        <p className="text-sm text-gray-600">{campaign.type} • {campaign.created_at}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-medium">{campaign.leads_targeted}</div>
                        <div className="text-gray-600">Targeted</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{campaign.responses}</div>
                        <div className="text-gray-600">Responses</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{campaign.conversions}</div>
                        <div className="text-gray-600">Conversions</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium">{formatCurrency(campaign.revenue)}</div>
                        <div className="text-gray-600">Revenue</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">94%</div>
                  <div className="text-sm text-gray-600">Response Accuracy</div>
                  <div className="text-xs text-green-600 mt-1">+5% from last week</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">23%</div>
                  <div className="text-sm text-gray-600">Conversion Rate</div>
                  <div className="text-xs text-green-600 mt-1">+2% from last week</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">$45K</div>
                  <div className="text-sm text-gray-600">Monthly Revenue</div>
                  <div className="text-xs text-green-600 mt-1">+12% from last month</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="research">
          <Card>
            <CardHeader>
              <CardTitle>Lead Research</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="Industry (e.g., Technology)" />
                  <Input placeholder="Company size (e.g., 25-100)" />
                  <Input placeholder="Location (e.g., United States)" />
                  <Button onClick={researchLeads}>
                    <Search className="w-4 h-4 mr-2" />
                    Research
                  </Button>
                </div>
                
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Enter search criteria to find new leads</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Training Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Training Type</label>
                  <select className="w-full mt-1 p-2 border rounded-md">
                    <option>Hybrid Training</option>
                    <option>Fine-tuning</option>
                    <option>RAG (Retrieval Augmented Generation)</option>
                    <option>Prompt Engineering</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Quality Threshold</label>
                  <Input type="number" min="0" max="1" step="0.1" defaultValue="0.8" />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Batch Size</label>
                  <Input type="number" min="1" max="128" defaultValue="32" />
                </div>
                
                <div>
                  <label className="text-sm font-medium">Learning Rate</label>
                  <Input type="number" min="0.0001" max="0.1" step="0.0001" defaultValue="0.0001" />
                </div>
                
                <Button className="w-full">
                  Save Configuration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AITrainingDashboard;
