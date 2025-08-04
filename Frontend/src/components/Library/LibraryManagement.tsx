
import React, { useState } from 'react';
import { Library, BookOpen, Search, Plus, User, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  publisher: string;
  publishYear: number;
  totalCopies: number;
  availableCopies: number;
  location: string;
  status: 'available' | 'borrowed' | 'reserved' | 'maintenance';
}

interface BorrowRecord {
  id: string;
  bookId: string;
  bookTitle: string;
  studentName: string;
  studentId: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'borrowed' | 'returned' | 'overdue';
  fineAmount?: number;
}

const LibraryManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  const [isIssueBookOpen, setIsIssueBookOpen] = useState(false);

  const mockBooks: Book[] = [
    {
      id: '1',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      isbn: '978-0-06-112008-4',
      category: 'Fiction',
      publisher: 'HarperCollins',
      publishYear: 1960,
      totalCopies: 5,
      availableCopies: 3,
      location: 'Section A - Shelf 1',
      status: 'available'
    },
    {
      id: '2',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      isbn: '978-0-7432-7356-5',
      category: 'Fiction',
      publisher: 'Scribner',
      publishYear: 1925,
      totalCopies: 4,
      availableCopies: 0,
      location: 'Section A - Shelf 2',
      status: 'borrowed'
    },
    {
      id: '3',
      title: 'A Brief History of Time',
      author: 'Stephen Hawking',
      isbn: '978-0-553-38016-3',
      category: 'Science',
      publisher: 'Bantam Books',
      publishYear: 1988,
      totalCopies: 3,
      availableCopies: 2,
      location: 'Section C - Shelf 5',
      status: 'available'
    },
    {
      id: '4',
      title: 'NCERT Mathematics Class X',
      author: 'NCERT',
      isbn: '978-81-7450-649-1',
      category: 'Textbook',
      publisher: 'NCERT',
      publishYear: 2023,
      totalCopies: 25,
      availableCopies: 18,
      location: 'Section T - Shelf 1',
      status: 'available'
    }
  ];

  const mockBorrowRecords: BorrowRecord[] = [
    {
      id: '1',
      bookId: '2',
      bookTitle: 'The Great Gatsby',
      studentName: 'Arjun Sharma',
      studentId: 'STU001',
      borrowDate: '2024-01-01',
      dueDate: '2024-01-15',
      status: 'overdue',
      fineAmount: 20
    },
    {
      id: '2',
      bookId: '1',
      bookTitle: 'To Kill a Mockingbird',
      studentName: 'Priya Patel',
      studentId: 'STU002',
      borrowDate: '2024-01-10',
      dueDate: '2024-01-24',
      status: 'borrowed'
    },
    {
      id: '3',
      bookId: '3',
      bookTitle: 'A Brief History of Time',
      studentName: 'Rohit Kumar',
      studentId: 'STU003',
      borrowDate: '2023-12-20',
      dueDate: '2024-01-03',
      returnDate: '2024-01-02',
      status: 'returned'
    }
  ];

  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>(mockBorrowRecords);

  const categories = ['Fiction', 'Non-Fiction', 'Science', 'Mathematics', 'History', 'Biography', 'Textbook', 'Reference'];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.isbn.includes(searchTerm);
    const matchesCategory = filterCategory === 'all' || book.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const overdueBooks = borrowRecords.filter(record => record.status === 'overdue');
  const currentlyBorrowed = borrowRecords.filter(record => record.status === 'borrowed').length;
  const totalFines = borrowRecords.reduce((sum, record) => sum + (record.fineAmount || 0), 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'borrowed': return 'bg-blue-100 text-blue-800';
      case 'reserved': return 'bg-yellow-100 text-yellow-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateFine = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * 2 : 0; // ₹2 per day fine
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library Management</h1>
          <p className="text-gray-600 mt-2">Manage books, track borrowing, and handle returns</p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={isAddBookOpen} onOpenChange={setIsAddBookOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus size={20} className="mr-2" />
                Add Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Book</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Book Title</Label>
                  <Input id="title" placeholder="Enter book title" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="author">Author</Label>
                  <Input id="author" placeholder="Enter author name" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="isbn">ISBN</Label>
                  <Input id="isbn" placeholder="Enter ISBN" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="copies">Total Copies</Label>
                    <Input id="copies" type="number" placeholder="0" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="year">Publish Year</Label>
                    <Input id="year" type="number" placeholder="2024" />
                  </div>
                </div>
                <Button className="w-full">Add Book</Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isIssueBookOpen} onOpenChange={setIsIssueBookOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <User size={20} className="mr-2" />
                Issue Book
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Issue Book to Student</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="studentId">Student ID</Label>
                  <Input id="studentId" placeholder="Enter student ID" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bookSearch">Search Book</Label>
                  <Input id="bookSearch" placeholder="Search by title or ISBN" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" type="date" />
                </div>
                <Button className="w-full">Issue Book</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">{books.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Currently Borrowed</p>
                <p className="text-2xl font-bold text-gray-900">{currentlyBorrowed}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Books</p>
                <p className="text-2xl font-bold text-gray-900">{overdueBooks.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Fines</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalFines}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {overdueBooks.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-800">
              <AlertCircle size={20} className="mr-2" />
              Overdue Books Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueBooks.map(record => (
                <div key={record.id} className="flex justify-between items-center text-sm">
                  <span className="font-medium">{record.bookTitle} - {record.studentName}</span>
                  <span className="text-red-600">
                    Fine: ₹{record.fineAmount} (Due: {new Date(record.dueDate).toLocaleDateString()})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="books" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="books">Book Catalog</TabsTrigger>
          <TabsTrigger value="borrowed">Borrowed Books</TabsTrigger>
          <TabsTrigger value="history">Borrow History</TabsTrigger>
        </TabsList>

        <TabsContent value="books" className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search size={20} className="absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="Search books by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <Card key={book.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{book.title}</CardTitle>
                  <p className="text-sm text-gray-600">by {book.author}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">{book.category}</Badge>
                    <Badge className={getStatusColor(book.status)}>
                      {book.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">ISBN:</span>
                      <span>{book.isbn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Available:</span>
                      <span>{book.availableCopies}/{book.totalCopies}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Location:</span>
                      <span className="text-right">{book.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Published:</span>
                      <span>{book.publishYear}</span>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      className="w-full" 
                      size="sm"
                      disabled={book.availableCopies === 0}
                    >
                      {book.availableCopies > 0 ? 'Issue Book' : 'Not Available'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="borrowed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Currently Borrowed Books</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {borrowRecords.filter(record => record.status === 'borrowed' || record.status === 'overdue').map((record) => (
                  <div key={record.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{record.bookTitle}</h3>
                      <p className="text-sm text-gray-600">Student: {record.studentName} ({record.studentId})</p>
                      <p className="text-sm text-gray-500">
                        Borrowed: {new Date(record.borrowDate).toLocaleDateString()} | 
                        Due: {new Date(record.dueDate).toLocaleDateString()}
                      </p>
                      {record.status === 'overdue' && (
                        <p className="text-sm text-red-600 font-medium">
                          Fine: ₹{record.fineAmount}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Badge className={getStatusColor(record.status)}>
                        {record.status}
                      </Badge>
                      <Button size="sm">Return Book</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Borrowing History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {borrowRecords.map((record) => (
                  <div key={record.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{record.bookTitle}</h3>
                      <p className="text-sm text-gray-600">Student: {record.studentName} ({record.studentId})</p>
                      <p className="text-sm text-gray-500">
                        Borrowed: {new Date(record.borrowDate).toLocaleDateString()} | 
                        Due: {new Date(record.dueDate).toLocaleDateString()}
                        {record.returnDate && ` | Returned: ${new Date(record.returnDate).toLocaleDateString()}`}
                      </p>
                      {record.fineAmount && record.fineAmount > 0 && (
                        <p className="text-sm text-red-600">Fine Paid: ₹{record.fineAmount}</p>
                      )}
                    </div>
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LibraryManagement;
