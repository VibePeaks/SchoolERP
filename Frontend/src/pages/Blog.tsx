import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Calendar,
  User,
  ArrowLeft,
  Clock,
  Tag,
  Search,
  TrendingUp,
  BookOpen,
  Users,
  Lightbulb,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

const Blog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Posts', count: 24 },
    { id: 'edtech', name: 'EdTech Trends', count: 8 },
    { id: 'administration', name: 'School Administration', count: 6 },
    { id: 'teaching', name: 'Teaching Strategies', count: 5 },
    { id: 'case-studies', name: 'Case Studies', count: 3 },
    { id: 'insights', name: 'Industry Insights', count: 2 }
  ];

  const featuredPost = {
    id: 'future-edtech-2025',
    title: 'The Future of Education Technology: 2025 and Beyond',
    excerpt: 'Explore the transformative trends shaping the future of education, from AI-powered learning to immersive virtual classrooms.',
    author: 'Dr. Sarah Chen',
    date: '2025-01-15',
    readTime: '8 min read',
    category: 'EdTech Trends',
    image: '/api/placeholder/600/300',
    featured: true
  };

  const posts = [
    {
      id: 'ai-personalized-learning',
      title: 'How AI is Revolutionizing Personalized Learning',
      excerpt: 'Discover how artificial intelligence is creating customized learning experiences for every student.',
      author: 'Michael Rodriguez',
      date: '2025-01-10',
      readTime: '6 min read',
      category: 'EdTech Trends',
      tags: ['AI', 'Personalization', 'Adaptive Learning']
    },
    {
      id: 'school-admin-efficiency',
      title: 'Streamlining School Administration: A Complete Guide',
      excerpt: 'Learn how modern ERP systems can reduce administrative workload by up to 60%.',
      author: 'Emily Watson',
      date: '2025-01-08',
      readTime: '10 min read',
      category: 'School Administration',
      tags: ['Efficiency', 'Automation', 'Workflow']
    },
    {
      id: 'parent-teacher-communication',
      title: 'Building Strong Parent-Teacher Partnerships in the Digital Age',
      excerpt: 'Effective communication strategies for fostering collaboration between parents and educators.',
      author: 'Dr. James Park',
      date: '2025-01-05',
      readTime: '7 min read',
      category: 'Teaching Strategies',
      tags: ['Communication', 'Parent Engagement', 'Collaboration']
    },
    {
      id: 'lincoln-high-case-study',
      title: 'Lincoln High School: Transforming Operations with ERP',
      excerpt: 'How a 2000-student school reduced administrative costs by 40% with modern technology.',
      author: 'Case Study Team',
      date: '2025-01-03',
      readTime: '12 min read',
      category: 'Case Studies',
      tags: ['Success Story', 'ROI', 'Implementation']
    },
    {
      id: 'data-driven-decisions',
      title: 'Making Data-Driven Decisions in Education',
      excerpt: 'How schools can leverage analytics to improve student outcomes and operational efficiency.',
      author: 'Dr. Lisa Thompson',
      date: '2024-12-28',
      readTime: '9 min read',
      category: 'Industry Insights',
      tags: ['Analytics', 'Decision Making', 'Performance']
    },
    {
      id: 'remote-learning-best-practices',
      title: 'Best Practices for Hybrid and Remote Learning',
      excerpt: 'Essential strategies for maintaining educational quality in diverse learning environments.',
      author: 'Prof. David Kim',
      date: '2024-12-20',
      readTime: '11 min read',
      category: 'Teaching Strategies',
      tags: ['Hybrid Learning', 'Remote Education', 'Best Practices']
    }
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category.toLowerCase().replace(' ', '-') === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'EdTech Trends': return 'bg-blue-100 text-blue-800';
      case 'School Administration': return 'bg-green-100 text-green-800';
      case 'Teaching Strategies': return 'bg-purple-100 text-purple-800';
      case 'Case Studies': return 'bg-orange-100 text-orange-800';
      case 'Industry Insights': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">VibePeaks ERP</span>
            </div>
            <div className="flex items-center space-x-6">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button onClick={() => navigate('/login')} className="bg-gradient-to-r from-blue-600 to-purple-600">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Insights & Perspectives on
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Education Technology
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stay informed with the latest trends, best practices, and success stories
            from the world of education technology and school management.
          </p>
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <Card className="overflow-hidden hover:shadow-2xl transition-shadow">
            <div className="md:flex">
              <div className="md:w-1/2">
                <div className="h-64 md:h-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <BookOpen className="w-24 h-24 text-white opacity-80" />
                </div>
              </div>
              <div className="md:w-1/2 p-8">
                <Badge className={`${getCategoryColor(featuredPost.category)} mb-4`}>
                  {featuredPost.category}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {featuredPost.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(featuredPost.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                  Read Full Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 py-3 text-lg"
                />
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.name} ({category.count})
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow group cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-3">
                  <Badge className={getCategoryColor(post.category)}>
                    {post.category}
                  </Badge>
                </div>
                <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {post.readTime}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {post.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 p-0">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>

                <div className="text-xs text-gray-400 mt-3">
                  {new Date(post.date).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8 text-center">
              <TrendingUp className="w-16 h-16 mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl font-bold mb-4">Stay Ahead of the Curve</h2>
              <p className="text-xl mb-6 opacity-90 max-w-2xl mx-auto">
                Get the latest insights on education technology, school management best practices,
                and industry trends delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Input
                  placeholder="Enter your email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
                />
                <Button className="bg-white text-blue-600 hover:bg-gray-50 whitespace-nowrap">
                  Subscribe Now
                </Button>
              </div>
              <p className="text-sm opacity-75 mt-4">
                Join 10,000+ education professionals. Unsubscribe anytime.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Popular Topics */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Popular Topics</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="text-center hover:shadow-lg transition-shadow group cursor-pointer">
              <CardContent className="pt-8 pb-6">
                <Lightbulb className="w-12 h-12 text-yellow-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">AI & Machine Learning</h3>
                <p className="text-gray-600 text-sm">How AI is transforming personalized learning</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow group cursor-pointer">
              <CardContent className="pt-8 pb-6">
                <Users className="w-12 h-12 text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">Digital Transformation</h3>
                <p className="text-gray-600 text-sm">Modernizing school operations</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow group cursor-pointer">
              <CardContent className="pt-8 pb-6">
                <BookOpen className="w-12 h-12 text-green-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">Curriculum Innovation</h3>
                <p className="text-gray-600 text-sm">Next-generation teaching methods</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow group cursor-pointer">
              <CardContent className="pt-8 pb-6">
                <TrendingUp className="w-12 h-12 text-purple-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold mb-2">Data Analytics</h3>
                <p className="text-gray-600 text-sm">Making informed decisions</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <GraduationCap className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your School?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of schools already using our platform to streamline operations
            and improve educational outcomes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/contact')}
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
