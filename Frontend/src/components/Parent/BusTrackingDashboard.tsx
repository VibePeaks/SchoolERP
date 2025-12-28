import React, { useState, useEffect } from 'react';
import {
  MapPin,
  Bus,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  Navigation,
  Phone,
  MessageSquare,
  RefreshCw,
  Shield,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface BusLocation {
  id: number;
  busId: number;
  busNumber: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  status: 'active' | 'inactive' | 'emergency' | 'delayed';
  currentStop?: string;
  nextStop?: string;
  estimatedArrival?: string;
  lastUpdate: string;
  studentsOnBoard: number;
  driverName: string;
  driverPhone: string;
  routeName: string;
}

interface StudentBusAssignment {
  studentId: number;
  studentName: string;
  busId: number;
  busNumber: string;
  pickupStop: string;
  dropStop: string;
  scheduledPickup: string;
  scheduledDrop: string;
  status: 'not_started' | 'picked_up' | 'on_route' | 'dropped_off';
}

interface BusTrackingDashboardProps {
  tenantCode: string;
  parentId: number;
}

const BusTrackingDashboard: React.FC<BusTrackingDashboardProps> = ({
  tenantCode,
  parentId
}) => {
  const [busLocations, setBusLocations] = useState<BusLocation[]>([]);
  const [studentAssignments, setStudentAssignments] = useState<StudentBusAssignment[]>([]);
  const [selectedBus, setSelectedBus] = useState<BusLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [alerts, setAlerts] = useState<any[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API calls
    const loadData = async () => {
      setLoading(true);

      // Mock student assignments
      const mockAssignments: StudentBusAssignment[] = [
        {
          studentId: 1,
          studentName: 'Emma Johnson',
          busId: 1,
          busNumber: 'BUS-001',
          pickupStop: 'Oak Street Stop',
          dropStop: 'Lincoln High School',
          scheduledPickup: '07:15',
          scheduledDrop: '08:00',
          status: 'picked_up'
        },
        {
          studentId: 2,
          studentName: 'Liam Johnson',
          busId: 2,
          busNumber: 'BUS-002',
          pickupStop: 'Maple Avenue Stop',
          dropStop: 'Riverside Middle School',
          scheduledPickup: '07:30',
          scheduledDrop: '08:15',
          status: 'on_route'
        }
      ];

      // Mock bus locations
      const mockBusLocations: BusLocation[] = [
        {
          id: 1,
          busId: 1,
          busNumber: 'BUS-001',
          latitude: 40.7128,
          longitude: -74.0060,
          speed: 25,
          heading: 45,
          status: 'active',
          currentStop: 'Oak Street Stop',
          nextStop: 'Lincoln High School',
          estimatedArrival: '08:00',
          lastUpdate: new Date().toISOString(),
          studentsOnBoard: 12,
          driverName: 'John Smith',
          driverPhone: '+1234567890',
          routeName: 'Route A - Downtown'
        },
        {
          id: 2,
          busId: 2,
          busNumber: 'BUS-002',
          latitude: 40.7589,
          longitude: -73.9851,
          speed: 15,
          heading: 180,
          status: 'delayed',
          currentStop: 'Maple Avenue Stop',
          nextStop: 'Riverside Middle School',
          estimatedArrival: '08:20',
          lastUpdate: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
          studentsOnBoard: 8,
          driverName: 'Sarah Davis',
          driverPhone: '+1234567891',
          routeName: 'Route B - Uptown'
        }
      ];

      setStudentAssignments(mockAssignments);
      setBusLocations(mockBusLocations);
      setLastUpdate(new Date());
      setLoading(false);
    };

    loadData();

    // Set up real-time updates (every 30 seconds)
    const interval = setInterval(() => {
      // In a real implementation, this would fetch fresh data
      setLastUpdate(new Date());
    }, 30000);

    return () => clearInterval(interval);
  }, [tenantCode, parentId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'delayed': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />;
      case 'inactive': return <Clock className="w-4 h-4" />;
      case 'emergency': return <AlertTriangle className="w-4 h-4" />;
      case 'delayed': return <Clock className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStudentStatusColor = (status: string) => {
    switch (status) {
      case 'picked_up': return 'bg-blue-100 text-blue-800';
      case 'on_route': return 'bg-green-100 text-green-800';
      case 'dropped_off': return 'bg-gray-100 text-gray-800';
      case 'not_started': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const refreshData = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLastUpdate(new Date());
      setLoading(false);
    }, 1000);
  };

  if (loading && busLocations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Bus Tracking</h2>
          <p className="text-gray-600">Real-time location tracking for your children's school buses</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Emergency Alerts */}
      {alerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <strong>Emergency Alert:</strong> {alerts[0].message}
          </AlertDescription>
        </Alert>
      )}

      {/* Student Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {studentAssignments.map((assignment) => (
          <Card key={assignment.studentId} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{assignment.studentName}</CardTitle>
                  <p className="text-sm text-gray-600">Bus {assignment.busNumber}</p>
                </div>
                <Badge className={getStudentStatusColor(assignment.status)}>
                  {assignment.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Pickup:</span>
                  <span className="font-medium">{assignment.scheduledPickup}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Drop-off:</span>
                  <span className="font-medium">{assignment.scheduledDrop}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Route:</span>
                  <span className="font-medium">{assignment.pickupStop} → {assignment.dropStop}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bus Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bus className="w-5 h-5 mr-2" />
            Live Bus Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {busLocations.map((bus) => (
              <div
                key={bus.id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedBus(bus)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Bus className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{bus.busNumber}</h3>
                      <p className="text-sm text-gray-600">{bus.routeName}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(bus.status)}>
                    {getStatusIcon(bus.status)}
                    <span className="ml-1">{bus.status.toUpperCase()}</span>
                  </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Current Location:</span>
                    <p className="font-medium">{bus.currentStop || 'En Route'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Next Stop:</span>
                    <p className="font-medium">{bus.nextStop || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Students:</span>
                    <p className="font-medium">{bus.studentsOnBoard} on board</p>
                  </div>
                  <div>
                    <span className="text-gray-600">ETA:</span>
                    <p className="font-medium">{bus.estimatedArrival || 'N/A'}</p>
                  </div>
                </div>

                {bus.status === 'delayed' && (
                  <Alert className="mt-3 border-yellow-200 bg-yellow-50">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                      Bus is running behind schedule. Expected delay: 5-10 minutes.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-between items-center mt-4 pt-3 border-t">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Driver: {bus.driverName}</span>
                    <span>Speed: {bus.speed} km/h</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Phone className="w-4 h-4 mr-1" />
                      Call Driver
                    </Button>
                    <Button variant="outline" size="sm">
                      <Navigation className="w-4 h-4 mr-1" />
                      View Route
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Safety Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Safe Zones</h3>
                <p className="text-sm text-gray-600">All routes monitored</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Real-time Updates</h3>
                <p className="text-sm text-gray-600">Every 30 seconds</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Parent Alerts</h3>
                <p className="text-sm text-gray-600">Instant notifications</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Contact */}
      <Card className="border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-semibold text-red-900">Emergency Contact</h3>
                <p className="text-sm text-red-700">School Transport Control: +1-800-SCHOOL</p>
              </div>
            </div>
            <Button variant="outline" className="border-red-300 text-red-700 hover:bg-red-50">
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact School
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusTrackingDashboard;
