import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface ExamResultsProps {
  exam: {
    id: string;
    name: string;
    subject: string;
    class: string;
    maxMarks: number;
  };
  results: {
    studentId: string;
    studentName: string;
    marksObtained: number;
    grade: string;
  }[];
}

const ExamResults = ({ exam, results }: ExamResultsProps): JSX.Element => {
  // Prepare data for chart
  const gradeDistribution = results.reduce((acc, result) => {
    const existing = acc.find(item => item.grade === result.grade);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ grade: result.grade, count: 1 });
    }
    return acc;
  }, [] as { grade: string; count: number }[]);

  const averageScore = results.reduce((sum, r) => sum + r.marksObtained, 0) / results.length;
  const passRate = (results.filter(r => r.grade !== 'F').length / results.length) * 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore.toFixed(1)}/{exam.maxMarks}</div>
            <p className="text-xs text-muted-foreground">Class average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{passRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Students passing</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.max(...results.map(r => r.marksObtained))}/{exam.maxMarks}
            </div>
            <p className="text-xs text-muted-foreground">Highest marks</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grade Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gradeDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="grade" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Detailed Results</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Percentage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {results.map((result) => (
                <TableRow key={result.studentId}>
                  <TableCell className="font-medium">
                    {result.studentName} ({result.studentId})
                  </TableCell>
                  <TableCell>
                    {result.marksObtained}/{exam.maxMarks}
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{result.grade}</Badge>
                  </TableCell>
                  <TableCell>
                    {((result.marksObtained / exam.maxMarks) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExamResults;