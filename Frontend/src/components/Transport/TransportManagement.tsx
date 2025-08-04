
import React, { useState } from 'react';
import { Bus, MapPin, Users, Fuel, Wrench, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Bus {
  id: string;
  number: string;
  route: string;
  driver: string;
  capacity: number;
  studentsCount: number;
  status: 'active' | 'maintenance' | 'inactive';
  lastMaintenance: string;
}

interface Route {
  id: string;
  name: string;
  stops: string[];
  distance: number;
  duration: string;
  busNumber: string;
}

const TransportManagement = () => {
  const [buses] = useState<Bus[]>([
    {
      id: '1',
      number: 'SCH001',
      route: 'Route A - City Center',
      driver: 'John Doe',
      capacity: 40,
      studentsCount: 35,
      status: 'active',
      lastMaintenance: '2024-01-01'
    },
    {
      id: '2',
      number: 'SCH002',
      route: 'Route B - Suburbs',
      driver: 'Jane Smith',
      capacity: 45,
      studentsCount: 42,
      status: 'active',
      lastMaintenance: '2023-12-15'
    },
    {
      id: '3',
      number: 'SCH003',
      route: 'Route C - North District',
      driver: 'Mike Johnson',
      capacity: 40,
      studentsCount: 0,
      status: 'maintenance',
      lastMaintenance: '2024-01-10'
    }
  ]);

  const [routes] = useState<Route[]>([
    {
      id: '1',
      name: 'Route A - City Center',
      stops: ['Central Station', 'Mall Road', 'Park Avenue', 'School'],
      distance: 15.5,
      duration: '45 min',
      busNumber: 'SCH001'
    },
    {
      id: '2',
      name: 'Route B - Suburbs',
      stops: ['Suburb Plaza', 'Garden Colony', 'Market Street', 'School'],
      distance: 12.3,
      duration: '35 min',
      busNumber: 'SCH002'
    },
    {
      id: '3',
      name: 'Route C - North District',
      stops: ['North Gate', 'Industrial Area', 'Residential Complex', 'School'],
      distance: 18.2,
      duration: '50 min',
      busNumber: 'SCH003'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalStats = () => {
    const totalBuses = buses.length;
    const activeBuses = buses.filter(b => b.status === 'active').length;
    const totalCapacity = buses.reduce((sum, bus) => sum + bus.capacity, 0);
    const totalStudents = buses.reduce((sum, bus) => sum + bus.studentsCount, 0);
    
    return { totalBuses, activeBuses, totalCapacity, totalStudents };
  };

  const stats = getTotalStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Transport Management</h1>
        <p className="text-gray-600 mt-2">Manage school buses, routes, and transportation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Bus className="text-blue-500" size={20} />
              <div>
                <p className="text-sm text-gray-600">Total Buses</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalBuses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="text-green-500" size={20} />
              <div>
                <p className="text-sm text-gray-600">Active Buses</p>
                <p className="text-2xl font-bold text-green-600">{stats.activeBuses}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="text-purple-500" size={20} />
              <div>
                <p className="text-sm text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalCapacity}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="text-orange-500" size={20} />
              <div>
                <p className="text-sm text-gray-600">Students Using</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalStudents}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="buses" className="space-y-4">
        <TabsList>
          <TabsTrigger value="buses">Bus Fleet</TabsTrigger>
          <TabsTrigger value="routes">Routes</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="tracking">Live Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="buses" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Bus Fleet Management</CardTitle>
                <Button>Add New Bus</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {buses.map(bus => (
                  <Card key={bus.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Bus className="text-blue-600" size={20} />
                          <span className="font-semibold">{bus.number}</span>
                        </div>
                        <Badge className={getStatusColor(bus.status)}>
                          {bus.status.charAt(0).toUpperCase() + bus.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{bus.route}</p>
                        <p className="text-sm">Driver: {bus.driver}</p>
                        <div className="flex justify-between text-sm">
                          <span>Capacity: {bus.capacity}</span>
                          <span>Occupied: {bus.studentsCount}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${(bus.studentsCount / bus.capacity) * 100}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500">
                          Last Maintenance: {new Date(bus.lastMaintenance).toLocaleDateString()}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="routes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Route Management</CardTitle>
                <Button>Add New Route</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {routes.map(route => (
                  <Card key={route.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="text-blue-600" size={20} />
                          <span className="font-semibold">{route.name}</span>
                        </div>
                        <Badge variant="outline">Bus: {route.busNumber}</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-600 mb-2">Stops</p>
                          <div className="space-y-1">
                            {route.stops.map((stop, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-sm">{stop}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Distance</p>
                          <p className="text-lg font-semibold">{route.distance} km</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Duration</p>
                          <p className="text-lg font-semibold">{route.duration}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {buses.map(bus => (
                  <div key={bus.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <Wrench size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{bus.number}</p>
                        <p className="text-sm text-gray-500">Driver: {bus.driver}</p>
                        <p className="text-sm text-gray-500">
                          Last Maintenance: {new Date(bus.lastMaintenance).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Badge className={getStatusColor(bus.status)}>
                        {bus.status.charAt(0).toUpperCase() + bus.status.slice(1)}
                      </Badge>
                      <Button variant="outline" size="sm">Schedule Maintenance</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Bus Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 mb-2">GPS tracking integration coming soon</p>
                <p className="text-sm text-gray-500">Real-time bus locations will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransportManagement;
