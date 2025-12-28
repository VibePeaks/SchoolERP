import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Settings as SettingsIcon,
  Building2,
  Users,
  Shield,
  Bell,
  Database,
  Key,
  Globe,
  Mail,
  Smartphone,
  Save,
  RefreshCw,
  Download,
  Upload,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);

  // School Settings
  const [schoolSettings, setSchoolSettings] = useState({
    name: 'Lincoln High School',
    address: '123 Education Street, Academic City, AC 12345',
    phone: '+1 (555) 123-4567',
    email: 'admin@lincolnhigh.edu',
    website: 'https://lincolnhigh.edu',
    established: '1965',
    principal: 'Dr. Sarah Johnson',
    accreditation: 'Regional Education Board',
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'en',
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    twoFactorEnabled: false,
    passwordExpiry: 90,
    accountLockout: true,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    attendanceAlerts: true,
    feeReminders: true,
    emergencyAlerts: true,
    parentCommunication: true,
    staffAnnouncements: true,
  });

  // Integration Settings
  const [integrationSettings, setIntegrationSettings] = useState({
    emailProvider: 'smtp',
    smsProvider: 'twilio',
    paymentGateway: 'stripe',
    calendarSync: false,
    googleClassroom: false,
    microsoftTeams: false,
    zoomIntegration: true,
  });

  // System Preferences
  const [systemPreferences, setSystemPreferences] = useState({
    theme: 'light',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    defaultLanguage: 'en',
    autoSave: true,
    showTooltips: true,
    compactView: false,
    highContrast: false,
  });

  const handleSaveSettings = async (section: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`${section} settings saved successfully!`);
    } catch (error) {
      toast.error(`Failed to save ${section} settings`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportSettings = () => {
    const settings = {
      school: schoolSettings,
      security: securitySettings,
      notifications: notificationSettings,
      integrations: integrationSettings,
      preferences: systemPreferences,
    };

    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'school-settings.json';
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Settings exported successfully!');
  };

  const auditLogs = [
    { id: 1, user: 'Admin User', action: 'Updated school information', timestamp: '2024-01-20 14:30:00', ip: '192.168.1.100' },
    { id: 2, user: 'Admin User', action: 'Changed security settings', timestamp: '2024-01-20 13:45:00', ip: '192.168.1.100' },
    { id: 3, user: 'System', action: 'Automatic backup completed', timestamp: '2024-01-20 02:00:00', ip: '127.0.0.1' },
    { id: 4, user: 'Admin User', action: 'Added new user role', timestamp: '2024-01-19 16:20:00', ip: '192.168.1.100' },
    { id: 5, user: 'Teacher', action: 'Updated notification preferences', timestamp: '2024-01-19 11:15:00', ip: '192.168.1.101' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <SettingsIcon className="w-8 h-8 mr-3 text-blue-600" />
            System Settings
          </h1>
          <p className="text-gray-600 mt-1">Configure your school's system preferences and settings</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExportSettings}>
            <Download className="w-4 h-4 mr-2" />
            Export Settings
          </Button>
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import Settings
          </Button>
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general" className="flex items-center space-x-2">
            <Building2 className="w-4 h-4" />
            <span>General</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>Integrations</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <SettingsIcon className="w-4 h-4" />
            <span>Preferences</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center space-x-2">
            <Database className="w-4 h-4" />
            <span>Audit Logs</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                School Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name *</Label>
                  <Input
                    id="schoolName"
                    value={schoolSettings.name}
                    onChange={(e) => setSchoolSettings({...schoolSettings, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="principal">Principal Name</Label>
                  <Input
                    id="principal"
                    value={schoolSettings.principal}
                    onChange={(e) => setSchoolSettings({...schoolSettings, principal: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">School Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={schoolSettings.email}
                    onChange={(e) => setSchoolSettings({...schoolSettings, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={schoolSettings.phone}
                    onChange={(e) => setSchoolSettings({...schoolSettings, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={schoolSettings.website}
                    onChange={(e) => setSchoolSettings({...schoolSettings, website: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="established">Established Year</Label>
                  <Input
                    id="established"
                    value={schoolSettings.established}
                    onChange={(e) => setSchoolSettings({...schoolSettings, established: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">School Address *</Label>
                <Textarea
                  id="address"
                  value={schoolSettings.address}
                  onChange={(e) => setSchoolSettings({...schoolSettings, address: e.target.value})}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={schoolSettings.timezone} onValueChange={(value) => setSchoolSettings({...schoolSettings, timezone: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time</SelectItem>
                      <SelectItem value="America/Chicago">Central Time</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={schoolSettings.currency} onValueChange={(value) => setSchoolSettings({...schoolSettings, currency: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Default Language</Label>
                  <Select value={schoolSettings.language} onValueChange={(value) => setSchoolSettings({...schoolSettings, language: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={() => handleSaveSettings('General')} disabled={isLoading}>
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save General Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Password & Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={securitySettings.passwordMinLength}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Require Special Characters</Label>
                    <p className="text-sm text-gray-500">Passwords must contain symbols like @, #, $</p>
                  </div>
                  <Switch
                    checked={securitySettings.requireSpecialChars}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, requireSpecialChars: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Require Numbers</Label>
                    <p className="text-sm text-gray-500">Passwords must contain at least one number</p>
                  </div>
                  <Switch
                    checked={securitySettings.requireNumbers}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, requireNumbers: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Require 2FA for all admin accounts</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactorEnabled: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Account Lockout</Label>
                    <p className="text-sm text-gray-500">Lock accounts after failed login attempts</p>
                  </div>
                  <Switch
                    checked={securitySettings.accountLockout}
                    onCheckedChange={(checked) => setSecuritySettings({...securitySettings, accountLockout: checked})}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings('Security')} disabled={isLoading}>
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Security Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Communication Channels</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Send notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-gray-500">Send notifications via SMS</p>
                    </div>
                    <Switch
                      checked={notificationSettings.smsNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-500">Browser push notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Alert Types</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Attendance Alerts</Label>
                      <p className="text-sm text-gray-500">Student attendance notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.attendanceAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, attendanceAlerts: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Fee Reminders</Label>
                      <p className="text-sm text-gray-500">Payment due notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.feeReminders}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, feeReminders: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Emergency Alerts</Label>
                      <p className="text-sm text-gray-500">Critical situation notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emergencyAlerts}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emergencyAlerts: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Parent Communication</Label>
                      <p className="text-sm text-gray-500">Messages from parents</p>
                    </div>
                    <Switch
                      checked={notificationSettings.parentCommunication}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, parentCommunication: checked})}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSaveSettings('Notifications')} disabled={isLoading}>
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Notification Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Third-Party Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Communication</h3>

                  <div className="space-y-2">
                    <Label>Email Service Provider</Label>
                    <Select value={integrationSettings.emailProvider} onValueChange={(value) => setIntegrationSettings({...integrationSettings, emailProvider: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="smtp">SMTP</SelectItem>
                        <SelectItem value="sendgrid">SendGrid</SelectItem>
                        <SelectItem value="mailgun">Mailgun</SelectItem>
                        <SelectItem value="ses">Amazon SES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>SMS Service Provider</Label>
                    <Select value={integrationSettings.smsProvider} onValueChange={(value) => setIntegrationSettings({...integrationSettings, smsProvider: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="twilio">Twilio</SelectItem>
                        <SelectItem value="aws-sns">AWS SNS</SelectItem>
                        <SelectItem value="messagebird">MessageBird</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Learning Platforms</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Google Classroom</Label>
                      <p className="text-sm text-gray-500">Sync with Google Classroom</p>
                    </div>
                    <Switch
                      checked={integrationSettings.googleClassroom}
                      onCheckedChange={(checked) => setIntegrationSettings({...integrationSettings, googleClassroom: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Microsoft Teams</Label>
                      <p className="text-sm text-gray-500">Integrate with Teams</p>
                    </div>
                    <Switch
                      checked={integrationSettings.microsoftTeams}
                      onCheckedChange={(checked) => setIntegrationSettings({...integrationSettings, microsoftTeams: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Label>Zoom Integration</Label>
                      <p className="text-sm text-gray-500">Virtual classroom meetings</p>
                    </div>
                    <Switch
                      checked={integrationSettings.zoomIntegration}
                      onCheckedChange={(checked) => setIntegrationSettings({...integrationSettings, zoomIntegration: checked})}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-900">Integration Setup Required</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      To enable these integrations, you'll need to configure API keys and credentials in the secure settings section.
                      Contact your system administrator for assistance.
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={() => handleSaveSettings('Integrations')} disabled={isLoading}>
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Integration Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Preferences */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="w-5 h-5 mr-2" />
                System Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Theme</Label>
                  <Select value={systemPreferences.theme} onValueChange={(value) => setSystemPreferences({...systemPreferences, theme: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="auto">Auto (System)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Default Language</Label>
                  <Select value={systemPreferences.defaultLanguage} onValueChange={(value) => setSystemPreferences({...systemPreferences, defaultLanguage: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Format</Label>
                  <Select value={systemPreferences.dateFormat} onValueChange={(value) => setSystemPreferences({...systemPreferences, dateFormat: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Format</Label>
                  <Select value={systemPreferences.timeFormat} onValueChange={(value) => setSystemPreferences({...systemPreferences, timeFormat: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12h">12 Hour</SelectItem>
                      <SelectItem value="24h">24 Hour</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Auto-save Forms</Label>
                    <p className="text-sm text-gray-500">Automatically save form data as you type</p>
                  </div>
                  <Switch
                    checked={systemPreferences.autoSave}
                    onCheckedChange={(checked) => setSystemPreferences({...systemPreferences, autoSave: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Tooltips</Label>
                    <p className="text-sm text-gray-500">Display help tooltips throughout the application</p>
                  </div>
                  <Switch
                    checked={systemPreferences.showTooltips}
                    onCheckedChange={(checked) => setSystemPreferences({...systemPreferences, showTooltips: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Compact View</Label>
                    <p className="text-sm text-gray-500">Use smaller spacing and fonts for more content</p>
                  </div>
                  <Switch
                    checked={systemPreferences.compactView}
                    onCheckedChange={(checked) => setSystemPreferences({...systemPreferences, compactView: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>High Contrast</Label>
                    <p className="text-sm text-gray-500">Increase contrast for better accessibility</p>
                  </div>
                  <Switch
                    checked={systemPreferences.highContrast}
                    onCheckedChange={(checked) => setSystemPreferences({...systemPreferences, highContrast: checked})}
                  />
                </div>
              </div>

              <Button onClick={() => handleSaveSettings('Preferences')} disabled={isLoading}>
                {isLoading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Logs */}
        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                System Audit Logs
              </CardTitle>
              <p className="text-sm text-gray-600">Monitor system activities and changes</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <Select defaultValue="all">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by user" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="admin">Admin Users</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select defaultValue="all">
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Filter by action" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Actions</SelectItem>
                        <SelectItem value="create">Create</SelectItem>
                        <SelectItem value="update">Update</SelectItem>
                        <SelectItem value="delete">Delete</SelectItem>
                        <SelectItem value="login">Login</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Logs
                  </Button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>IP Address</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell className="text-sm text-gray-600">{log.timestamp}</TableCell>
                        <TableCell className="text-sm text-gray-600">{log.ip}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
