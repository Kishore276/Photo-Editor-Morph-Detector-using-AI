import React from 'react'
import { motion } from 'framer-motion'
import {
  Scissors,
  Info,
  Sparkles
} from 'lucide-react'

import { useImage } from '../../context/ImageContext'

const BackgroundRemoverPanel = ({ disabled = false }) => {

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6"
    >
      {/* Header */}
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500">
          <Scissors className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Background Remover
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Remove image background with AI-powered rembg
          </p>
        </div>
      </div>

      {/* AI Model Info */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 mb-6">
        <div className="flex items-start space-x-3">
          <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-900 dark:text-green-300 mb-1">
              AI-Powered Background Removal
            </h4>
            <p className="text-sm text-green-800 dark:text-green-200">
              Using advanced rembg technology with U2Net neural network for precise background detection and removal.
            </p>
          </div>
        </div>
      </div>

      {/* Output Format Info */}
      <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start space-x-3">
          <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-blue-900 dark:text-blue-300 mb-1">
              Output Format
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              The background will be removed and the image will be saved as a PNG file with transparency.
              This allows you to use the image on any background.
            </p>
          </div>
        </div>
      </div>

      {/* How it Works */}
      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
          How it Works
        </summary>
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs space-y-2">
          <div>
            <span className="font-medium text-gray-900 dark:text-white">rembg Technology:</span>
            <span className="text-gray-600 dark:text-gray-300 ml-2">
              Uses advanced U2Net neural network architecture for precise foreground/background segmentation with excellent edge detection.
            </span>
          </div>
          <div>
            <span className="font-medium text-gray-900 dark:text-white">Processing:</span>
            <span className="text-gray-600 dark:text-gray-300 ml-2">
              Automatically detects the main subject and removes the background while preserving fine details like hair and edges.
            </span>
          </div>
        </div>
      </details>
    </motion.div>
  )
}

export default BackgroundRemoverPanel
