import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/authService';
import {
  Building2,
  Users,
  GraduationCap,
  Crown,
  Sparkles,
  Shield,
  Zap,
  Brain,
  Server,
  Eye,
  Lock,
  Star,
  CheckCircle,
  ArrowRight,
  Globe,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'teacher' | 'principal'>('admin');
  const [tenantCode, setTenantCode] = useState('default');
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [highlightedPlan, setHighlightedPlan] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  // Detect tenant from subdomain (simplified for demo)
  useEffect(() => {
    const hostname = window.location.hostname;
    const subdomain = hostname.split('.')[0];

    if (subdomain && subdomain !== 'localhost' && subdomain !== '127' && subdomain !== 'www') {
      setTenantCode(subdomain);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.login({
        email,
        password,
        tenantCode
      });
      login(email, password, role);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (selectedRole: 'admin' | 'teacher' | 'principal') => {
    const dummyEmail = `${selectedRole}@${tenantCode}.school.com`;
    const dummyPassword = 'password123';

    setEmail(dummyEmail);
    setPassword(dummyPassword);
    setRole(selectedRole);

    setTimeout(() => {
      login(dummyEmail, dummyPassword, selectedRole);
      navigate('/dashboard');
    }, 200);
  };

  const subscriptionPlans = [
    {
      name: 'Basic',
      price: '$29/month',
      features: ['Core Features', 'Up to 500 Students', 'Basic Reports'],
      color: 'bg-gray-100 text-gray-800',
      icon: Building2
    },
    {
      name: 'Premium',
      price: '$79/month',
      features: ['Everything in Basic', '+ Library Module', '+ E-Learning', 'Advanced Analytics'],
      color: 'bg-blue-100 text-blue-800',
      icon: Crown,
      popular: true
    },
    {
      name: 'Enterprise',
      price: '$149/month',
      features: ['Everything in Premium', '+ Hostel Management', '+ API Access', '+ White-labeling'],
      color: 'bg-purple-100 text-purple-800',
      icon: Sparkles
    }
  ];

  const features = [
    { icon: Brain, title: 'AI-Powered Analytics', desc: 'Predictive insights & recommendations' },
    { icon: Zap, title: 'Real-time Updates', desc: 'Live notifications & sync' },
    { icon: Shield, title: 'Enterprise Security', desc: 'Multi-tenant isolation & encryption' },
    { icon: Server, title: 'Scalable Architecture', desc: 'Auto-scaling & high availability' },
    { icon: Globe, title: 'Multi-tenant SaaS', desc: 'Unlimited schools, complete isolation' },
    { icon: BarChart3, title: 'Advanced Reporting', desc: 'AI-driven analytics & forecasting' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">School ERP SaaS</h1>
                <p className="text-sm text-gray-600">Enterprise Education Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="hidden md:flex">
                <Eye className="w-3 h-3 mr-1" />
                {tenantCode} tenant
              </Badge>
              <Button
                variant="outline"
                className="text-gray-600 border-gray-300 hover:bg-gray-50 hidden md:flex"
                onClick={() => navigate('/parent/login')}
              >
                Parent Portal
              </Button>
              {showLogin && (
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-blue-600 hidden md:flex"
                  onClick={() => setShowLogin(false)}
                >
                  ← Back to Plans
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center p-6">
        {!showLogin ? (
          // Full-Screen Welcome/Plans View
          <div className="w-full max-w-6xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-2xl">
                <Brain className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Transform Your School
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Management
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                Experience the future of education management with AI-powered analytics, real-time collaboration,
                and enterprise-grade security for modern schools.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {features.map((feature, index) => (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-shadow">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Subscription Plans */}
            <div className="mb-12">
              <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
                <p className="text-lg text-gray-600">Select the perfect plan to unlock powerful education management tools</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-12 items-stretch">
                {subscriptionPlans.map((plan, index) => (
                  <Card key={index} className={`relative group hover:shadow-2xl transition-all duration-300 ring-2 flex flex-col min-h-[500px] ${
                    highlightedPlan === plan.name.toLowerCase()
                      ? 'ring-green-500 shadow-2xl scale-105 bg-green-50'
                      : 'ring-gray-200 hover:ring-blue-300 hover:scale-102'
                  }`}>
                    {plan.popular && (
                      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-2 text-sm font-bold shadow-lg">
                          <Star className="w-4 h-4 mr-1" />
                          MOST POPULAR
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="text-center pb-4 pt-8">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 ${plan.color}`}>
                        <plan.icon className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                      <div className="text-4xl font-bold text-gray-900 mb-1">{plan.price}</div>
                      <p className="text-sm text-gray-500">per month</p>
                    </CardHeader>

                    <CardContent className="pt-0 flex flex-col flex-1 justify-between">
                      <div className="flex-1 flex flex-col justify-center py-6">
                        <ul className="space-y-4 w-full">
                          {plan.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-center space-x-3">
                              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-700 text-sm flex-1">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-auto pt-4">
                        <Button
                          className={`w-full py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 ${
                            highlightedPlan === plan.name.toLowerCase()
                              ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white transform scale-105'
                              : 'bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50'
                          }`}
                          onClick={() => {
                            setHighlightedPlan(plan.name.toLowerCase());
                            setSelectedPlan(plan.name.toLowerCase());
                            // Add a small delay to show the highlight before transitioning
                            setTimeout(() => {
                              setShowLogin(true);
                            }, 300);
                          }}
                        >
                          {highlightedPlan === plan.name.toLowerCase() ? (
                            <>
                              <CheckCircle className="w-5 h-5 mr-2" />
                              Selected!
                            </>
                          ) : (
                            <>
                              Choose {plan.name}
                              <ArrowRight className="w-5 h-5 ml-2" />
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Admin Sign In & Regular Sign In */}
            <div className="text-center space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="outline"
                  className="px-8 py-3 text-lg border-2 hover:bg-blue-50 hover:border-blue-400 flex items-center space-x-2"
                  onClick={() => setShowLogin(true)}
                >
                  <Lock className="w-5 h-5" />
                  <span>Sign In to Your Account</span>
                </Button>

                <Button
                  variant="default"
                  className="px-8 py-3 text-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 flex items-center space-x-2"
                  onClick={() => handleQuickLogin('admin')}
                >
                  <Crown className="w-5 h-5" />
                  <span>Admin Portal</span>
                </Button>
              </div>

              <p className="text-sm text-gray-500 mt-4">
                Already have an account? Sign in above • New schools can choose a plan to get started
              </p>
            </div>
          </div>
        ) : (
          // Full-Screen Login Form
          <div className="w-full max-w-md mx-auto">
            <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Lock className="w-7 h-7 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Welcome Back</CardTitle>
                <p className="text-gray-600 mt-1">
                  Sign in to your <span className="font-semibold text-blue-600">{tenantCode}</span> account
                  {selectedPlan && (
                    <span className="block text-sm mt-1 text-gray-500">
                      Selected plan: <span className="capitalize font-medium">{selectedPlan}</span>
                    </span>
                  )}
                </p>
              </CardHeader>

              <CardContent className="space-y-6 px-6 pb-6">
                {/* Quick Login Options */}
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-200 border-2"
                    onClick={() => handleQuickLogin('admin')}
                  >
                    <Users className="w-6 h-6 text-blue-600" />
                    <span className="text-sm font-medium">Admin</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2 hover:bg-green-50 hover:border-green-300 hover:shadow-md transition-all duration-200 border-2"
                    onClick={() => handleQuickLogin('teacher')}
                  >
                    <GraduationCap className="w-6 h-6 text-green-600" />
                    <span className="text-sm font-medium">Teacher</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex-col space-y-2 hover:bg-purple-50 hover:border-purple-300 hover:shadow-md transition-all duration-200 border-2"
                    onClick={() => handleQuickLogin('principal')}
                  >
                    <Crown className="w-6 h-6 text-purple-600" />
                    <span className="text-sm font-medium">Principal</span>
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-3 text-gray-500 font-medium">Or continue with</span>
                  </div>
                </div>

                {/* Manual Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="tenant" className="text-sm font-medium text-gray-700">Tenant Code</Label>
                    <Input
                      id="tenant"
                      value={tenantCode}
                      onChange={(e) => setTenantCode(e.target.value)}
                      placeholder="your-school-code"
                      className="bg-gray-50 border-gray-200 focus:border-blue-400 focus:ring-blue-400 h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@school.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium text-gray-700">Role</Label>
                    <Select value={role} onValueChange={(value: any) => setRole(value)}>
                      <SelectTrigger className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrator</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="principal">Principal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 h-12"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing In...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span>Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    )}
                  </Button>
                </form>

                {/* Back to Plans */}
                <div className="text-center pt-4">
                  <Button
                    variant="ghost"
                    className="text-gray-600 hover:text-blue-600"
                    onClick={() => setShowLogin(false)}
                  >
                    ← Back to Plans
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
