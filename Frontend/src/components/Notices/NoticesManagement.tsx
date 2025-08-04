
import React, { useState } from 'react';
import { Bell, Plus, Eye, Edit, Trash2, Send, Users, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'academic' | 'event' | 'holiday' | 'fee' | 'exam' | 'urgent';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: 'all' | 'students' | 'parents' | 'teachers' | 'staff';
  author: string;
  createdDate: string;
  publishDate: string;
  expiryDate?: string;
  status: 'draft' | 'published' | 'expired' | 'archived';
  viewCount: number;
  isPinned: boolean;
  attachments?: string[];
}

const NoticesManagement = () => {
  const [isCreateNoticeOpen, setIsCreateNoticeOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const mockNotices: Notice[] = [
    {
      id: '1',
      title: 'Parent-Teacher Meeting - January 2024',
      content: 'Dear Parents, we are pleased to inform you that the Parent-Teacher Meeting for the current academic session will be held on January 20th, 2024, from 10:00 AM to 4:00 PM. Please make sure to attend and discuss your child\'s progress with respective teachers.',
      category: 'event',
      priority: 'high',
      targetAudience: 'parents',
      author: 'Dr. Rajesh Kumar (Principal)',
      createdDate: '2024-01-10',
      publishDate: '2024-01-10',
      expiryDate: '2024-01-25',
      status: 'published',
      viewCount: 245,
      isPinned: true,
      attachments: ['ptm_schedule.pdf']
    },
    {
      id: '2',
      title: 'Mid-term Examination Schedule',
      content: 'The mid-term examinations for all classes will commence from February 1st, 2024. Please find the detailed schedule attached. Students are advised to prepare accordingly.',
      category: 'exam',
      priority: 'urgent',
      targetAudience: 'all',
      author: 'Academic Department',
      createdDate: '2024-01-12',
      publishDate: '2024-01-15',
      expiryDate: '2024-02-15',
      status: 'published',
      viewCount: 189,
      isPinned: true,
      attachments: ['exam_schedule.pdf', 'exam_guidelines.pdf']
    },
    {
      id: '3',
      title: 'Annual Sports Day - Registration Open',
      content: 'We are excited to announce our Annual Sports Day scheduled for February 25th, 2024. Registration is now open for all sports events. Please contact the sports department for more details.',
      category: 'event',
      priority: 'medium',
      targetAudience: 'students',
      author: 'Sports Department',
      createdDate: '2024-01-08',
      publishDate: '2024-01-08',
      expiryDate: '2024-02-20',
      status: 'published',
      viewCount: 156,
      isPinned: false
    },
    {
      id: '4',
      title: 'Fee Payment Deadline Extension',
      content: 'Due to technical issues with the payment gateway, the fee payment deadline has been extended to January 30th, 2024. We apologize for any inconvenience caused.',
      category: 'fee',
      priority: 'high',
      targetAudience: 'parents',
      author: 'Finance Department',
      createdDate: '2024-01-14',
      publishDate: '2024-01-14',
      status: 'published',
      viewCount: 198,
      isPinned: false
    },
    {
      id: '5',
      title: 'New Library Rules and Regulations',
      content: 'Please note the updated library rules effective from January 20th, 2024. All students and staff are requested to follow these guidelines.',
      category: 'general',
      priority: 'low',
      targetAudience: 'all',
      author: 'Library Department',
      createdDate: '2024-01-05',
      publishDate: '2024-01-15',
      status: 'draft',
      viewCount: 0,
      isPinned: false
    }
  ];

  const [notices, setNotices] = useState<Notice[]>(mockNotices);

  const categories = [
    { value: 'general', label: 'General' },
    { value: 'academic', label: 'Academic' },
    { value: 'event', label: 'Event' },
    { value: 'holiday', label: 'Holiday' },
    { value: 'fee', label: 'Fee' },
    { value: 'exam', label: 'Examination' },
    { value: 'urgent', label: 'Urgent' }
  ];

  const targetAudiences = [
    { value: 'all', label: 'All' },
    { value: 'students', label: 'Students' },
    { value: 'parents', label: 'Parents' },
    { value: 'teachers', label: 'Teachers' },
    { value: 'staff', label: 'Staff' }
  ];

  const filteredNotices = notices.filter(notice => {
    const matchesCategory = filterCategory === 'all' || notice.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || notice.status === filterStatus;
    return matchesCategory && matchesStatus;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'exam': return 'bg-purple-100 text-purple-800';
      case 'event': return 'bg-blue-100 text-blue-800';
      case 'fee': return 'bg-yellow-100 text-yellow-800';
      case 'academic': return 'bg-green-100 text-green-800';
      case 'holiday': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'all': return '👥';
      case 'students': return '🎓';
      case 'parents': return '👨‍👩‍👧‍👦';
      case 'teachers': return '👨‍🏫';
      case 'staff': return '👷';
      default: return '👥';
    }
  };

  const publishedNotices = notices.filter(n => n.status === 'published').length;
  const draftNotices = notices.filter(n => n.status === 'draft').length;
  const totalViews = notices.reduce((sum, notice) => sum + notice.viewCount, 0);
  const pinnedNotices = notices.filter(n => n.isPinned).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notice Board Management</h1>
          <p className="text-gray-600 mt-2">Create, manage and publish school announcements</p>
        </div>
        <Dialog open={isCreateNoticeOpen} onOpenChange={setIsCreateNoticeOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={20} className="mr-2" />
              Create Notice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Notice</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
              <div className="grid gap-2">
                <Label htmlFor="title">Notice Title</Label>
                <Input id="title" placeholder="Enter notice title" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="audience">Target Audience</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select target audience" />
                  </SelectTrigger>
                  <SelectContent>
                    {targetAudiences.map(aud => (
                      <SelectItem key={aud.value} value={aud.value}>{aud.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="content">Notice Content</Label>
                <Textarea id="content" placeholder="Enter notice content" rows={5} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="publishDate">Publish Date</Label>
                  <Input id="publishDate" type="date" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="expiryDate">Expiry Date (Optional)</Label>
                  <Input id="expiryDate" type="date" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="pinned" />
                <Label htmlFor="pinned">Pin this notice</Label>
              </div>

              <div className="flex space-x-2">
                <Button className="flex-1">Save as Draft</Button>
                <Button className="flex-1">Publish Notice</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Bell className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Notices</p>
                <p className="text-2xl font-bold text-gray-900">{notices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Published</p>
                <p className="text-2xl font-bold text-gray-900">{publishedNotices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Edit className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-900">{draftNotices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Eye className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">{totalViews}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All Notices</TabsTrigger>
            <TabsTrigger value="pinned">Pinned</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
          </TabsList>
          
          <div className="flex space-x-2">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="space-y-4">
            {filteredNotices.map((notice) => (
              <Card key={notice.id} className={notice.isPinned ? 'border-blue-300 bg-blue-50' : ''}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {notice.isPinned && <AlertCircle size={16} className="text-blue-600" />}
                        <h3 className="text-lg font-semibold">{notice.title}</h3>
                      </div>
                      <p className="text-gray-600 mb-3 line-clamp-2">{notice.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>By {notice.author}</span>
                        <span>•</span>
                        <span>{new Date(notice.createdDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="flex items-center">
                          <Eye size={14} className="mr-1" />
                          {notice.viewCount} views
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex space-x-2">
                        <Badge className={getCategoryColor(notice.category)}>
                          {notice.category}
                        </Badge>
                        <Badge className={getPriorityColor(notice.priority)}>
                          {notice.priority}
                        </Badge>
                        <Badge className={getStatusColor(notice.status)}>
                          {notice.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <span>{getAudienceIcon(notice.targetAudience)}</span>
                        <span className="text-gray-500">{notice.targetAudience}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {notice.attachments && notice.attachments.length > 0 && (
                        <Badge variant="outline" className="text-xs">
                          📎 {notice.attachments.length} attachment{notice.attachments.length > 1 ? 's' : ''}
                        </Badge>
                      )}
                      {notice.expiryDate && (
                        <Badge variant="outline" className="text-xs">
                          ⏰ Expires {new Date(notice.expiryDate).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye size={16} className="mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit size={16} className="mr-1" />
                        Edit
                      </Button>
                      {notice.status === 'draft' && (
                        <Button size="sm">
                          <Send size={16} className="mr-1" />
                          Publish
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pinned" className="space-y-4">
          <div className="space-y-4">
            {filteredNotices.filter(notice => notice.isPinned).map((notice) => (
              <Card key={notice.id} className="border-blue-300 bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle size={16} className="text-blue-600" />
                    <h3 className="text-lg font-semibold">{notice.title}</h3>
                    <Badge className={getPriorityColor(notice.priority)}>
                      {notice.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{notice.content}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>By {notice.author}</span>
                      <span>•</span>
                      <span>{new Date(notice.createdDate).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{notice.viewCount} views</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">View</Button>
                      <Button size="sm" variant="outline">Edit</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <div className="space-y-4">
            {filteredNotices.filter(notice => notice.status === 'published').map((notice) => (
              <Card key={notice.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{notice.title}</h3>
                      <p className="text-gray-600 mb-3">{notice.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Published: {new Date(notice.publishDate).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{notice.viewCount} views</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className={getCategoryColor(notice.category)}>
                        {notice.category}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800">
                        published
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <div className="space-y-4">
            {filteredNotices.filter(notice => notice.status === 'draft').map((notice) => (
              <Card key={notice.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{notice.title}</h3>
                      <p className="text-gray-600 mb-3">{notice.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Created: {new Date(notice.createdDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Badge className="bg-yellow-100 text-yellow-800">
                        draft
                      </Badge>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Edit</Button>
                    <Button size="sm">
                      <Send size={16} className="mr-1" />
                      Publish
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NoticesManagement;
