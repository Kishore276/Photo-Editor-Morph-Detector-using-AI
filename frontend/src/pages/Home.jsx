import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Eye, 
  Type, 
  Crop, 
  Expand,
  CheckCircle,
  Star,
  Users,
  Download,
  Clock
} from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Crop,
      title: 'Smart Cropping',
      description: 'AI-powered cropping that preserves your main subjects while achieving perfect aspect ratios.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Expand,
      title: 'AI Outpainting',
      description: 'Extend your images intelligently with AI-generated backgrounds that match your style.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Type,
      title: 'Smart Text Overlay',
      description: 'Add text with automatic contrast adjustment and subject-aware placement.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Eye,
      title: 'AI Detection',
      description: 'Detect whether images are real photos or AI-generated with high accuracy.',
      color: 'from-orange-500 to-red-500'
    }
  ]

  const stats = [
    { icon: Users, value: '10K+', label: 'Active Users' },
    { icon: Download, value: '100K+', label: 'Images Processed' },
    { icon: Star, value: '4.9/5', label: 'User Rating' },
    { icon: Clock, value: '< 30s', label: 'Avg Processing Time' }
  ]

  const benefits = [
    'No API keys required - runs completely offline',
    'Professional-grade AI models included',
    'Batch processing capabilities',
    'Multiple export formats supported',
    'Real-time preview and adjustments',
    'Open source and customizable'
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ 
              x: [0, 100, 0],
              y: [0, -100, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary-200 to-secondary-200 dark:from-primary-800 dark:to-secondary-800 rounded-full opacity-20 blur-3xl"
          />
          <motion.div
            animate={{ 
              x: [0, -150, 0],
              y: [0, 100, 0],
              rotate: [360, 180, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-secondary-200 to-accent-200 dark:from-secondary-800 dark:to-accent-800 rounded-full opacity-20 blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-primary-200 dark:border-primary-700 rounded-full px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-700 dark:text-primary-300">AI-Powered Image Preparation</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="block">Smart Image Prep</span>
                <span className="block bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text text-transparent">
                  for Creators
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
                Professional AI-powered toolkit for preparing images for social media. 
                Smart cropping, outpainting, text overlay, and AI detection - all offline.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <Link
                to="/dashboard"
                className="group relative inline-flex items-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span>Get Started Free</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <a
                href="https://github.com/yourusername/smart-image-prep"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-xl font-semibold text-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <span>View on GitHub</span>
                <Zap className="h-5 w-5" />
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-900/20 rounded-lg mb-3">
                      <Icon className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">{stat.label}</div>
                  </div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful AI Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to prepare professional images for social media, 
              powered by state-of-the-art AI models.
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
                  whileHover={{ y: -5 }}
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.color} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose Smart Image Prep?
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Built for creators who demand professional results without the complexity. 
                Our AI-powered tools work offline and deliver studio-quality results in seconds.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl">
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full opacity-20 blur-xl" />
                <div className="relative">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    Ready to get started?
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Join thousands of creators who are already using Smart Image Prep 
                    to create stunning social media content.
                  </p>
                  <Link
                    to="/dashboard"
                    className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    <span>Start Creating</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
