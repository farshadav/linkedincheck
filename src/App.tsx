import React, { useState } from 'react';
import { Search, Shield, AlertTriangle, CheckCircle, Activity, Users, LineChart, PieChart, AlertCircle } from 'lucide-react';

type AnalysisState = 'idle' | 'loading' | 'results';

// Helper function to create a more unique hash from string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Generate a random number between min and max using a seed
function seededRandom(seed: number, min: number, max: number): number {
  const x = Math.sin(seed) * 10000;
  const result = x - Math.floor(x);
  return Math.floor(result * (max - min + 1)) + min;
}

// Helper function to generate realistic-looking random data based on profile URL
function generateAnalysisData(profileUrl: string) {
  // Extract username from URL for more variation
  const username = profileUrl.toLowerCase().split('/').filter(Boolean).pop() || '';
  const baseHash = hashString(username);
  
  // Generate multiple seeds for different aspects
  const seeds = {
    credibility: baseHash % 1000,
    engagement: (baseHash * 13) % 1000,
    followers: (baseHash * 17) % 1000,
    growth: (baseHash * 23) % 1000
  };

  // Profile age factor (0-1) based on username length and characteristics
  const profileAgeFactor = (username.length * 0.1) + 
    (username.match(/\d+/) ? 0.2 : 0.5) + // Penalize usernames with numbers
    (username.length > 10 ? 0.3 : 0) + // Bonus for longer usernames
    (username.match(/^[a-z]+$/) ? 0.4 : 0); // Bonus for clean usernames

  // Generate base scores with multiple factors
  const credibilityBase = seededRandom(seeds.credibility, 40, 95);
  const credibilityScore = Math.min(100, Math.max(40, 
    Math.floor(credibilityBase * (0.8 + (profileAgeFactor * 0.2)))
  ));

  // Calculate engagement metrics first
  // Industry average engagement rates for LinkedIn:
  // - Poor: < 0.5%
  // - Good: 0.5% - 2%
  // - Very Good: 2% - 5%
  // - Exceptional: > 5%
  
  // Base engagement rate calculation
  const baseEngagementRate = seededRandom(seeds.engagement, 5, 80) / 10; // 0.5% to 8%
  
  // Adjust based on profile authenticity
  const adjustedEngagementRate = baseEngagementRate * (0.7 + (profileAgeFactor * 0.3));
  
  // Calculate engagement quality score based on the rate
  let engagementScore: number;
  if (adjustedEngagementRate <= 0.5) {
    engagementScore = Math.floor(seededRandom(seeds.engagement, 30, 45));
  } else if (adjustedEngagementRate <= 2) {
    engagementScore = Math.floor(seededRandom(seeds.engagement, 46, 70));
  } else if (adjustedEngagementRate <= 5) {
    engagementScore = Math.floor(seededRandom(seeds.engagement, 71, 85));
  } else {
    engagementScore = Math.floor(seededRandom(seeds.engagement, 86, 100));
  }

  // Calculate follower metrics
  const realFollowersBase = seededRandom(seeds.followers, 60, 95);
  const realFollowers = Math.min(100, Math.max(60,
    Math.floor(realFollowersBase * (0.9 + (profileAgeFactor * 0.1)))
  ));

  const suspiciousAccountsBase = seededRandom(seeds.followers, 5, 35);
  const suspiciousAccounts = Math.min(40, Math.max(5,
    Math.floor(suspiciousAccountsBase * (1.2 - profileAgeFactor))
  ));

  // Format engagement rate with one decimal place
  const engagementRate = adjustedEngagementRate.toFixed(1);

  // Generate findings based on multiple factors
  const findings = [];

  // Profile strength findings
  if (credibilityScore > 85) {
    findings.push({
      type: 'success' as const,
      title: 'Exceptional Profile Strength',
      description: 'Profile demonstrates high authenticity with strong professional network'
    });
  } else if (credibilityScore > 75) {
    findings.push({
      type: 'success' as const,
      title: 'Strong Profile Authenticity',
      description: 'Most followers have complete profiles with verified work history'
    });
  } else if (credibilityScore < 60) {
    findings.push({
      type: 'warning' as const,
      title: 'Profile Credibility Concerns',
      description: 'Multiple indicators suggest potential profile authenticity issues'
    });
  }

  // Engagement findings based on rate and score
  if (adjustedEngagementRate > 5) {
    findings.push({
      type: 'success' as const,
      title: 'Exceptional Engagement',
      description: `Outstanding engagement rate of ${engagementRate}% indicates highly valuable content and authentic audience`
    });
  } else if (adjustedEngagementRate > 2) {
    findings.push({
      type: 'success' as const,
      title: 'Strong Engagement',
      description: `Healthy engagement rate of ${engagementRate}% shows good audience interaction`
    });
  } else if (adjustedEngagementRate < 0.5) {
    findings.push({
      type: 'warning' as const,
      title: 'Low Engagement',
      description: `Engagement rate of ${engagementRate}% is below industry average`
    });
  }

  // Suspicious activity findings
  if (suspiciousAccounts > 25) {
    findings.push({
      type: 'warning' as const,
      title: 'High Suspicious Activity',
      description: 'Significant percentage of potentially suspicious accounts detected'
    });
  } else if (suspiciousAccounts > 15) {
    findings.push({
      type: 'warning' as const,
      title: 'Elevated Suspicious Activity',
      description: 'Higher than average percentage of potentially suspicious accounts'
    });
  }

  // Growth pattern findings
  const growthAnomaly = seededRandom(seeds.growth, 0, 100) > 70;
  if (growthAnomaly) {
    findings.push({
      type: 'warning' as const,
      title: 'Unusual Growth Pattern',
      description: 'Detected sudden increase in followers during last month'
    });
  }

  // Add engagement context
  findings.push({
    type: 'info' as const,
    title: 'LinkedIn Engagement Context',
    description: 'Industry average engagement rate is 0.5-2%. Rates above 5% are exceptional.'
  });

  return {
    credibilityScore,
    engagementScore,
    realFollowers: `${realFollowers}%`,
    suspiciousAccounts: `${suspiciousAccounts}%`,
    engagementRate: `${engagementRate}%`,
    findings
  };
}

