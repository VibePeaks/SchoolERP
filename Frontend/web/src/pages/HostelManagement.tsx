import React, { useState, useEffect } from 'react';
import {
  Bell,
  Calendar,
  CircleUserRound,
  Layers3,
  LineChart,
  Wallet,
  Users,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Bed,
  Home,
  Clock,
  DollarSign,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar as CalendarIcon,
  Wrench,
  Settings,
} from 'lucide-react';
import HeaderTab from '@/components/Hostel/Layout/HeaderTab';
import SidebarItem from '@/components/Hostel/Layout/SidebarItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

// Card Wrapper Component
const HostelCard = ({ children, className = '' }) => (
  <div className={`bg-[#2C2C2C] rounded-lg p-4 shadow ${className}`}>
    {children}
  </div>
);

// Donut Chart using react-circular-progressbar
const DonutChart = ({ label, percent, color }) => {
  const pathColor = {
    cyan: '#22d3ee',
    yellow: '#eab308',
    fuchsia: '#d946ef',
  }[color] || color;

  return (
    <div className="text-center w-24">
      <CircularProgressbar
        value={percent}
        text={`${percent}%`}
        strokeWidth={8}
        styles={buildStyles({
          pathColor,
          textColor: '#e5e7eb', // light gray text
          trailColor: '#1f2937', // dark trail
          textSize: '20px',
        })}
      />
      {label && <p className="mt-2 text-sm text-gray-300">{label}</p>}
    </div>
  );
};

// Student Card Component
const StudentCard = ({ student, onViewDetails }) => (
  <div className="flex items-center justify-between p-3 bg-[#1E1E1E] rounded hover:bg-[#252525] transition-colors cursor-pointer" onClick={() => onViewDetails(student)}>
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold text-sm">
        {student.name.charAt(0)}
      </div>
      <div>
        <p className="text-sm font-medium">{student.name}</p>
        <p className="text-xs text-gray-400">Room {student.roomNumber}</p>
      </div>
    </div>
    <Badge variant={student.status === 'active' ? 'default' : 'secondary'} className="text-xs">
      {student.status}
    </Badge>
  </div>
);

