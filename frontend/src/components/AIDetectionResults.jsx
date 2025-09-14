import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye,
  Brain,
  CheckCircle,
  AlertTriangle,
  Info,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react'

import { useImage } from '../context/ImageContext'

const AIDetectionResults = () => {
  const { results } = useImage()

  // Get AI detection results from the results object
  const aiDetectionResult = results?.['ai-detect']

  if (!aiDetectionResult || !aiDetectionResult.success) {
    return null // Don't show anything if no AI detection results
  }

  const result = aiDetectionResult

  const isAI = result.prediction === "AI Generated"
  const confidence = result.confidence * 100
  const aiProbability = result.ai_probability * 100
  const realProbability = result.real_probability * 100

  const getConfidenceColor = (conf) => {
    if (conf >= 80) return 'text-green-600 dark:text-green-400'
    if (conf >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getConfidenceIcon = (conf) => {
    if (conf >= 80) return CheckCircle
    return AlertTriangle
  }

  const getConfidenceBgColor = (conf) => {
    if (conf >= 80) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
    if (conf >= 60) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
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
                AI Detection Results
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Analysis using {result.model_used}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`p-2 rounded-lg ${getConfidenceBgColor(confidence)}`}>
              {React.createElement(getConfidenceIcon(confidence), {
                className: `h-5 w-5 ${getConfidenceColor(confidence)}`
              })}
            </div>
          </div>
        </div>

        {/* Main Result */}
        <div className={`p-6 rounded-xl border-2 mb-6 ${getConfidenceBgColor(confidence)}`}>
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-3 rounded-full ${isAI ? 'bg-red-100 dark:bg-red-900/30' : 'bg-green-100 dark:bg-green-900/30'}`}>
                {isAI ? (
                  <Zap className="h-8 w-8 text-red-600 dark:text-red-400" />
                ) : (
                  <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                )}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {result.prediction}
            </h3>

            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className={`text-3xl font-bold ${getConfidenceColor(confidence)}`}>
                {confidence.toFixed(1)}%
              </span>
              <span className="text-lg text-gray-600 dark:text-gray-300">Confidence</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              {/* Real Photo Probability */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Real Photo Probability
                </p>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {realProbability.toFixed(1)}%
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${realProbability}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                  />
                </div>
              </div>

              {/* AI Generated Probability */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  AI Generated Probability
                </p>
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {aiProbability.toFixed(1)}%
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mt-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${aiProbability}%` }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                    className="bg-gradient-to-r from-red-500 to-orange-500 h-3 rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Certainty Level */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="h-4 w-4 mr-2" />
              Certainty Level:
            </h4>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              result.certainty === 'High'
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                : result.certainty === 'Medium'
                ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'
                : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
            }`}>
              {result.certainty}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {result.certainty === 'High' && 'Very reliable result - high confidence in prediction'}
            {result.certainty === 'Medium' && 'Moderately reliable result - reasonable confidence'}
            {result.certainty === 'Low' && 'Less reliable result - lower confidence, consider additional analysis'}
          </p>
        </div>

        {/* Analysis Summary */}
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center">
            <Info className="h-4 w-4 mr-2" />
            Analysis Summary
          </h4>
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            {isAI
              ? "The image exhibits patterns consistent with AI generation, such as specific noise signatures, unusual texture patterns, or generation artifacts typical of AI models."
              : "The image shows characteristics typical of authentic photography, including natural noise patterns, realistic lighting, and organic imperfections consistent with camera capture."
            }
          </p>
        </div>

        {/* Technical Details (Collapsible) */}
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
            Technical Details
          </summary>
          <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Model:</span>
              <span className="text-gray-900 dark:text-white font-mono">{result.model_used}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Method:</span>
              <span className="text-gray-900 dark:text-white font-mono">{result.method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Raw Label:</span>
              <span className="text-gray-900 dark:text-white font-mono">{result.raw_label}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Device:</span>
              <span className="text-gray-900 dark:text-white font-mono">{result.device}</span>
            </div>
          </div>
        </details>
      </motion.div>
    </AnimatePresence>
  )
}

export default AIDetectionResults
