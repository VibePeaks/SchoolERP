import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Award,
  Target,
  Heart,
  Lightbulb,
  TrendingUp,
  Globe,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const navigate = useNavigate();

  const values = [
    {
      icon: Target,
      title: "Innovation",
      description: "We continuously evolve our platform with cutting-edge technology to meet the changing needs of modern education."
    },
    {
      icon: Heart,
      title: "Student-Centric",
      description: "Every feature we build is designed with students' success and well-being at the forefront of our decisions."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in the power of partnership between schools, teachers, parents, and administrators."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in everything we do, from code quality to customer support."
    }
  ];

  const milestones = [
    { year: "2020", event: "VibePeaks founded with a vision to transform education" },
    { year: "2021", event: "First 100 schools onboarded to our platform" },
    { year: "2022", event: "Expanded to 500+ schools across 15 countries" },
    { year: "2023", event: "Launched AI-powered analytics and predictive insights" },
    { year: "2024", event: "Reached 2000+ schools with multi-tenant SaaS architecture" },
    { year: "2025", event: "Leading provider of cloud-based school management solutions" }
  ];

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
            Transforming Education
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              One School at a Time
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            VibePeaks was founded with a simple mission: to empower educational institutions
            with technology that enhances learning, simplifies administration, and creates
            better outcomes for students, teachers, and parents.
          </p>
        </div>

        {/* Our Story */}
        <div className="mb-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2020, VibePeaks emerged from the collective frustration of
                  educators and administrators struggling with outdated school management systems.
                  We saw firsthand how disconnected tools and manual processes were hindering
                  educational excellence.
                </p>
                <p>
                  Our team of educators, developers, and education technology experts came
                  together to build something different – a comprehensive, cloud-based platform
                  that understands the unique needs of modern schools.
                </p>
                <p>
                  Today, we're proud to serve over 2,000 schools worldwide, helping them
                  streamline operations, improve student outcomes, and focus on what matters most:
                  education and student success.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">2000+</div>
                    <div className="text-blue-100">Schools Served</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">500K+</div>
                    <div className="text-blue-100">Students Managed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">50K+</div>
                    <div className="text-blue-100">Teachers Empowered</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">15+</div>
                    <div className="text-blue-100">Countries</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">Key milestones in our mission to transform education</p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-blue-600 to-purple-600"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                      <p className="text-gray-600">{milestone.event}</p>
                    </div>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full border-4 border-white shadow"></div>
                  <div className="w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Leadership Team</h2>
            <p className="text-lg text-gray-600">Meet the visionaries driving educational innovation</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sarah Chen</h3>
                <p className="text-blue-600 font-medium mb-3">CEO & Co-Founder</p>
                <p className="text-gray-600 text-sm">Former school principal with 15+ years in education technology</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-green-600 to-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Lightbulb className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Dr. Michael Rodriguez</h3>
                <p className="text-green-600 font-medium mb-3">CTO & Co-Founder</p>
                <p className="text-gray-600 text-sm">PhD in Computer Science, specializing in educational software systems</p>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-8 pb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <TrendingUp className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Emily Watson</h3>
                <p className="text-purple-600 font-medium mb-3">Head of Product</p>
                <p className="text-gray-600 text-sm">Former product manager at leading edtech companies</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <Globe className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Be part of the educational revolution. Whether you're a school looking to modernize
            or an individual passionate about education, we welcome you to our community.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg"
            >
              Start Your Journey
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/careers')}
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg"
            >
              Join Our Team
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
