import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  Maximize2,
  Info,
  Eye,
  EyeOff
} from 'lucide-react'

import { useImage } from '../context/ImageContext'
import { apiService, utils } from '../services/api'
import AIDetectionResults from './AIDetectionResults'
import MorphDetectionResults from './MorphDetectionResults'

const ImagePreview = () => {
  const { currentImage, processedImages } = useImage()
  const [zoom, setZoom] = useState(1)
  const [showInfo, setShowInfo] = useState(false)
  const [compareMode, setCompareMode] = useState(false)
  const [selectedResult, setSelectedResult] = useState(null)

  const hasResults = processedImages.length > 0
  const displayImage = selectedResult || currentImage

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.25, 0.25))
  }

  const handleResetZoom = () => {
    setZoom(1)
  }

  const handleDownload = async () => {
    if (!displayImage) return
    
    try {
      const filename = `${displayImage.filename || 'image'}_${Date.now()}.jpg`
      await apiService.downloadImage(displayImage.url, filename)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  if (!currentImage) {
    return (
      <div className="card h-96 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Eye className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium mb-2">No Image Selected</h3>
          <p className="text-sm">Upload an image to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Image Preview Card */}
      <div className="card overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Image Preview
            </h2>
            
            {hasResults && (
              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`btn-ghost text-sm ${
                  compareMode ? 'bg-primary-100 text-primary-700' : ''
                }`}
              >
                {compareMode ? <EyeOff className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
                {compareMode ? 'Hide Compare' : 'Compare'}
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="btn-ghost p-2"
              title="Image Info"
            >
              <Info className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleZoomOut}
              className="btn-ghost p-2"
              disabled={zoom <= 0.25}
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            
            <span className="text-sm text-gray-600 dark:text-gray-300 min-w-[60px] text-center">
              {Math.round(zoom * 100)}%
            </span>
            
            <button
              onClick={handleZoomIn}
              className="btn-ghost p-2"
              disabled={zoom >= 3}
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleResetZoom}
              className="btn-ghost p-2"
              title="Reset Zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            
            <button
              onClick={handleDownload}
              className="btn-primary p-2"
              title="Download"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results Selector */}
        {hasResults && (
          <div className="mt-3 flex items-center space-x-2 overflow-x-auto">
            <button
              onClick={() => setSelectedResult(null)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                !selectedResult
                  ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Original
            </button>
            
            {processedImages.map((result, index) => (
              <button
                key={index}
                onClick={() => setSelectedResult(result)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedResult === result
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {result.type || `Result ${index + 1}`}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Image Container */}
      <div className="relative bg-gray-100 overflow-hidden" style={{ height: '500px' }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: zoom }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative"
          >
            <img
              src={displayImage.url}
              alt={displayImage.filename || 'Preview'}
              className="max-w-full max-h-full object-contain shadow-lg rounded-lg"
              style={{ maxHeight: '480px' }}
            />
            
            {/* Compare Overlay */}
            <AnimatePresence>
              {compareMode && selectedResult && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg"
                >
                  <div className="text-white text-center">
                    <p className="text-sm mb-2">Comparing with original</p>
                    <div className="flex space-x-4">
                      <div className="text-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mx-auto mb-1"></div>
                        <span className="text-xs">Original</span>
                      </div>
                      <div className="text-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mb-1"></div>
                        <span className="text-xs">Processed</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Zoom Controls Overlay */}
        {zoom !== 1 && (
          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
            {Math.round(zoom * 100)}%
          </div>
        )}
      </div>

      {/* Image Info Panel */}
      <AnimatePresence>
        {showInfo && displayImage && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-200 bg-gray-50 p-4"
          >
            <h3 className="text-sm font-medium text-gray-900 mb-3">Image Information</h3>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Filename:</span>
                <p className="font-medium text-gray-900 truncate">
                  {displayImage.filename || 'Unknown'}
                </p>
              </div>
              
              <div>
                <span className="text-gray-600">Dimensions:</span>
                <p className="font-medium text-gray-900">
                  {displayImage.size ? `${displayImage.size[0]} × ${displayImage.size[1]}` : 'Unknown'}
                </p>
              </div>
              
              <div>
                <span className="text-gray-600">Format:</span>
                <p className="font-medium text-gray-900">
                  {displayImage.format || 'Unknown'}
                </p>
              </div>
              
              <div>
                <span className="text-gray-600">File Size:</span>
                <p className="font-medium text-gray-900">
                  {displayImage.fileSize ? utils.formatFileSize(displayImage.fileSize) : 'Unknown'}
                </p>
              </div>
              
              {displayImage.uploadTime && (
                <div className="col-span-2">
                  <span className="text-gray-600">Uploaded:</span>
                  <p className="font-medium text-gray-900">
                    {new Date(displayImage.uploadTime).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* AI Detection Results - Under Image Preview */}
      <AIDetectionResults />

      {/* Morph Detection Results - Under Image Preview */}
      <MorphDetectionResults />
    </div>
  )
}

export default ImagePreview
