import React from 'react';
import { Printer, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ReceiptGeneratorProps {
  fee: {
    studentName: string;
    studentId: string;
    feeType: string;
    amount: number;
    paymentDate?: string;
    receiptNumber: string;
  };
}

export const ReceiptGenerator = ({ fee }: ReceiptGeneratorProps) => {
  const handlePrint = () => {
    // In a real implementation, this would generate a printable receipt
    alert(`Printing receipt ${fee.receiptNumber} for ${fee.studentName}`);
  };

  const handleDownload = () => {
    // In a real implementation, this would download a PDF receipt
    alert(`Downloading receipt ${fee.receiptNumber} as PDF`);
  };

  return (
    <div className="border rounded-lg p-6 max-w-md mx-auto bg-white">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold">School Receipt</h2>
        <p className="text-sm text-gray-500">Receipt #{fee.receiptNumber}</p>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Student:</span>
          <span>{fee.studentName} ({fee.studentId})</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Fee Type:</span>
          <span>{fee.feeType}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Amount:</span>
          <span>${fee.amount.toFixed(2)}</span>
        </div>
        {fee.paymentDate && (
          <div className="flex justify-between">
            <span className="text-gray-600">Payment Date:</span>
            <span>{new Date(fee.paymentDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      <div className="mt-8 pt-4 border-t flex justify-center space-x-4">
        <Button onClick={handlePrint} className="gap-2">
          <Printer size={16} />
          Print Receipt
        </Button>
        <Button variant="outline" onClick={handleDownload} className="gap-2">
          <Download size={16} />
          Download PDF
        </Button>
      </div>
    </div>
  );
};