// Main Component
const HostelManagement = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [activeSidebarItem, setActiveSidebarItem] = useState('Analytics');

  // Mock Data
  const [students, setStudents] = useState([
    { id: 1, name: 'Ramakant Sharma', roomNumber: '101', status: 'active', hostel: 'Hostel 1', checkIn: '2024-01-15', checkOut: null },
    { id: 2, name: 'Priya Patel', roomNumber: '102', status: 'active', hostel: 'Hostel 1', checkIn: '2024-01-10', checkOut: null },
    { id: 3, name: 'Amit Kumar', roomNumber: '201', status: 'inactive', hostel: 'Hostel 2', checkIn: '2023-12-01', checkOut: '2024-01-20' },
    { id: 4, name: 'Sneha Gupta', roomNumber: '103', status: 'active', hostel: 'Hostel 1', checkIn: '2024-01-05', checkOut: null },
    { id: 5, name: 'Rajesh Verma', roomNumber: '202', status: 'active', hostel: 'Hostel 2', checkIn: '2024-01-12', checkOut: null },
  ]);

  const [complaints, setComplaints] = useState([
    { id: 1, studentName: 'Ramakant Sharma', room: '101', complaint: 'Water leakage in bathroom', status: 'open', priority: 'high', date: '2024-01-20' },
    { id: 2, studentName: 'Priya Patel', room: '102', complaint: 'WiFi not working', status: 'resolved', priority: 'medium', date: '2024-01-18' },
    { id: 3, studentName: 'Amit Kumar', room: '201', complaint: 'Room cleaning required', status: 'resolved', priority: 'low', date: '2024-01-15' },
    { id: 4, studentName: 'Sneha Gupta', room: '103', complaint: 'Light bulb needs replacement', status: 'open', priority: 'low', date: '2024-01-22' },
  ]);

  const [rooms, setRooms] = useState([
    { id: 1, number: '101', hostel: 'Hostel 1', type: 'Single', occupied: true, student: 'Ramakant Sharma', rent: 5000 },
    { id: 2, number: '102', hostel: 'Hostel 1', type: 'Single', occupied: true, student: 'Priya Patel', rent: 5000 },
    { id: 3, number: '103', hostel: 'Hostel 1', type: 'Single', occupied: true, student: 'Sneha Gupta', rent: 5000 },
    { id: 4, number: '201', hostel: 'Hostel 2', type: 'Double', occupied: false, student: null, rent: 8000 },
    { id: 5, number: '202', hostel: 'Hostel 2', type: 'Double', occupied: true, student: 'Rajesh Verma', rent: 8000 },
  ]);

  const [attendance, setAttendance] = useState([
    { id: 1, studentName: 'Ramakant Sharma', room: '101', date: '2024-01-22', status: 'present', time: '22:00' },
    { id: 2, studentName: 'Priya Patel', room: '102', date: '2024-01-22', status: 'present', time: '21:45' },
    { id: 3, studentName: 'Sneha Gupta', room: '103', date: '2024-01-22', status: 'late', time: '23:30' },
    { id: 4, studentName: 'Rajesh Verma', room: '202', date: '2024-01-22', status: 'absent', time: null },
  ]);

  const [maintenance, setMaintenance] = useState([
    { id: 1, room: '101', issue: 'Water leakage in bathroom', priority: 'high', status: 'pending', assignedTo: 'Plumber', date: '2024-01-20' },
    { id: 2, room: '102', issue: 'WiFi router replacement', priority: 'medium', status: 'in-progress', assignedTo: 'IT Support', date: '2024-01-18' },
    { id: 3, room: '103', issue: 'Light bulb replacement', priority: 'low', status: 'completed', assignedTo: 'Electrician', date: '2024-01-22' },
  ]);

  const sidebarItems = [
    { icon: <LineChart />, label: 'Analytics' },
    { icon: <CircleUserRound />, label: 'Students' },
    { icon: <Bell />, label: 'Complaints' },
    { icon: <Layers3 />, label: 'Stock' },
    { icon: <Users />, label: 'Users' },
    { icon: <Wallet />, label: 'Meals' },
  ];

  const headerTabs = ['Dashboard', 'Rooms', 'Attendance', 'Accounts', 'Maintenance'];

  // Dialog states
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddComplaintOpen, setIsAddComplaintOpen] = useState(false);
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Form states
  const [newStudent, setNewStudent] = useState({
    name: '', roomNumber: '', hostel: 'Hostel 1', checkInDate: '', rent: ''
  });
  const [newComplaint, setNewComplaint] = useState({
    studentName: '', room: '', complaint: '', priority: 'medium'
  });
  const [newRoom, setNewRoom] = useState({
    number: '', hostel: 'Hostel 1', type: 'Single', rent: ''
  });

  const handleViewStudentDetails = (student) => {
    setSelectedStudent(student);
  };

  const handleAddStudent = () => {
    const student = {
      id: students.length + 1,
      name: newStudent.name,
      roomNumber: newStudent.roomNumber,
      status: 'active',
      hostel: newStudent.hostel,
      checkIn: newStudent.checkInDate,
      checkOut: null
    };
    setStudents([...students, student]);
    setNewStudent({ name: '', roomNumber: '', hostel: 'Hostel 1', checkInDate: '', rent: '' });
    setIsAddStudentOpen(false);
  };

  const handleAddComplaint = () => {
    const complaint = {
      id: complaints.length + 1,
      studentName: newComplaint.studentName,
      room: newComplaint.room,
      complaint: newComplaint.complaint,
      status: 'open',
      priority: newComplaint.priority,
      date: new Date().toISOString().split('T')[0]
    };
    setComplaints([...complaints, complaint]);
    setNewComplaint({ studentName: '', room: '', complaint: '', priority: 'medium' });
    setIsAddComplaintOpen(false);
  };

  const handleAddRoom = () => {
    const room = {
      id: rooms.length + 1,
      number: newRoom.number,
      hostel: newRoom.hostel,
      type: newRoom.type,
      occupied: false,
      student: null,
      rent: parseInt(newRoom.rent)
    };
    setRooms([...rooms, room]);
    setNewRoom({ number: '', hostel: 'Hostel 1', type: 'Single', rent: '' });
    setIsAddRoomOpen(false);
  };

  const renderAnalytics = () => (
    <div className="grid grid-cols-4 gap-4 p-6">
      {/* Occupancy */}
      <HostelCard className="col-span-3">
        <h2 className="text-lg font-semibold mb-4">Occupancy</h2>
        <div className="flex space-x-6">
          <DonutChart label="Hostel 1" percent={75} color="cyan" />
          <DonutChart label="Hostel 2" percent={60} color="yellow" />
          <DonutChart label="Hostel 3" percent={90} color="fuchsia" />
        </div>
      </HostelCard>

      {/* Student Updates */}
      <HostelCard>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-2">
          {students.slice(0, 5).map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onViewDetails={handleViewStudentDetails}
            />
          ))}
        </div>
      </HostelCard>

      {/* Fees */}
      <HostelCard className="col-span-3">
        <h2 className="text-lg font-semibold mb-4">Fees Collection</h2>
        <div className="flex justify-between items-center">
          <DonutChart label="" percent={65} color="cyan" />
          <div className="space-y-2">
            <p>Expected: ₹5,20,000</p>
            <p className="text-cyan-400">Collected: ₹3,38,000</p>
          </div>
          <div className="space-y-2">
            <p className="text-yellow-400">Remaining: ₹1,82,000</p>
            <p className="text-fuchsia-500">Overdue: ₹45,000</p>
          </div>
        </div>
      </HostelCard>

      {/* Complaints */}
      <HostelCard>
        <h2 className="text-lg font-semibold mb-4">Complaints Status</h2>
        <div className="space-y-4">
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-3 bg-cyan-400"
              style={{ width: `${(complaints.filter(c => c.status === 'resolved').length / complaints.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-sm space-y-1">
            <p>Total: {complaints.length}</p>
            <p className="text-green-400">Resolved: {complaints.filter(c => c.status === 'resolved').length}</p>
            <p className="text-yellow-400">Open: {complaints.filter(c => c.status === 'open').length}</p>
          </div>
        </div>
      </HostelCard>

      {/* Emergency */}
      <HostelCard className="col-span-4 flex justify-center items-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-2">
            <AlertTriangle size={40} />
          </div>
          <p className="mb-2 text-lg font-semibold">Emergency Alert System</p>
          <p className="text-sm text-gray-400 mb-4">Press only in case of emergency</p>
          <button className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg">
            🚨 EMERGENCY ALERT
          </button>
        </div>
      </HostelCard>
    </div>
  );

  const renderStudents = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Student Management</h2>
        <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
          <DialogTrigger asChild>
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              <Plus size={16} className="mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#2C2C2C] border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Student</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentName">Full Name</Label>
                <Input
                  id="studentName"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                  placeholder="Student name"
                  className="bg-[#1E1E1E] border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  value={newStudent.roomNumber}
                  onChange={(e) => setNewStudent({...newStudent, roomNumber: e.target.value})}
                  placeholder="Room number"
                  className="bg-[#1E1E1E] border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="hostel">Hostel</Label>
                <Select value={newStudent.hostel} onValueChange={(value) => setNewStudent({...newStudent, hostel: value})}>
                  <SelectTrigger className="bg-[#1E1E1E] border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hostel 1">Hostel 1</SelectItem>
                    <SelectItem value="Hostel 2">Hostel 2</SelectItem>
                    <SelectItem value="Hostel 3">Hostel 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="checkInDate">Check-in Date</Label>
                <Input
                  id="checkInDate"
                  type="date"
                  value={newStudent.checkInDate}
                  onChange={(e) => setNewStudent({...newStudent, checkInDate: e.target.value})}
                  className="bg-[#1E1E1E] border-gray-600"
                />
              </div>
            </div>
            <Button onClick={handleAddStudent} className="w-full mt-4 bg-cyan-600 hover:bg-cyan-700">
              Add Student
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <Card key={student.id} className="bg-[#2C2C2C] border-gray-700 hover:bg-[#333] transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-cyan-400 flex items-center justify-center text-black font-bold">
                    {student.name.charAt(0)}
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">{student.name}</CardTitle>
                    <p className="text-sm text-gray-400">Room {student.roomNumber}</p>
                  </div>
                </div>
                <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                  {student.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Hostel:</span>
                  <span className="text-white">{student.hostel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Check-in:</span>
                  <span className="text-white">{student.checkIn}</span>
                </div>
                {student.checkOut && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Check-out:</span>
                    <span className="text-white">{student.checkOut}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderComplaints = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Complaints Management</h2>
        <Dialog open={isAddComplaintOpen} onOpenChange={setIsAddComplaintOpen}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              <Plus size={16} className="mr-2" />
              Add Complaint
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#2C2C2C] border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Complaint</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="studentName">Student Name</Label>
                <Input
                  id="studentName"
                  value={newComplaint.studentName}
                  onChange={(e) => setNewComplaint({...newComplaint, studentName: e.target.value})}
                  placeholder="Student name"
                  className="bg-[#1E1E1E] border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="room">Room Number</Label>
                <Input
                  id="room"
                  value={newComplaint.room}
                  onChange={(e) => setNewComplaint({...newComplaint, room: e.target.value})}
                  placeholder="Room number"
                  className="bg-[#1E1E1E] border-gray-600"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="complaint">Complaint Description</Label>
                <Textarea
                  id="complaint"
                  value={newComplaint.complaint}
                  onChange={(e) => setNewComplaint({...newComplaint, complaint: e.target.value})}
                  placeholder="Describe the complaint"
                  className="bg-[#1E1E1E] border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newComplaint.priority} onValueChange={(value) => setNewComplaint({...newComplaint, priority: value})}>
                  <SelectTrigger className="bg-[#1E1E1E] border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleAddComplaint} className="w-full mt-4 bg-yellow-600 hover:bg-yellow-700">
              Add Complaint
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {complaints.map((complaint) => (
          <Card key={complaint.id} className="bg-[#2C2C2C] border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold text-white">{complaint.studentName}</h3>
                    <Badge variant="outline">Room {complaint.room}</Badge>
                    <Badge
                      variant={complaint.priority === 'high' ? 'destructive' :
                              complaint.priority === 'medium' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {complaint.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-300 mb-2">{complaint.complaint}</p>
                  <p className="text-sm text-gray-500">Reported on: {complaint.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={complaint.status === 'resolved' ? 'default' : 'secondary'}>
                    {complaint.status}
                  </Badge>
                  {complaint.status === 'open' && (
                    <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white">
                      <CheckCircle size={14} className="mr-1" />
                      Resolve
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderRooms = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Room Management</h2>
        <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Plus size={16} className="mr-2" />
              Add Room
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-[#2C2C2C] border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">Add New Room</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="roomNumber">Room Number</Label>
                <Input
                  id="roomNumber"
                  value={newRoom.number}
                  onChange={(e) => setNewRoom({...newRoom, number: e.target.value})}
                  placeholder="Room number"
                  className="bg-[#1E1E1E] border-gray-600"
                />
              </div>
              <div>
                <Label htmlFor="roomHostel">Hostel</Label>
                <Select value={newRoom.hostel} onValueChange={(value) => setNewRoom({...newRoom, hostel: value})}>
                  <SelectTrigger className="bg-[#1E1E1E] border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hostel 1">Hostel 1</SelectItem>
                    <SelectItem value="Hostel 2">Hostel 2</SelectItem>
                    <SelectItem value="Hostel 3">Hostel 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="roomType">Room Type</Label>
                <Select value={newRoom.type} onValueChange={(value) => setNewRoom({...newRoom, type: value})}>
                  <SelectTrigger className="bg-[#1E1E1E] border-gray-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Double">Double</SelectItem>
                    <SelectItem value="Triple">Triple</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="roomRent">Monthly Rent (₹)</Label>
                <Input
                  id="roomRent"
                  type="number"
                  value={newRoom.rent}
                  onChange={(e) => setNewRoom({...newRoom, rent: e.target.value})}
                  placeholder="5000"
                  className="bg-[#1E1E1E] border-gray-600"
                />
              </div>
            </div>
            <Button onClick={handleAddRoom} className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
              Add Room
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rooms.map((room) => (
          <Card key={room.id} className="bg-[#2C2C2C] border-gray-700 hover:bg-[#333] transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-lg bg-purple-400 flex items-center justify-center">
                    <Bed size={20} className="text-black" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-white">Room {room.number}</CardTitle>
                    <p className="text-sm text-gray-400">{room.hostel} • {room.type}</p>
                  </div>
                </div>
                <Badge variant={room.occupied ? 'default' : 'secondary'}>
                  {room.occupied ? 'Occupied' : 'Vacant'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly Rent:</span>
                  <span className="text-white">₹{room.rent}</span>
                </div>
                {room.student && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Occupant:</span>
                    <span className="text-white">{room.student}</span>
                  </div>
                )}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-400">Status:</span>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" className="border-gray-600">
                      <Edit size={14} />
                    </Button>
                    <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAttendance = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Attendance Tracking</h2>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-gray-600">
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button className="bg-green-600 hover:bg-green-700">
            <CheckCircle size={16} className="mr-2" />
            Mark Present
          </Button>
        </div>
      </div>

      <Card className="bg-[#2C2C2C] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Today's Attendance - {new Date().toLocaleDateString()}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Student Name</TableHead>
                <TableHead className="text-gray-300">Room</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Time</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attendance.map((record) => (
                <TableRow key={record.id} className="border-gray-700">
                  <TableCell className="text-white">{record.studentName}</TableCell>
                  <TableCell className="text-gray-300">{record.room}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        record.status === 'present' ? 'default' :
                        record.status === 'late' ? 'secondary' : 'destructive'
                      }
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{record.time || 'N/A'}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-green-500 text-green-500">
                        <CheckCircle size={14} />
                      </Button>
                      <Button size="sm" variant="outline" className="border-yellow-500 text-yellow-500">
                        <Clock size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderAccounts = () => (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-[#2C2C2C] border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Revenue</p>
                <p className="text-2xl font-bold text-white">₹12,45,000</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2C2C2C] border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Pending Payments</p>
                <p className="text-2xl font-bold text-yellow-400">₹2,34,000</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2C2C2C] border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Overdue</p>
                <p className="text-2xl font-bold text-red-400">₹1,23,000</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2C2C2C] border-gray-700">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Collected This Month</p>
                <p className="text-2xl font-bold text-cyan-400">₹8,90,000</p>
              </div>
              <CheckCircle className="w-8 h-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#2C2C2C] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { student: 'Ramakant Sharma', amount: '₹5,000', date: '2024-01-15', status: 'paid' },
                { student: 'Priya Patel', amount: '₹5,000', date: '2024-01-15', status: 'paid' },
                { student: 'Sneha Gupta', amount: '₹5,000', date: '2024-01-14', status: 'paid' },
                { student: 'Rajesh Verma', amount: '₹8,000', date: '2024-01-10', status: 'overdue' },
              ].map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#1E1E1E] rounded">
                  <div>
                    <p className="text-white font-medium">{payment.student}</p>
                    <p className="text-sm text-gray-400">{payment.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{payment.amount}</p>
                    <Badge variant={payment.status === 'paid' ? 'default' : 'destructive'} className="text-xs">
                      {payment.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2C2C2C] border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Generate Invoice</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="student-select" className="text-gray-300">Select Student</Label>
              <Select>
                <SelectTrigger className="bg-[#1E1E1E] border-gray-600 text-white">
                  <SelectValue placeholder="Choose student" />
                </SelectTrigger>
                <SelectContent>
                  {students.filter(s => s.status === 'active').map(student => (
                    <SelectItem key={student.id} value={student.id.toString()}>
                      {student.name} (Room {student.roomNumber})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="month-select" className="text-gray-300">Month</Label>
              <Select>
                <SelectTrigger className="bg-[#1E1E1E] border-gray-600 text-white">
                  <SelectValue placeholder="Select month" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="january">January</SelectItem>
                  <SelectItem value="february">February</SelectItem>
                  <SelectItem value="march">March</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Download size={16} className="mr-2" />
              Generate Invoice
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderMaintenance = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Maintenance Requests</h2>
        <Button className="bg-orange-600 hover:bg-orange-700">
          <Plus size={16} className="mr-2" />
          New Request
        </Button>
      </div>

      <Card className="bg-[#2C2C2C] border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Maintenance Queue</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-gray-700">
                <TableHead className="text-gray-300">Room</TableHead>
                <TableHead className="text-gray-300">Issue</TableHead>
                <TableHead className="text-gray-300">Priority</TableHead>
                <TableHead className="text-gray-300">Status</TableHead>
                <TableHead className="text-gray-300">Assigned To</TableHead>
                <TableHead className="text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {maintenance.map((item) => (
                <TableRow key={item.id} className="border-gray-700">
                  <TableCell className="text-white">{item.room}</TableCell>
                  <TableCell className="text-gray-300">{item.issue}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.priority === 'high' ? 'destructive' :
                        item.priority === 'medium' ? 'default' : 'secondary'
                      }
                    >
                      {item.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === 'completed' ? 'default' :
                        item.status === 'in-progress' ? 'secondary' : 'outline'
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-300">{item.assignedTo}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-blue-500 text-blue-500">
                        <Edit size={14} />
                      </Button>
                      {item.status !== 'completed' && (
                        <Button size="sm" variant="outline" className="border-green-500 text-green-500">
                          <CheckCircle size={14} />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSidebarItem) {
      case 'Analytics': return renderAnalytics();
      case 'Students': return renderStudents();
      case 'Complaints': return renderComplaints();
      case 'Stock': return <div className="p-6"><h2 className="text-2xl font-bold">Stock Management - Coming Soon</h2></div>;
      case 'Users': return <div className="p-6"><h2 className="text-2xl font-bold">User Management - Coming Soon</h2></div>;
      case 'Meals': return <div className="p-6"><h2 className="text-2xl font-bold">Meal Management - Coming Soon</h2></div>;
      default: return renderAnalytics();
    }
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case 'Dashboard': return renderContent();
      case 'Rooms': return renderRooms();
      case 'Attendance': return renderAttendance();
      case 'Accounts': return renderAccounts();
      case 'Maintenance': return renderMaintenance();
      default: return renderContent();
    }
  };

  return (
    <div className="flex h-screen bg-[#1E1E1E] text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#2C2C2C] p-4 flex flex-col justify-between">
        <div>
          <div className="text-cyan-400 text-2xl font-bold mb-10">HMS</div>
          <div className="space-y-4">
            {sidebarItems.map((item) => (
              <SidebarItem
                key={item.label}
                icon={item.icon}
                label={item.label}
                active={activeSidebarItem === item.label}
                onClick={() => setActiveSidebarItem(item.label)}
              />
            ))}
          </div>
        </div>
        <div className="text-sm text-gray-500">v1.0.0</div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="h-16 bg-[#2C2C2C] flex items-center justify-between px-6 border-b border-gray-700">
          <div className="flex space-x-8">
            {headerTabs.map((tab) => (
              <HeaderTab
                key={tab}
                label={tab}
                active={activeTab === tab}
                onClick={() => setActiveTab(tab)}
              />
            ))}
          </div>
          <div className="flex space-x-4 items-center">
            <Calendar className="text-gray-400" />
            <Bell className="text-yellow-400" />
            <CircleUserRound className="text-cyan-400" />
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default HostelManagement;
