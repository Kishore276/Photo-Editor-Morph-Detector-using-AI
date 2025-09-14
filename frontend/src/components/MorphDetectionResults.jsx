import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp,
  Eye,
  Zap,
  Target
} from 'lucide-react'

import { useImage } from '../context/ImageContext'

const MorphDetectionResults = () => {
  const { results } = useImage()
  const result = results['morph-detect']
  const [showDetails, setShowDetails] = useState(false)
  const [showComponentScores, setShowComponentScores] = useState(false)

  if (!result || !result.success) {
    return null
  }

  const getStatusIcon = () => {
    if (result.morph_percentage < 30) {
      return <CheckCircle className="h-6 w-6 text-green-500" />
    } else if (result.morph_percentage < 70) {
      return <AlertTriangle className="h-6 w-6 text-yellow-500" />
    } else {
      return <XCircle className="h-6 w-6 text-red-500" />
    }
  }

  const getStatusColor = () => {
    if (result.morph_percentage < 30) {
      return 'text-green-700 bg-green-50 border-green-200'
    } else if (result.morph_percentage < 70) {
      return 'text-yellow-700 bg-yellow-50 border-yellow-200'
    } else {
      return 'text-red-700 bg-red-50 border-red-200'
    }
  }

  const componentScores = result.component_scores || {}

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Search className="h-5 w-5 text-pink-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Morph Detection Results
          </h3>
        </div>
        {getStatusIcon()}
      </div>

      {/* Main Result */}
      <div className={`rounded-lg border p-4 ${getStatusColor()}`}>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold">
            {result.prediction}
          </h4>
          <span className="text-sm font-medium">
            Certainty: {result.certainty}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">
              {result.morph_percentage}%
            </div>
            <div className="text-sm opacity-75">
              Morphed/Edited
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold mb-1">
              {result.real_percentage}%
            </div>
            <div className="text-sm opacity-75">
              Real/Authentic
            </div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Morph Probability</span>
            <span>{result.morph_percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${result.morph_percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-gradient-to-r from-pink-500 to-red-500 h-2 rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Component Scores */}
      <div className="space-y-3">
        <button
          onClick={() => setShowComponentScores(!showComponentScores)}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-md font-medium text-gray-900 dark:text-white flex items-center">
            <BarChart3 className="h-4 w-4 mr-2" />
            Component Analysis Scores
          </h4>
          {showComponentScores ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {showComponentScores && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pt-2">
                {Object.entries(componentScores).map(([key, value]) => {
                  const displayName = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                  const percentage = Math.round(value)
                  
                  return (
                    <div key={key} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-700 dark:text-gray-300">{displayName}</span>
                        <span className="font-medium">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, delay: 0.2 }}
                          className={`h-1.5 rounded-full ${
                            percentage < 30 ? 'bg-green-500' :
                            percentage < 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Technical Details */}
      <div className="space-y-3">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-between w-full text-left"
        >
          <h4 className="text-md font-medium text-gray-900 dark:text-white flex items-center">
            <Info className="h-4 w-4 mr-2" />
            Technical Details
          </h4>
          {showDetails ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>

        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Model:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {result.model_used || 'Photo Morph Detector'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Device:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {result.device || 'CPU'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Method:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {result.method || 'Multi-analysis'}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">Type:</span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">
                      {result.detection_type || 'Real'}
                    </span>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-medium text-gray-700 dark:text-gray-300">Raw Probability:</span>
                  <span className="ml-2 text-gray-600 dark:text-gray-400">
                    {result.morph_probability || 'N/A'}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Interpretation Guide */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              Interpretation Guide
            </h4>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <div><strong>0-30%:</strong> Likely authentic/real photo</div>
              <div><strong>30-70%:</strong> Possibly edited or enhanced</div>
              <div><strong>70-100%:</strong> Likely morphed or heavily edited</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MorphDetectionResults
