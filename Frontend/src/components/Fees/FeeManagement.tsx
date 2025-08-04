import React, { useState } from 'react';
import { DollarSign, Calendar, Check, AlertCircle, Filter, Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ReceiptGenerator } from './ReceiptGenerator';

interface Fee {
  id: string;
  studentId: string;
  studentName: string;
  feeType: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue';
  paymentDate?: string;
  receiptNumber?: string;
}

const FeeManagement = () => {
  const [fees, setFees] = useState<Fee[]>([
    {
      id: '1',
      studentId: 'STU001',
      studentName: 'Alice Johnson',
      feeType: 'Tuition',
      amount: 500,
      dueDate: '2023-11-15',
      status: 'paid',
      paymentDate: '2023-11-10',
      receiptNumber: 'RC-2023-001'
    },
    {
      id: '2',
      studentId: 'STU002',
      studentName: 'Bob Smith',
      feeType: 'Tuition',
      amount: 500,
      dueDate: '2023-11-15',
      status: 'pending'
    },
    {
      id: '3',
      studentId: 'STU003',
      studentName: 'Charlie Brown',
      feeType: 'Library',
      amount: 50,
      dueDate: '2023-11-01',
      status: 'overdue'
    }
  ]);

  const [filterStatus, setFilterStatus] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFee, setNewFee] = useState<Partial<Fee>>({
    feeType: 'Tuition',
    amount: 0,
    dueDate: new Date().toISOString().split('T')[0]
  });
  const [selectedReceipt, setSelectedReceipt] = useState<Fee | null>(null);

  const feeTypes = ['Tuition', 'Library', 'Transport', 'Uniform', 'Exam'];

  const handleAddFee = () => {
    if (newFee.studentId && newFee.amount && newFee.dueDate) {
      const feeToAdd: Fee = {
        id: Date.now().toString(),
        studentId: newFee.studentId,
        studentName: newFee.studentName || 'Unknown Student',
        feeType: newFee.feeType || 'Tuition',
        amount: newFee.amount,
        dueDate: newFee.dueDate,
        status: 'pending'
      };
      setFees([...fees, feeToAdd]);
      setNewFee({});
      setIsAddDialogOpen(false);
    }
  };

  const handleMarkAsPaid = (id: string) => {
    setFees(fees.map(fee => 
      fee.id === id ? { 
        ...fee, 
        status: 'paid',
        paymentDate: new Date().toISOString().split('T')[0],
        receiptNumber: `RC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      } : fee
    ));
  };

  const filteredFees = fees.filter(fee => 
    filterStatus === 'all' || fee.status === filterStatus
  );

  const totalPending = fees.filter(f => f.status === 'pending').reduce((sum, fee) => sum + fee.amount, 0);
  const totalOverdue = fees.filter(f => f.status === 'overdue').reduce((sum, fee) => sum + fee.amount, 0);
  const totalPaid = fees.filter(f => f.status === 'paid').reduce((sum, fee) => sum + fee.amount, 0);

  const handleViewReceipt = (fee: Fee) => {
    if (fee.status === 'paid' && fee.paymentDate && fee.receiptNumber) {
      setSelectedReceipt(fee);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Fee Dialog */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
          <p className="text-gray-600 mt-2">Track and manage student payments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus size={20} />
              <span>Add Fee</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Fee</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Student ID</Label>
                <Input 
                  value={newFee.studentId || ''}
                  onChange={(e) => setNewFee({...newFee, studentId: e.target.value})}
                  placeholder="STU001"
                />
              </div>
              <div>
                <Label>Fee Type</Label>
                <Select 
                  value={newFee.feeType || 'Tuition'}
                  onValueChange={(value) => setNewFee({...newFee, feeType: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select fee type" />
                  </SelectTrigger>
                  <SelectContent>
                    {feeTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount</Label>
                <Input 
                  type="number"
                  value={newFee.amount || ''}
                  onChange={(e) => setNewFee({...newFee, amount: Number(e.target.value)})}
                  placeholder="500"
                />
              </div>
              <div>
                <Label>Due Date</Label>
                <Input 
                  type="date"
                  value={newFee.dueDate || ''}
                  onChange={(e) => setNewFee({...newFee, dueDate: e.target.value})}
                />
              </div>
              <Button onClick={handleAddFee}>Add Fee</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPending}</div>
            <p className="text-xs text-muted-foreground">Unpaid student fees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Fees</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalOverdue}</div>
            <p className="text-xs text-muted-foreground">Past due date fees</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Fees</CardTitle>
            <Check className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid}</div>
            <p className="text-xs text-muted-foreground">Completed payments</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Select 
            value={filterStatus} 
            onValueChange={(value: 'all' | 'paid' | 'pending' | 'overdue') => setFilterStatus(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" className="gap-2">
          <Download size={16} />
          Export
        </Button>
      </div>

      {/* Fees Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Fee Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell className="font-medium">{fee.studentName}</TableCell>
                  <TableCell>{fee.feeType}</TableCell>
                  <TableCell>${fee.amount}</TableCell>
                  <TableCell>{new Date(fee.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Badge variant={
                      fee.status === 'paid' ? 'default' : 
                      fee.status === 'pending' ? 'secondary' : 'destructive'
                    }>
                      {fee.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {fee.status !== 'paid' ? (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleMarkAsPaid(fee.id)}
                      >
                        Mark Paid
                      </Button>
                    ) : (
                      <div className="flex space-x-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewReceipt(fee)}
                        >
                          View Receipt
                        </Button>
                        <span className="text-sm text-green-600">
                          Paid on {fee.paymentDate && new Date(fee.paymentDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Receipt Dialog */}
      <Dialog open={!!selectedReceipt} onOpenChange={(open) => !open && setSelectedReceipt(null)}>
        <DialogContent className="max-w-2xl">
          {selectedReceipt && selectedReceipt.paymentDate && selectedReceipt.receiptNumber && (
            <ReceiptGenerator fee={{
              studentName: selectedReceipt.studentName,
              studentId: selectedReceipt.studentId,
              feeType: selectedReceipt.feeType,
              amount: selectedReceipt.amount,
              paymentDate: selectedReceipt.paymentDate,
              receiptNumber: selectedReceipt.receiptNumber
            }} />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeeManagement;
