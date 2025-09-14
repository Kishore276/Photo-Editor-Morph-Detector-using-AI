import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  Upload,
  Crop,
  Expand,
  Scissors,
  Eye,
  Zap,
  Settings,
  Download,
  RefreshCw,
  AlertCircle,
  Search
} from 'lucide-react'

import { useImage } from '../context/ImageContext'
import { apiService } from '../services/api'
import ImageUpload from '../components/ImageUpload'
import ImagePreview from '../components/ImagePreview'
import ToolPanel from '../components/ToolPanel'
import ProcessingStatus from '../components/ProcessingStatus'
import ResultsPanel from '../components/ResultsPanel'

const Dashboard = () => {
  const {
    currentImage,
    isProcessing,
    processingStep,
    processingProgress,
    selectedTool,
    setSelectedTool,
    setProcessing,
    resetProcessing
  } = useImage()

  const [backendStatus, setBackendStatus] = useState('checking')
  const [showSettings, setShowSettings] = useState(false)

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth()
  }, [])

  const checkBackendHealth = async () => {
    try {
      setBackendStatus('checking')
      await apiService.healthCheck()
      setBackendStatus('healthy')
      toast.success('Backend is ready!')
    } catch (error) {
      setBackendStatus('unhealthy')
      toast.error('Backend is not available. Please start the API server.')
    }
  }

  // Main tool
  const mainTool = {
    id: 'morph-detect',
    name: 'Photo Morph Detector',
    icon: Search,
    description: 'Detect if image is morphed/edited using advanced AI analysis',
    color: 'from-pink-500 to-rose-500',
    disabled: !currentImage || isProcessing
  }

  // Extra tools
  const extraTools = [
    {
      id: 'ai-detect',
      name: 'AI Detection',
      icon: Eye,
      description: 'Detect if image is AI-generated',
      color: 'from-orange-500 to-red-500',
      disabled: !currentImage || isProcessing
    },
    {
      id: 'bg-remove',
      name: 'Background Remover',
      icon: Scissors,
      description: 'Remove background with AI models',
      color: 'from-green-500 to-emerald-500',
      disabled: !currentImage || isProcessing
    }
  ]

  const handleToolSelect = (toolId) => {
    if (isProcessing) return
    setSelectedTool(toolId)
  }

  const handleRetryConnection = () => {
    checkBackendHealth()
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Upload an image and choose your AI-powered tools
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Backend Status */}
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  backendStatus === 'healthy' ? 'bg-green-500' :
                  backendStatus === 'checking' ? 'bg-yellow-500 animate-pulse' :
                  'bg-red-500'
                }`} />
                <span className="text-sm text-gray-600">
                  {backendStatus === 'healthy' ? 'Backend Ready' :
                   backendStatus === 'checking' ? 'Checking...' :
                   'Backend Offline'}
                </span>
                {backendStatus === 'unhealthy' && (
                  <button
                    onClick={handleRetryConnection}
                    className="text-primary-600 hover:text-primary-700 text-sm"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Backend Offline Warning */}
        {backendStatus === 'unhealthy' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Backend Server Not Available
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Please start the API server by running: <code className="bg-red-100 px-1 rounded">python api_server.py</code>
                </p>
              </div>
              <button
                onClick={handleRetryConnection}
                className="btn-outline text-red-700 border-red-300 hover:bg-red-50"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Panel - Upload & Tools */}
          <div className="lg:col-span-4 space-y-6">
            {/* Image Upload */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ImageUpload disabled={backendStatus !== 'healthy'} />
            </motion.div>

            {/* Tools Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-primary-600" />
                AI Tools
              </h2>
              
              {/* Photo Morph Detector - Featured Style */}
              <div className="mb-8">
                {(() => {
                  const tool = mainTool
                  const Icon = tool.icon
                  const isSelected = selectedTool === tool.id
                  const isDisabled = tool.disabled || backendStatus !== 'healthy'
                  
                  return (
                    <motion.button
                      key={tool.id}
                      onClick={() => handleToolSelect(tool.id)}
                      disabled={isDisabled}
                      whileHover={!isDisabled ? { scale: 1.02 } : {}}
                      whileTap={!isDisabled ? { scale: 0.98 } : {}}
                      className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left shadow-lg ${
                        isSelected
                          ? 'border-pink-500 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 shadow-pink-200 dark:shadow-pink-900/20'
                          : isDisabled
                          ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                          : 'border-pink-200 dark:border-pink-800 hover:border-pink-400 dark:hover:border-pink-600 hover:bg-gradient-to-br hover:from-pink-50 hover:to-rose-50 dark:hover:from-pink-900/10 dark:hover:to-rose-900/10 hover:shadow-xl'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${tool.color} shadow-lg ${
                          isDisabled ? 'opacity-50' : ''
                        }`}>
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                            {tool.name}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  )
                })()}
              </div>

              {/* Other Tools - Compact Style */}
              <div className="space-y-2">
                {extraTools.map((tool) => {
                  const Icon = tool.icon
                  const isSelected = selectedTool === tool.id
                  const isDisabled = tool.disabled || backendStatus !== 'healthy'
                  
                  return (
                    <motion.button
                      key={tool.id}
                      onClick={() => handleToolSelect(tool.id)}
                      disabled={isDisabled}
                      whileHover={!isDisabled ? { scale: 1.01 } : {}}
                      whileTap={!isDisabled ? { scale: 0.99 } : {}}
                      className={`w-full p-4 rounded-xl border transition-all duration-200 text-left ${
                        isSelected
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-md'
                          : isDisabled
                          ? 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50 cursor-not-allowed'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2.5 rounded-lg bg-gradient-to-r ${tool.color} ${
                          isDisabled ? 'opacity-50' : ''
                        }`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 dark:text-white">
                            {tool.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>

            {/* Processing Status */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <ProcessingStatus
                    step={processingStep}
                    progress={processingProgress}
                    onCancel={resetProcessing}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Center Panel - Image Preview */}
          <div className="lg:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <ImagePreview />
            </motion.div>
          </div>

          {/* Right Panel - Tool Settings & Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Tool Panel */}
            <AnimatePresence mode="wait">
              {selectedTool && (
                <motion.div
                  key={selectedTool}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ToolPanel
                    toolId={selectedTool}
                    disabled={backendStatus !== 'healthy'}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results Panel */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <ResultsPanel />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
