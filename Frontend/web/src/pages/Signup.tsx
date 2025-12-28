import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  GraduationCap,
  Building2,
  Crown,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Users,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // School Information
    schoolName: '',
    schoolType: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    phone: '',

    // Admin Information
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPhone: '',
    adminPassword: '',
    confirmPassword: '',

    // Plan Selection
    selectedPlan: '',
    billingCycle: 'monthly',

    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',

    // Terms & Agreements
    agreeTerms: false,
    agreePrivacy: false,
    subscribeNewsletter: true
  });

  const plans = [
    {
      id: 'basic',
      name: 'Basic',
      price: { monthly: 29, yearly: 290 },
      features: [
        'Up to 500 Students',
        'Core Features',
        'Basic Reports',
        'Email Support'
      ],
      icon: Building2,
      color: 'bg-gray-100 text-gray-800'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: { monthly: 79, yearly: 790 },
      features: [
        'Everything in Basic',
        'Up to 2000 Students',
        'Advanced Analytics',
        'Library Module',
        'E-Learning Platform',
        'Priority Support'
      ],
      icon: Crown,
      color: 'bg-blue-100 text-blue-800',
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: { monthly: 149, yearly: 1490 },
      features: [
        'Everything in Premium',
        'Unlimited Students',
        'Custom Integrations',
        'White-labeling',
        'Dedicated Success Manager',
        '24/7 Phone Support'
      ],
      icon: Sparkles,
      color: 'bg-purple-100 text-purple-800'
    }
  ];

  const steps = [
    { id: 1, title: 'School Information', icon: GraduationCap },
    { id: 2, title: 'Admin Account', icon: User },
    { id: 3, title: 'Choose Plan', icon: Star },
    { id: 4, title: 'Payment', icon: CreditCard },
    { id: 5, title: 'Confirmation', icon: CheckCircle }
  ];

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In real implementation, this would:
      // 1. Create tenant
      // 2. Create admin user
      // 3. Process payment
      // 4. Send welcome email
      // 5. Auto-login user

      login(formData.adminEmail, formData.adminPassword, 'admin');
      navigate('/dashboard');
    } catch (error) {
      console.error('Signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedPlanData = plans.find(p => p.id === formData.selectedPlan);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">School ERP SaaS</h1>
                <p className="text-sm text-gray-600">Get Started Today</p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  s.id <= step
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  s.id <= step ? 'text-blue-600' : 'text-gray-400'
                }`}>
                  {s.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    s.id < step ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="shadow-2xl">
          <CardContent className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your school</h2>
                  <p className="text-gray-600">We'll set up your dedicated environment</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="schoolName">School Name *</Label>
                    <Input
                      id="schoolName"
                      placeholder="Lincoln High School"
                      value={formData.schoolName}
                      onChange={(e) => updateFormData('schoolName', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="schoolType">School Type</Label>
                    <Select value={formData.schoolType} onValueChange={(value) => updateFormData('schoolType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select school type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="elementary">Elementary School</SelectItem>
                        <SelectItem value="middle">Middle School</SelectItem>
                        <SelectItem value="high">High School</SelectItem>
                        <SelectItem value="k12">K-12 School</SelectItem>
                        <SelectItem value="college">College/University</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="phone">School Phone</Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => updateFormData('phone', e.target.value)}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) => updateFormData('address', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="New York"
                      value={formData.city}
                      onChange={(e) => updateFormData('city', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="NY"
                      value={formData.state}
                      onChange={(e) => updateFormData('state', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="10001"
                      value={formData.zipCode}
                      onChange={(e) => updateFormData('zipCode', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Select value={formData.country} onValueChange={(value) => updateFormData('country', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="United States">United States</SelectItem>
                        <SelectItem value="Canada">Canada</SelectItem>
                        <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                        <SelectItem value="Australia">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={nextStep} className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Admin Account</h2>
                  <p className="text-gray-600">This will be your main administrator account</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="adminFirstName">First Name *</Label>
                    <Input
                      id="adminFirstName"
                      placeholder="John"
                      value={formData.adminFirstName}
                      onChange={(e) => updateFormData('adminFirstName', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="adminLastName">Last Name *</Label>
                    <Input
                      id="adminLastName"
                      placeholder="Doe"
                      value={formData.adminLastName}
                      onChange={(e) => updateFormData('adminLastName', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="adminEmail">Email Address *</Label>
                    <Input
                      id="adminEmail"
                      type="email"
                      placeholder="admin@school.com"
                      value={formData.adminEmail}
                      onChange={(e) => updateFormData('adminEmail', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="adminPhone">Phone Number</Label>
                    <Input
                      id="adminPhone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.adminPhone}
                      onChange={(e) => updateFormData('adminPhone', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="adminPassword">Password *</Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.adminPassword}
                      onChange={(e) => updateFormData('adminPassword', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button onClick={nextStep} className="bg-gradient-to-r from-blue-600 to-purple-600">
                    Choose Plan
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Plan</h2>
                  <p className="text-gray-600">Select the perfect plan for your school's needs</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  {plans.map((plan) => (
                    <Card
                      key={plan.id}
                      className={`cursor-pointer transition-all duration-200 ${
                        formData.selectedPlan === plan.id
                          ? 'ring-2 ring-blue-500 shadow-lg scale-105'
                          : 'hover:shadow-md'
                      } ${plan.popular ? 'relative' : ''}`}
                      onClick={() => updateFormData('selectedPlan', plan.id)}
                    >
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1">
                            MOST POPULAR
                          </Badge>
                        </div>
                      )}

                      <CardHeader className="text-center pb-4 pt-6">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${plan.color}`}>
                          <plan.icon className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <div className="text-2xl font-bold text-gray-900">
                          ${plan.price[formData.billingCycle as keyof typeof plan.price]}
                          <span className="text-sm font-normal text-gray-500">
                            /{formData.billingCycle === 'yearly' ? 'year' : 'month'}
                          </span>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex items-center justify-center space-x-6 mb-6">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="billingCycle"
                      value="monthly"
                      checked={formData.billingCycle === 'monthly'}
                      onChange={(e) => updateFormData('billingCycle', e.target.value)}
                      className="text-blue-600"
                    />
                    <span>Monthly</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="billingCycle"
                      value="yearly"
                      checked={formData.billingCycle === 'yearly'}
                      onChange={(e) => updateFormData('billingCycle', e.target.value)}
                      className="text-blue-600"
                    />
                    <span>Yearly</span>
                    <Badge variant="secondary" className="ml-2">Save 20%</Badge>
                  </label>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={!formData.selectedPlan}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Continue to Payment
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Information</h2>
                  <p className="text-gray-600">Secure payment processing powered by Stripe</p>
                </div>

                {selectedPlanData && (
                  <Card className="mb-6">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedPlanData.color}`}>
                            <selectedPlanData.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-semibold">{selectedPlanData.name} Plan</h3>
                            <p className="text-sm text-gray-600">{formData.billingCycle} billing</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            ${selectedPlanData.price[formData.billingCycle as keyof typeof selectedPlanData.price]}
                          </div>
                          <div className="text-sm text-gray-600">
                            per {formData.billingCycle === 'yearly' ? 'year' : 'month'}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="cardName">Cardholder Name *</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={formData.cardName}
                      onChange={(e) => updateFormData('cardName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="cardNumber">Card Number *</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) => updateFormData('cardNumber', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="expiryDate">Expiry Date *</Label>
                    <Input
                      id="expiryDate"
                      placeholder="MM/YY"
                      value={formData.expiryDate}
                      onChange={(e) => updateFormData('expiryDate', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cvv">CVV *</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      value={formData.cvv}
                      onChange={(e) => updateFormData('cvv', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onCheckedChange={(checked) => updateFormData('agreeTerms', checked)}
                    />
                    <Label htmlFor="agreeTerms" className="text-sm">
                      I agree to the <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="agreePrivacy"
                      checked={formData.agreePrivacy}
                      onCheckedChange={(checked) => updateFormData('agreePrivacy', checked)}
                    />
                    <Label htmlFor="agreePrivacy" className="text-sm">
                      I agree to the <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="subscribeNewsletter"
                      checked={formData.subscribeNewsletter}
                      onCheckedChange={(checked) => updateFormData('subscribeNewsletter', checked)}
                    />
                    <Label htmlFor="subscribeNewsletter" className="text-sm">
                      Subscribe to our newsletter for tips and updates
                    </Label>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={!formData.agreeTerms || !formData.agreePrivacy}
                    className="bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    Complete Signup
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to VibePeaks!</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Your school account has been created successfully. We're setting up your environment and you'll receive a welcome email shortly.
                </p>

                {selectedPlanData && (
                  <Card className="max-w-md mx-auto mb-6">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedPlanData.color}`}>
                          <selectedPlanData.icon className="w-6 h-6" />
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold text-lg">{selectedPlanData.name} Plan</h3>
                          <p className="text-gray-600">Activated successfully</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div className="text-left">
                        <h4 className="font-semibold text-blue-900">Check Your Email</h4>
                        <p className="text-blue-700 text-sm">
                          We've sent setup instructions and login credentials to {formData.adminEmail}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                      <div className="text-left">
                        <h4 className="font-semibold text-green-900">Secure Environment</h4>
                        <p className="text-green-700 text-sm">
                          Your school's data is isolated and secure in our multi-tenant platform
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-lg"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Setting up your account...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Users className="w-5 h-5" />
                        <span>Access Your Dashboard</span>
                      </div>
                    )}
                  </Button>
                </div>

                <p className="text-sm text-gray-500 mt-4">
                  Need help? Contact our support team at <a href="mailto:support@vibepeaks.com" className="text-blue-600 hover:underline">support@vibepeaks.com</a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
