import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  BarChart3,
  Eye,
  Zap
} from 'lucide-react'

const MorphDetectPanel = ({ disabled = false }) => {
  const [showAdvanced, setShowAdvanced] = useState(false)

  return (
    <div className="space-y-6">
      {/* Info Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
              Photo Morph Detection
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Advanced analysis to detect if an image has been morphed, edited, or manipulated. 
              Uses multiple techniques including compression analysis, noise patterns, edge consistency, 
              lighting analysis, color consistency, and texture patterns.
            </p>
          </div>
        </div>
      </div>

      {/* Detection Methods */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
          <BarChart3 className="h-4 w-4 mr-2" />
          Analysis Methods
        </h3>
        
        <div className="grid grid-cols-1 gap-3">
          {[
            {
              name: 'Compression Analysis',
              description: 'Detects inconsistent JPEG compression artifacts',
              icon: Zap,
              color: 'text-blue-600'
            },
            {
              name: 'Noise Patterns',
              description: 'Analyzes noise inconsistencies across regions',
              icon: Eye,
              color: 'text-green-600'
            },
            {
              name: 'Edge Consistency',
              description: 'Examines edge irregularities and morphing artifacts',
              icon: Search,
              color: 'text-purple-600'
            },
            {
              name: 'Lighting Analysis',
              description: 'Checks for lighting inconsistencies',
              icon: CheckCircle,
              color: 'text-yellow-600'
            },
            {
              name: 'Color Consistency',
              description: 'Analyzes color distribution patterns',
              icon: AlertTriangle,
              color: 'text-orange-600'
            },
            {
              name: 'Texture Patterns',
              description: 'Detects texture irregularities using LBP',
              icon: XCircle,
              color: 'text-red-600'
            }
          ].map((method, index) => {
            const Icon = method.icon
            return (
              <motion.div
                key={method.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <Icon className={`h-4 w-4 ${method.color}`} />
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {method.name}
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">
                    {method.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Advanced Settings */}
      <div className="space-y-4">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center justify-between w-full text-sm font-medium text-gray-900 dark:text-white"
          disabled={disabled}
        >
          <span className="flex items-center">
            <Search className="h-4 w-4 mr-2" />
            Advanced Settings
          </span>
          <motion.div
            animate={{ rotate: showAdvanced ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </motion.div>
        </button>

        <motion.div
          initial={false}
          animate={{ height: showAdvanced ? 'auto' : 0, opacity: showAdvanced ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className="overflow-hidden"
        >
          <div className="space-y-4 pt-2">
            {/* Sensitivity Settings */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Detection Sensitivity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['Low', 'Medium', 'High'].map((level) => (
                  <button
                    key={level}
                    className={`px-3 py-2 text-xs rounded-lg border transition-colors ${
                      level === 'Medium'
                        ? 'bg-primary-100 border-primary-300 text-primary-700'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                    disabled={disabled}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* Analysis Focus */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Analysis Focus
              </label>
              <div className="space-y-2">
                {[
                  { id: 'face', label: 'Face Morphing', checked: true },
                  { id: 'background', label: 'Background Editing', checked: true },
                  { id: 'objects', label: 'Object Manipulation', checked: false },
                  { id: 'color', label: 'Color Grading', checked: false }
                ].map((option) => (
                  <label key={option.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked={option.checked}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      disabled={disabled}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Expected Results */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3 flex items-center">
          <BarChart3 className="h-4 w-4 mr-2" />
          Expected Results
        </h3>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Overall morph probability percentage</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Individual component analysis scores</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Confidence level and certainty rating</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Detailed technical analysis breakdown</span>
          </div>
        </div>
      </div>

      {/* Processing Note */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Note:</strong> Morph detection analysis may take 10-30 seconds depending on image size and complexity.
              Results are provided as probability percentages and should be interpreted by experts for critical applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MorphDetectPanel
