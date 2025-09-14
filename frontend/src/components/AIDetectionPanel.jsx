import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Eye, 
  Brain, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  Play,
  Loader2
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import { useImage } from '../context/ImageContext'
import { apiService } from '../services/api'

const AIDetectionPanel = ({ disabled = false }) => {
  const { currentImage, setProcessing, updateProcessingProgress } = useImage()
  const [isRunning, setIsRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const handleRunDetection = async () => {
    if (!currentImage || isRunning || disabled) return

    try {
      setIsRunning(true)
      setProcessing(true, 'Analyzing image with AI detector...', 0)

      // Simulate progress
      let progress = 0
      const progressInterval = setInterval(() => {
        progress = Math.min(progress + 10, 90)
        setProcessing(true, 'Analyzing image with AI detector...', progress)
      }, 200)

      const response = await apiService.detectAI(currentImage.id)

      clearInterval(progressInterval)
      setProcessing(true, 'Analysis complete!', 100)

      if (response.success) {
        setResult(response)
        toast.success('AI detection completed!')
      } else {
        throw new Error(response.error || 'AI detection failed')
      }

    } catch (error) {
      console.error('AI detection error:', error)
      toast.error(error.message || 'AI detection failed')
    } finally {
      setIsRunning(false)
      setProcessing(false, '', 0)
    }
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 dark:text-green-400'
    if (confidence >= 0.6) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 0.8) return CheckCircle
    if (confidence >= 0.6) return AlertTriangle
    return AlertTriangle
  }

  if (!currentImage) {
    return (
      <div className="card p-6">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <Eye className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <h3 className="text-lg font-medium mb-2">AI Detection</h3>
          <p className="text-sm">Upload an image to detect if it's AI-generated</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              AI Detection
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Detect if this image is AI-generated
            </p>
          </div>
        </div>

        {result && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="btn-ghost p-2"
            title="Toggle details"
          >
            <Info className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Run Detection Button */}
      <motion.button
        onClick={handleRunDetection}
        disabled={disabled || isRunning}
        whileHover={!disabled && !isRunning ? { scale: 1.02 } : {}}
        whileTap={!disabled && !isRunning ? { scale: 0.98 } : {}}
        className={`w-full mb-6 px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
          disabled || isRunning
            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {isRunning ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <Play className="h-4 w-4" />
            <span>Run AI Detection</span>
          </>
        )}
      </motion.button>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            {/* Main Result */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {React.createElement(getConfidenceIcon(result.confidence), {
                    className: `h-5 w-5 ${getConfidenceColor(result.confidence)}`
                  })}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {result.prediction}
                  </span>
                </div>
                <span className={`text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                  {Math.round(result.confidence * 100)}% confident
                </span>
              </div>

              {/* Probability Bars */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">AI Generated</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.round(result.ai_probability * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.ai_probability * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                  />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Real Photo</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.round(result.real_probability * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.real_probability * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                >
                  <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-3 flex items-center">
                    <Info className="h-4 w-4 mr-2" />
                    Detection Details
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-blue-700 dark:text-blue-300">Certainty:</span>
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        {result.certainty}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-blue-700 dark:text-blue-300">Model:</span>
                      <p className="font-medium text-blue-900 dark:text-blue-100 truncate">
                        {result.model_used}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-blue-700 dark:text-blue-300">Method:</span>
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        {result.method}
                      </p>
                    </div>
                    
                    <div>
                      <span className="text-blue-700 dark:text-blue-300">Raw Label:</span>
                      <p className="font-medium text-blue-900 dark:text-blue-100">
                        {result.raw_label}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default AIDetectionPanel
