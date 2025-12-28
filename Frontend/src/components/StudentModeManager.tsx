import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Lock,
  Eye,
  EyeOff,
  Settings,
  CheckCircle,
  XCircle,
  Clock,
  User
} from 'lucide-react';
import { useMutation } from '@/hooks/useApi';
import { toast } from 'sonner';

interface StudentModeManagerProps {
  student: {
    id: number;
    firstName: string;
    lastName: string;
    rollNumber: string;
    class: string;
    section: string;
    isStudentModeEnabled?: boolean;
    studentModeLastAccess?: string;
    studentModeAccessCount?: number;
  };
  parentId: number;
  onStudentModeToggle?: () => void;
  onEnterStudentMode?: (studentId: number) => void;
}

interface StudentModeValidationData {
  studentSessionToken: string;
  student: {
    id: number;
    firstName: string;
    lastName: string;
    rollNumber: string;
    class: string;
    section: string;
  };
  session: {
    expiresIn: number;
    lastAccess: string;
    accessCount: number;
  };
}

const StudentModeManager: React.FC<StudentModeManagerProps> = ({
  student,
  parentId,
  onStudentModeToggle,
  onEnterStudentMode,
}) => {
  const navigate = useNavigate();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [passkey, setPasskey] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);
  const [newPasskey, setNewPasskey] = useState('');
  const [showNewPasskey, setShowNewPasskey] = useState(false);
  const [isSettingPasskey, setIsSettingPasskey] = useState(false);

  // Validate student passkey and enter student mode
  const validatePasskeyMutation = useMutation(
    async () => {
      const response = await fetch(`/api/parents/${parentId}/student-mode/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: student.id,
          passkey: passkey,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Invalid passkey');
      }

      return response.json();
    },
    {
      onSuccess: (data: StudentModeValidationData) => {
        toast.success('Student Mode access granted!');
        setIsDialogOpen(false);
        setPasskey('');

        // Navigate to student dashboard with session data
        navigate('/student-dashboard', {
          state: {
            parentId,
            studentId: student.id,
            sessionToken: data.studentSessionToken,
          },
        });

        if (onEnterStudentMode) {
          onEnterStudentMode(student.id);
        }
      },
      onError: (error: any) => {
        toast.error(error.message || 'Invalid passkey');
      },
    }
  );

  // Set/change student passkey
  const setPasskeyMutation = useMutation(
    async () => {
      const response = await fetch(`/api/parents/${parentId}/student-mode/${student.id}/passkey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passkey: newPasskey,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to set passkey');
      }

      return response.json();
    },
    {
      onSuccess: () => {
        toast.success('Student passkey set successfully!');
        setNewPasskey('');
        setIsSettingPasskey(false);
        if (onStudentModeToggle) {
          onStudentModeToggle();
        }
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to set passkey');
      },
    }
  );

  // Toggle student mode on/off
  const toggleStudentModeMutation = useMutation(
    async (enabled: boolean) => {
      const response = await fetch(`/api/parents/${parentId}/student-mode/${student.id}/toggle`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          enabled,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle student mode');
      }

      return response.json();
    },
    {
      onSuccess: (data) => {
        toast.success(`Student Mode ${data.data.studentModeEnabled ? 'enabled' : 'disabled'} successfully!`);
        if (onStudentModeToggle) {
          onStudentModeToggle();
        }
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to toggle student mode');
      },
    }
  );

  const handleValidatePasskey = () => {
    if (!passkey.trim()) {
      toast.error('Please enter your passkey');
      return;
    }

    if (passkey.length < 4 || passkey.length > 8) {
      toast.error('Passkey must be 4-8 characters long');
      return;
    }

    validatePasskeyMutation.mutate();
  };

  const handleSetPasskey = () => {
    if (!newPasskey.trim()) {
      toast.error('Please enter a passkey');
      return;
    }

    if (newPasskey.length < 4 || newPasskey.length > 8) {
      toast.error('Passkey must be 4-8 characters long');
      return;
    }

    setPasskeyMutation.mutate();
  };

  const handleToggleStudentMode = (enabled: boolean) => {
    toggleStudentModeMutation.mutate(enabled);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setPasskey('');
    setIsSettingPasskey(false);
    setNewPasskey('');
  };

  const formatLastAccess = (dateString?: string) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString() + ' ' +
           new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant={student.isStudentModeEnabled ? "default" : "outline"}
          size="sm"
          className="w-full"
        >
          {student.isStudentModeEnabled ? (
            <>
              <Lock className="w-4 h-4 mr-2" />
              Enter Student Mode
            </>
          ) : (
            <>
              <Settings className="w-4 h-4 mr-2" />
              Setup Student Mode
            </>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <User className="w-5 h-5 mr-2" />
            Student Mode - {student.firstName} {student.lastName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Student Info */}
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{student.firstName} {student.lastName}</p>
                  <p className="text-sm text-gray-600">
                    {student.class} - {student.section} | Roll: {student.rollNumber}
                  </p>
                </div>
                <Badge variant={student.isStudentModeEnabled ? "default" : "secondary"}>
                  {student.isStudentModeEnabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>

              {student.isStudentModeEnabled && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last Access:</span>
                    <span>{formatLastAccess(student.studentModeLastAccess)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Access Count:</span>
                    <span>{student.studentModeAccessCount || 0} times</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Student Mode Controls */}
          <div className="space-y-3">
            {/* Toggle Student Mode */}
            <div className="flex items-center justify-between">
              <Label htmlFor="student-mode">Student Mode</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleToggleStudentMode(!student.isStudentModeEnabled)}
                disabled={toggleStudentModeMutation.loading}
              >
                {student.isStudentModeEnabled ? (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Disable
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Enable
                  </>
                )}
              </Button>
            </div>

            {/* Set/Change Passkey */}
            {student.isStudentModeEnabled && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Student Passkey</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsSettingPasskey(!isSettingPasskey)}
                  >
                    {isSettingPasskey ? 'Cancel' : 'Change'}
                  </Button>
                </div>

                {isSettingPasskey ? (
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        type={showNewPasskey ? "text" : "password"}
                        placeholder="Enter new passkey (4-8 chars)"
                        value={newPasskey}
                        onChange={(e) => setNewPasskey(e.target.value)}
                        maxLength={8}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowNewPasskey(!showNewPasskey)}
                      >
                        {showNewPasskey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <Button
                      onClick={handleSetPasskey}
                      disabled={setPasskeyMutation.loading || !newPasskey.trim()}
                      className="w-full"
                    >
                      {setPasskeyMutation.loading ? 'Setting...' : 'Set Passkey'}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Lock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-600">
                      Student passkey is set and secured
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Enter Student Mode */}
            {student.isStudentModeEnabled && !isSettingPasskey && (
              <div className="space-y-2">
                <Label>Enter Student Mode</Label>
                <div className="relative">
                  <Input
                    type={showPasskey ? "text" : "password"}
                    placeholder="Enter student passkey"
                    value={passkey}
                    onChange={(e) => setPasskey(e.target.value)}
                    maxLength={8}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPasskey(!showPasskey)}
                  >
                    {showPasskey ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <Button
                  onClick={handleValidatePasskey}
                  disabled={validatePasskeyMutation.loading || !passkey.trim()}
                  className="w-full"
                >
                  {validatePasskeyMutation.loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Entering...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Enter Student World
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
            <p className="font-medium mb-1">About Student Mode:</p>
            <p>• Students can view their grades, assignments, and schedule</p>
            <p>• Parents maintain full control and can monitor access</p>
            <p>• All activities are logged for safety</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StudentModeManager;
