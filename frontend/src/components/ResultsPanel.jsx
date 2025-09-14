import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Download, 
  Share2, 
  Eye, 
  Trash2, 
  Copy,
  ExternalLink,
  Image as ImageIcon,
  Clock,
  Info
} from 'lucide-react'
import { toast } from 'react-hot-toast'

import { useImage } from '../context/ImageContext'
import { apiService, utils } from '../services/api'

const ResultsPanel = () => {
  const { processedImages, currentImage } = useImage()
  const [selectedResult, setSelectedResult] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const handleDownload = async (result) => {
    try {
      console.log('Download button clicked for result:', result)
      
      // For background removal and other processed images, try direct download first
      if (result.url && result.filename) {
        // Try using the download link directly
        const link = document.createElement('a')
        link.href = result.url
        link.download = result.filename
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Also try the API method as backup
        setTimeout(async () => {
          try {
            await apiService.downloadImage(result.url, result.filename)
          } catch (error) {
            console.log('API download failed, but direct download may have worked')
          }
        }, 100)
        
        toast.success('Download started!')
      } else {
        throw new Error('No download URL available')
      }
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Failed to download image')
    }
  }

  const handleShare = async (result) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Smart Image Prep Result',
          text: `Check out this ${result.type} result!`,
          url: result.url
        })
      } catch (error) {
        // Fallback to copy URL
        handleCopyUrl(result)
      }
    } else {
      handleCopyUrl(result)
    }
  }

  const handleCopyUrl = async (result) => {
    try {
      await navigator.clipboard.writeText(result.url)
      toast.success('Image URL copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy URL')
    }
  }

  const handleDelete = (resultIndex) => {
    // In a real app, you'd want to confirm this action
    toast.success('Result removed')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
  }

  if (processedImages.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <ImageIcon className="h-5 w-5 mr-2 text-primary-600" />
          Results
        </h2>
        
        <div className="text-center text-gray-500 py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-sm font-medium mb-2">No Results Yet</h3>
          <p className="text-xs">Process an image to see results here</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <ImageIcon className="h-5 w-5 mr-2 text-primary-600" />
            Results ({processedImages.length})
          </h2>
          
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="btn-ghost text-sm"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <div className="p-4 space-y-3">
          {processedImages.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`border rounded-lg p-3 transition-all cursor-pointer ${
                selectedResult === index
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
              onClick={() => setSelectedResult(selectedResult === index ? null : index)}
            >
              <div className="flex items-center space-x-3">
                {/* Thumbnail */}
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={result.url}
                    alt={result.type}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {result.type}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(result.createdAt)}</span>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDownload(result)
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Download"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleShare(result)
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Share"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {selectedResult === index && showDetails && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-3 pt-3 border-t border-gray-200"
                  >
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Filename:</span>
                        <span className="font-medium text-gray-900 truncate ml-2">
                          {result.filename}
                        </span>
                      </div>
                      
                      {result.metadata && (
                        <>
                          {result.metadata.original_size && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Original Size:</span>
                              <span className="font-medium text-gray-900">
                                {result.metadata.original_size[0]} × {result.metadata.original_size[1]}
                              </span>
                            </div>
                          )}
                          
                          {result.metadata.cropped_size && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">New Size:</span>
                              <span className="font-medium text-gray-900">
                                {result.metadata.cropped_size[0]} × {result.metadata.cropped_size[1]}
                              </span>
                            </div>
                          )}
                          
                          {result.metadata.confidence && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Confidence:</span>
                              <span className="font-medium text-gray-900">
                                {(result.metadata.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDownload(result)
                        }}
                        className="btn-primary text-xs py-1 px-3 flex items-center space-x-1"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleCopyUrl(result)
                        }}
                        className="btn-outline text-xs py-1 px-3 flex items-center space-x-1"
                      >
                        <Copy className="h-3 w-3" />
                        <span>Copy URL</span>
                      </button>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(result.url, '_blank')
                        }}
                        className="btn-ghost text-xs py-1 px-3 flex items-center space-x-1"
                      >
                        <ExternalLink className="h-3 w-3" />
                        <span>Open</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      {processedImages.length > 1 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex space-x-2">
            <button
              onClick={() => {
                processedImages.forEach(result => handleDownload(result))
              }}
              className="btn-outline text-sm flex items-center space-x-1 flex-1"
            >
              <Download className="h-4 w-4" />
              <span>Download All</span>
            </button>
            
            <button
              onClick={() => {
                toast.success('All results cleared')
              }}
              className="btn-ghost text-sm flex items-center space-x-1"
            >
              <Trash2 className="h-4 w-4" />
              <span>Clear All</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ResultsPanel
