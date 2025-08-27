import React from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Brain, 
  Zap, 
  Shield, 
  Code, 
  Heart,
  Github,
  ExternalLink,
  Users,
  Award,
  Cpu,
  Globe
} from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'State-of-the-art machine learning models for intelligent image processing.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All processing happens locally. Your images never leave your device.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized algorithms deliver professional results in seconds.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Code,
      title: 'Open Source',
      description: 'Fully open source and customizable for your specific needs.',
      color: 'from-blue-500 to-cyan-500'
    }
  ]

  const technologies = [
    { name: 'YOLOv8', description: 'Object detection and segmentation' },
    { name: 'Stable Diffusion', description: 'AI image generation and outpainting' },
    { name: 'Transformers', description: 'AI image classification and analysis' },
    { name: 'React + Vite', description: 'Modern frontend framework' },
    { name: 'FastAPI', description: 'High-performance Python backend' },
    { name: 'PyTorch', description: 'Deep learning framework' }
  ]

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Users' },
    { icon: Cpu, value: '100K+', label: 'Images Processed' },
    { icon: Globe, value: '50+', label: 'Countries' },
    { icon: Award, value: '4.9/5', label: 'User Rating' }
  ]

  const team = [
    {
      name: 'AI Research Team',
      role: 'Machine Learning Engineers',
      description: 'Experts in computer vision and deep learning'
    },
    {
      name: 'Frontend Team',
      role: 'UI/UX Developers',
      description: 'Creating beautiful and intuitive user experiences'
    },
    {
      name: 'Backend Team',
      role: 'Infrastructure Engineers',
      description: 'Building scalable and reliable systems'
    }
  ]

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-primary-200 rounded-full px-4 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-medium text-primary-700">About Smart Image Prep</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              <span className="block">Empowering Creators</span>
              <span className="block bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                with AI Technology
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Smart Image Prep is a revolutionary AI-powered toolkit designed to help content creators 
              prepare professional-quality images for social media platforms with just a few clicks.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              
              <p className="text-lg text-gray-600 mb-6">
                We believe that every creator deserves access to professional-grade image editing tools. 
                Our mission is to democratize AI-powered image processing, making it accessible, 
                affordable, and easy to use for everyone.
              </p>
              
              <p className="text-lg text-gray-600 mb-8">
                By combining cutting-edge artificial intelligence with intuitive design, 
                we're helping creators focus on what they do best: creating amazing content.
              </p>
              
              <div className="flex space-x-4">
                <a
                  href="https://github.com/yourusername/smart-image-prep"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary flex items-center space-x-2"
                >
                  <Github className="h-4 w-4" />
                  <span>View on GitHub</span>
                </a>
                
                <a
                  href="/dashboard"
                  className="btn-outline flex items-center space-x-2"
                >
                  <Zap className="h-4 w-4" />
                  <span>Try It Now</span>
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 text-center"
                    >
                      <Icon className="h-8 w-8 text-primary-600 mx-auto mb-3" />
                      <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Makes Us Different
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with privacy, performance, and user experience at the core.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl mb-6`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powered by Cutting-Edge Technology
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We use the latest advances in AI and web technology to deliver the best experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <h3 className="font-semibold text-gray-900 mb-2">{tech.name}</h3>
                <p className="text-sm text-gray-600">{tech.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built by Experts
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our diverse team of engineers, designers, and AI researchers work together 
              to create the best possible experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                
                <p className="text-primary-600 font-medium mb-3">
                  {member.role}
                </p>
                
                <p className="text-gray-600 text-sm">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Images?
            </h2>
            
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already using Smart Image Prep 
              to create stunning content.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/dashboard"
                className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <Zap className="h-5 w-5" />
                <span>Get Started Free</span>
              </a>
              
              <a
                href="https://github.com/yourusername/smart-image-prep"
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors inline-flex items-center justify-center space-x-2"
              >
                <ExternalLink className="h-5 w-5" />
                <span>View Source Code</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About