function App() {
  const [profileUrl, setProfileUrl] = useState('');
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [error, setError] = useState('');
  const [analysisData, setAnalysisData] = useState<ReturnType<typeof generateAnalysisData> | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic LinkedIn URL validation
    if (!profileUrl.match(/linkedin\.com\/(in|company)\/[\w-]+\/?$/i)) {
      setError('Please enter a valid LinkedIn profile URL (e.g., https://www.linkedin.com/in/username)');
      return;
    }
    
    setError('');
    setAnalysisState('loading');
    
    // Simulate API call with random delay
    setTimeout(() => {
      const data = generateAnalysisData(profileUrl);
      setAnalysisData(data);
      setAnalysisState('results');
    }, 1500 + Math.random() * 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-semibold text-gray-900">LinkedIn Profile Plausibility Check</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {analysisState === 'idle' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Analyze LinkedIn Profile Authenticity
                </h2>
                <p className="text-gray-600">
                  Enter a public LinkedIn profile URL to evaluate follower credibility and engagement patterns
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="profile-url" className="block text-sm font-medium text-gray-700">
                    LinkedIn Profile URL
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="profile-url"
                      className={`block w-full pl-10 pr-3 py-2 border ${
                        error ? 'border-red-300' : 'border-gray-300'
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="https://www.linkedin.com/in/username"
                      value={profileUrl}
                      onChange={(e) => setProfileUrl(e.target.value)}
                    />
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600">
                      {error}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Analyze Profile
                </button>
              </form>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Feature
                icon={<Shield className="h-6 w-6" />}
                title="Follower Authenticity"
                description="Evaluate profile completeness, account age, and connection patterns"
              />
              <Feature
                icon={<Activity className="h-6 w-6" />}
                title="Engagement Analysis"
                description="Analyze like-to-follow ratio and content interaction quality"
              />
              <Feature
                icon={<Users className="h-6 w-6" />}
                title="Network Quality"
                description="Detect suspicious growth patterns and connection authenticity"
              />
              <Feature
                icon={<LineChart className="h-6 w-6" />}
                title="Visual Insights"
                description="View detailed graphs and charts of follower analytics"
              />
            </div>
          </div>
        )}

        {analysisState === 'loading' && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <h2 className="mt-4 text-xl font-semibold text-gray-900">Analyzing Profile</h2>
              <p className="mt-2 text-gray-600">This may take a few moments...</p>
            </div>
          </div>
        )}

        {analysisState === 'results' && analysisData && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis Results</h2>
                <div className="flex items-center space-x-2">
                  <div className="text-green-600">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <p className="text-gray-600">Analysis completed for: {profileUrl}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <ScoreCard
                  title="Overall Credibility Score"
                  score={analysisData.credibilityScore}
                  icon={<Shield className="h-6 w-6" />}
                />
                <ScoreCard
                  title="Engagement Quality"
                  score={analysisData.engagementScore}
                  icon={<Activity className="h-6 w-6" />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <StatCard
                  title="Real Followers"
                  value={analysisData.realFollowers}
                  trend="positive"
                />
                <StatCard
                  title="Suspicious Accounts"
                  value={analysisData.suspiciousAccounts}
                  trend="warning"
                />
                <StatCard
                  title="Engagement Rate"
                  value={analysisData.engagementRate}
                  trend="neutral"
                />
              </div>

              <div className="border-t border-gray-200 pt-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Findings</h3>
                <div className="space-y-4">
                  {analysisData.findings.map((finding, index) => (
                    <Finding
                      key={index}
                      type={finding.type}
                      title={finding.title}
                      description={finding.description}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function ScoreCard({ title, score, icon }: { title: string; score: number; icon: React.ReactNode }) {
  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        <div className="text-blue-600">{icon}</div>
      </div>
      <div className="flex items-end space-x-2">
        <span className="text-4xl font-bold text-gray-900">{score}</span>
        <span className="text-gray-500 mb-1">/100</span>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend }: { title: string; value: string; trend: 'positive' | 'negative' | 'warning' | 'neutral' }) {
  const getTrendColor = () => {
    switch (trend) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h4 className="text-sm font-medium text-gray-500">{title}</h4>
      <p className={`text-2xl font-semibold mt-2 ${getTrendColor()}`}>{value}</p>
    </div>
  );
}

function Finding({ type, title, description }: { type: 'success' | 'warning' | 'info'; title: string; description: string }) {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info': return <AlertCircle className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div className="flex items-start space-x-3">
      <div className="flex-shrink-0">{getIcon()}</div>
      <div>
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <p className="mt-1 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}

export default App;