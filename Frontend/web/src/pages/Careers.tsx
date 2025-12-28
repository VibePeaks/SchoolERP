import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  Code,
  Palette,
  TrendingUp,
  Heart,
  Coffee,
  Target,
  Award,
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

const Careers = () => {
  const navigate = useNavigate();
  const [selectedJob, setSelectedJob] = useState<string | null>(null);

  const perks = [
    {
      icon: Heart,
      title: "Health & Wellness",
      items: ["Comprehensive health insurance", "Mental health support", "Flexible work hours", "Unlimited PTO"]
    },
    {
      icon: Coffee,
      title: "Work-Life Balance",
      items: ["Remote-first culture", "Flexible scheduling", "Work from anywhere", "No overtime culture"]
    },
    {
      icon: Target,
      title: "Growth & Development",
      items: ["Learning stipends", "Conference attendance", "Mentorship programs", "Career advancement paths"]
    },
    {
      icon: Award,
      title: "Rewards & Recognition",
      items: ["Performance bonuses", "Spot bonuses", "Peer recognition", "Company retreats"]
    }
  ];

  const jobs = [
    {
      id: "fullstack-dev",
      title: "Senior Full-Stack Developer",
      department: "Engineering",
      location: "Remote / Hybrid",
      type: "Full-time",
      salary: "$120K - $160K",
      description: "Build scalable SaaS solutions that serve thousands of schools worldwide. Work with modern technologies and impact millions of students.",
      requirements: [
        "5+ years of full-stack development experience",
        "Expertise in React, Node.js, and .NET Core",
        "Experience with cloud platforms (AWS/Azure)",
        "Strong understanding of database design and optimization",
        "Experience with multi-tenant architectures"
      ],
      benefits: ["Equity package", "Learning budget", "Health insurance", "Flexible PTO"]
    },
    {
      id: "product-manager",
      title: "Product Manager - Education",
      department: "Product",
      location: "Remote / New York",
      type: "Full-time",
      salary: "$130K - $170K",
      description: "Drive product strategy for our school management platform. Work closely with schools to understand their needs and build solutions that matter.",
      requirements: [
        "4+ years of product management experience",
        "Experience in EdTech or SaaS preferred",
        "Strong analytical and problem-solving skills",
        "Excellent communication and leadership abilities",
        "Background in education is a plus"
      ],
      benefits: ["Equity package", "Conference budget", "Health insurance", "Flexible PTO"]
    },
    {
      id: "devops-engineer",
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$110K - $150K",
      description: "Build and maintain the infrastructure that powers our multi-tenant SaaS platform. Ensure high availability and scalability for thousands of schools.",
      requirements: [
        "4+ years of DevOps/Infrastructure experience",
        "Expertise in AWS/Azure and Kubernetes",
        "Strong scripting skills (Python, Bash)",
        "Experience with CI/CD pipelines",
        "Knowledge of monitoring and logging tools"
      ],
      benefits: ["Equity package", "Cloud certifications covered", "Health insurance", "Flexible PTO"]
    },
    {
      id: "education-specialist",
      title: "Education Technology Specialist",
      department: "Education",
      location: "Remote / Various Cities",
      type: "Full-time",
      salary: "$80K - $110K",
      description: "Bridge the gap between technology and education. Help schools implement our solutions and ensure they meet educational standards.",
      requirements: [
        "Teaching certification or education degree",
        "2+ years of teaching or educational administration",
        "Interest in educational technology",
        "Strong communication and training skills",
        "Understanding of curriculum management"
      ],
      benefits: ["Professional development", "Travel opportunities", "Health insurance", "Flexible PTO"]
    }
  ];

  const culture = [
    {
      icon: Users,
      title: "Collaborative Culture",
      description: "We believe in the power of teamwork and open communication. Every voice matters in shaping our products and company direction."
    },
    {
      icon: TrendingUp,
      title: "Impact-Driven Work",
      description: "Every line of code and every feature we build directly impacts the education of thousands of students worldwide."
    },
    {
      icon: Heart,
      title: "Education Passion",
      description: "Our team is united by a shared passion for improving education. We're educators, parents, and education enthusiasts."
    },
    {
      icon: Code,
      title: "Innovation Focus",
      description: "We embrace new technologies and methodologies. Learning and experimentation are core to our DNA."
    }
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
            Join Our Mission to
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Transform Education
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We're building the future of school management. Join a team of passionate educators,
            developers, and innovators who are making a real difference in education worldwide.
          </p>
        </div>

        {/* Culture Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why VibePeaks?</h2>
            <p className="text-lg text-gray-600">More than just a job - a chance to shape the future of education</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {culture.map((item, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Perks Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Benefits & Perks</h2>
            <p className="text-lg text-gray-600">We take care of our team so you can focus on making an impact</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {perks.map((perk, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <perk.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{perk.title}</h3>
                  <ul className="space-y-2">
                    {perk.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Open Positions</h2>
            <p className="text-lg text-gray-600">Help us build the future of education technology</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {jobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                      <Badge variant="secondary" className="mb-2">{job.department}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {job.type}
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {job.salary}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{job.description}</p>
                  <Button
                    onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                    className="w-full mb-4"
                  >
                    {selectedJob === job.id ? 'Hide Details' : 'View Details'}
                  </Button>

                  {selectedJob === job.id && (
                    <div className="space-y-4 pt-4 border-t">
                      <div>
                        <h4 className="font-semibold mb-2">Requirements:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {job.requirements.map((req, index) => (
                            <li key={index} className="flex items-start">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Benefits:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.benefits.map((benefit, index) => (
                            <Badge key={index} variant="outline">{benefit}</Badge>
                          ))}
                        </div>
                      </div>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                        Apply for this Position
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div className="mb-16">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Don't See Your Role?</CardTitle>
              <p className="text-gray-600">We're always looking for talented individuals. Send us your resume!</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john.doe@email.com" />
              </div>

              <div>
                <Label htmlFor="position">Position of Interest</Label>
                <Input id="position" placeholder="e.g., Software Engineer, Product Manager" />
              </div>

              <div>
                <Label htmlFor="message">Why VibePeaks?</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us why you're interested in joining our mission..."
                  rows={4}
                />
              </div>

              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                <Send className="w-4 h-4 mr-2" />
                Send Application
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <Users className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Make an Impact?</h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join a team that's passionate about education and technology.
            Together, we can transform how the world learns.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/contact')}
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 text-lg"
          >
            Get in Touch
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Careers;
