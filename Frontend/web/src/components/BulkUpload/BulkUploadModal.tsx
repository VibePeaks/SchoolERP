import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
  Download,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityType: 'students' | 'teachers' | 'hostel';
  onUploadComplete: (results: UploadResults) => void;
}

interface UploadResults {
  success: number;
  errors: number;
  total: number;
  errorDetails: string[];
  data: any[];
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  entityType,
  onUploadComplete
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<UploadResults | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getEntityConfig = (type: string) => {
    switch (type) {
      case 'students':
        return {
          title: 'Student Bulk Upload',
          description: 'Upload student data from Excel/CSV file',
          templateUrl: '/templates/student-template.xlsx',
          requiredFields: ['FirstName', 'LastName', 'StudentId', 'Email', 'Class', 'RollNumber'],
          sampleData: [
            ['John', 'Doe', 'STU001', 'john.doe@school.com', 'Grade 10', '1', '2008-05-15', 'Male'],
            ['Jane', 'Smith', 'STU002', 'jane.smith@school.com', 'Grade 10', '2', '2008-08-22', 'Female']
          ]
        };
      case 'teachers':
        return {
          title: 'Teacher Bulk Upload',
          description: 'Upload teacher data from Excel/CSV file',
          templateUrl: '/templates/teacher-template.xlsx',
          requiredFields: ['FirstName', 'LastName', 'Email', 'EmployeeId', 'Subject', 'Phone'],
          sampleData: [
            ['Dr. Sarah', 'Johnson', 'sarah.johnson@school.com', 'TCH001', 'Mathematics', '+1234567890'],
            ['Mr. Michael', 'Rodriguez', 'michael.rodriguez@school.com', 'TCH002', 'English', '+1234567891']
          ]
        };
      case 'hostel':
        return {
          title: 'Hostel Bulk Upload',
          description: 'Upload hostel and room allocation data',
          templateUrl: '/templates/hostel-template.xlsx',
          requiredFields: ['HostelName', 'RoomNumber', 'StudentId', 'CheckInDate'],
          sampleData: [
            ['Boys Hostel A', '101', 'STU001', '2024-08-15'],
            ['Girls Hostel B', '205', 'STU002', '2024-08-15']
          ]
        };
      default:
        return null;
    }
  };

  const config = getEntityConfig(entityType);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'text/csv'
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        setErrors(['Please select a valid Excel (.xlsx) or CSV (.csv) file']);
        return;
      }

      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setErrors(['File size must be less than 10MB']);
        return;
      }

      setFile(selectedFile);
      setErrors([]);
      setResults(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setErrors([]);

    try {
      // Simulate file parsing and validation
      setProgress(20);

      // Parse Excel/CSV file (in real implementation, use a library like xlsx or papaparse)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('entityType', entityType);

      // Simulate API call
      setProgress(50);

      // Validate data structure
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(75);

      // Process and save data
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(100);

      // Mock results (in real implementation, this would come from API)
      const mockResults: UploadResults = {
        success: 85,
        errors: 5,
        total: 90,
        errorDetails: [
          'Row 12: Invalid email format',
          'Row 25: Missing required field "StudentId"',
          'Row 34: Duplicate StudentId found',
          'Row 67: Invalid date format',
          'Row 89: Class not found in system'
        ],
        data: []
      };

      setResults(mockResults);
      onUploadComplete(mockResults);

    } catch (error: any) {
      setErrors([error.message || 'Upload failed. Please try again.']);
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // In real implementation, this would download the actual template file
    const link = document.createElement('a');
    link.href = config?.templateUrl || '#';
    link.download = `${entityType}-template.xlsx`;
    link.click();
  };

  const resetUpload = () => {
    setFile(null);
    setResults(null);
    setErrors([]);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">{config?.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{config?.description}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Template Download */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-blue-900">Download Template</h4>
                <p className="text-blue-700 text-sm mt-1">
                  Use our Excel template to ensure your data is formatted correctly.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadTemplate}
                  className="mt-2 border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </div>
          </div>

          {/* Required Fields */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Required Fields</h4>
            <div className="flex flex-wrap gap-2">
              {config?.requiredFields.map((field) => (
                <Badge key={field} variant="secondary">{field}</Badge>
              ))}
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                className="hidden"
              />

              {file ? (
                <div className="space-y-3">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    Choose Different File
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <div>
                    <p className="font-medium text-gray-900">Drop your file here, or click to browse</p>
                    <p className="text-sm text-gray-500">Excel (.xlsx, .xls) or CSV files up to 10MB</p>
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    Choose File
                  </Button>
                </div>
              )}
            </div>

            {/* Upload Progress */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading and processing...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Errors */}
            {errors.length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <ul className="list-disc list-inside space-y-1">
                    {errors.map((error, index) => (
                      <li key={index} className="text-red-800">{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Results */}
            {results && (
              <div className="space-y-4">
                <Alert className={`border-green-200 bg-green-50`}>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    <div className="font-medium text-green-900">
                      Upload completed! {results.success} of {results.total} records imported successfully.
                    </div>
                    {results.errors > 0 && (
                      <div className="text-green-800 mt-2">
                        {results.errors} records had errors and were skipped.
                      </div>
                    )}
                  </AlertDescription>
                </Alert>

                {results.errorDetails.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-yellow-900">Import Errors</h4>
                        <ul className="text-yellow-800 text-sm mt-2 space-y-1">
                          {results.errorDetails.slice(0, 5).map((error, index) => (
                            <li key={index}>• {error}</li>
                          ))}
                          {results.errorDetails.length > 5 && (
                            <li>• ... and {results.errorDetails.length - 5} more errors</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <div className="flex space-x-2">
              {results && (
                <Button variant="outline" onClick={resetUpload}>
                  Upload Another File
                </Button>
              )}

              {!results && file && !uploading && (
                <Button onClick={handleUpload} className="bg-gradient-to-r from-blue-600 to-purple-600">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload & Import
                </Button>
              )}

              {results && (
                <Button onClick={onClose} className="bg-gradient-to-r from-green-600 to-blue-600">
                  Done
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkUploadModal;
