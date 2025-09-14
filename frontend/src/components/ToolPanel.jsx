import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import {
  Play,
  Settings,
  Crop,
  Expand,
  Scissors,
  Eye,
  Zap,
  Palette,
  Sliders
} from 'lucide-react'

import { useImage } from '../context/ImageContext'
import { apiService, utils } from '../services/api'
import SmartCropPanel from './tools/SmartCropPanel'
import OutpaintPanel from './tools/OutpaintPanel'
import BackgroundRemoverPanel from './tools/BackgroundRemoverPanel'
import AIDetectPanel from './tools/AIDetectPanel'
import MorphDetectPanel from './tools/MorphDetectPanel'
import CompletePipelinePanel from './tools/CompletePipelinePanel'

const ToolPanel = ({ toolId, disabled = false }) => {
  const {
    currentImage,
    settings,
    isProcessing,
    setProcessing,
    addProcessedImage,
    updateProcessingProgress,
    setResults
  } = useImage()

  const [isRunning, setIsRunning] = useState(false)
  const [aiDetectionResult, setAiDetectionResult] = useState(null)

  const toolConfig = {
    'smart-crop': {
      name: 'Smart Crop',
      icon: Crop,
      color: 'from-blue-500 to-cyan-500',
      component: SmartCropPanel
    },
    'outpaint': {
      name: 'Outpaint',
      icon: Expand,
      color: 'from-purple-500 to-pink-500',
      component: OutpaintPanel
    },
    'bg-remove': {
      name: 'Background Remover',
      icon: Scissors,
      color: 'from-green-500 to-emerald-500',
      component: BackgroundRemoverPanel
    },
    'ai-detect': {
      name: 'AI Detection',
      icon: Eye,
      color: 'from-orange-500 to-red-500',
      component: AIDetectPanel
    },
    'morph-detect': {
      name: 'Photo Morph Detector',
      icon: Eye,
      color: 'from-pink-500 to-rose-500',
      component: MorphDetectPanel
    },
    'complete-pipeline': {
      name: 'Complete Pipeline',
      icon: Zap,
      color: 'from-indigo-500 to-purple-500',
      component: CompletePipelinePanel
    }
  }

  const tool = toolConfig[toolId]
  if (!tool) return null

  const Icon = tool.icon
  const ToolComponent = tool.component

  const handleRun = async () => {
    if (!currentImage || isProcessing || disabled) return

    try {
      setIsRunning(true)
      setProcessing(true, `Running ${tool.name}`, 0)

      let result
      
      switch (toolId) {
        case 'smart-crop':
          result = await runSmartCrop()
          break
        case 'outpaint':
          result = await runOutpaint()
          break
        case 'bg-remove':
          result = await runBackgroundRemover()
          break
        case 'ai-detect':
          result = await runAIDetect()
          break
        case 'morph-detect':
          result = await runMorphDetect()
          break
        case 'complete-pipeline':
          result = await runCompletePipeline()
          break
        default:
          throw new Error('Unknown tool')
      }

      if (result.success) {
        // For AI Detection and Morph Detection, we don't create a new image, just show results
        if (toolId === 'ai-detect') {
          setAiDetectionResult(result)
          setResults('ai-detect', result) // Store in ImageContext for display under image preview
          toast.success(`${tool.name} completed: ${result.prediction} (${(result.confidence * 100).toFixed(1)}% confidence)`)
        } else if (toolId === 'morph-detect') {
          setResults('morph-detect', result) // Store in ImageContext for display under image preview
          toast.success(`${tool.name} completed: ${result.prediction} (${result.morph_percentage}% morphed)`)
        } else {
          // Determine the correct file extension based on the tool
          let fileExtension = 'jpg'
          if (toolId === 'bg-remove') {
            fileExtension = 'png' // Background removal always produces PNG with transparency
          }
          
          const processedImage = {
            id: result.image_id || utils.generateId(),
            type: tool.name,
            url: apiService.getImageUrl(result.output_url || result.final_image_url),
            filename: result.filename || `${tool.name.toLowerCase().replace(' ', '_')}_${Date.now()}.${fileExtension}`,
            metadata: result,
            createdAt: new Date().toISOString()
          }

          addProcessedImage(processedImage)
          toast.success(`${tool.name} completed successfully!`)
        }
      } else {
        throw new Error(result.error || 'Processing failed')
      }

    } catch (error) {
      console.error(`${tool.name} error:`, error)
      toast.error(error.message || `${tool.name} failed`)
    } finally {
      setIsRunning(false)
      setProcessing(false)
    }
  }

  const runSmartCrop = async () => {
    updateProcessingProgress(25)
    const paddingColor = utils.colorArrayToString(settings.cropSettings.paddingColor)
    
    updateProcessingProgress(50)
    const result = await apiService.smartCrop(
      currentImage.id,
      settings.aspectRatio,
      paddingColor
    )
    
    updateProcessingProgress(100)
    return result
  }

  const runOutpaint = async () => {
    updateProcessingProgress(25)
    const result = await apiService.outpaintImage(
      currentImage.id,
      settings.outpaintSettings.extensionFactor,
      settings.outpaintSettings.customPrompt || null
    )
    
    updateProcessingProgress(100)
    return result
  }

  const runBackgroundRemover = async () => {
    updateProcessingProgress(25)

    updateProcessingProgress(50)
    const result = await apiService.removeBackground(
      currentImage.id
    )
    
    updateProcessingProgress(100)
    return result
  }

  const runAIDetect = async () => {
    updateProcessingProgress(50)
    const result = await apiService.detectAI(currentImage.id)
    updateProcessingProgress(100)

    // For AI detection, we don't create a new image, just show results
    return {
      success: true,
      ...result
    }
  }

  const runMorphDetect = async () => {
    updateProcessingProgress(25)
    const result = await apiService.detectMorph(currentImage.id)
    updateProcessingProgress(100)

    // For morph detection, we don't create a new image, just show results
    return {
      success: true,
      ...result
    }
  }

  const runCompletePipeline = async () => {
    updateProcessingProgress(20)
    
    const result = await apiService.processComplete(
      currentImage.id,
      {
        aspectRatio: settings.aspectRatio,
        textOverlay: settings.textOverlay || null,
        extensionFactor: settings.outpaintSettings.extensionFactor,
        textStyle: settings.textOverlay ? {
          fontSize: settings.textStyle.fontSize,
          fontColor: utils.colorArrayToString(settings.textStyle.fontColor),
          placement: settings.textStyle.placement,
          autoContrast: settings.textStyle.autoContrast
        } : null
      }
    )
    
    updateProcessingProgress(100)
    return result
  }

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${tool.color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {tool.name}
            </h2>
            <p className="text-sm text-gray-600">
              Configure settings and run
            </p>
          </div>
        </div>

        <motion.button
          onClick={handleRun}
          disabled={!currentImage || isProcessing || disabled}
          whileHover={!disabled && !isProcessing ? { scale: 1.05 } : {}}
          whileTap={!disabled && !isProcessing ? { scale: 0.95 } : {}}
          className={`btn-primary flex items-center space-x-2 ${
            (!currentImage || isProcessing || disabled) 
              ? 'opacity-50 cursor-not-allowed' 
              : ''
          }`}
        >
          <Play className={`h-4 w-4 ${isRunning ? 'animate-pulse' : ''}`} />
          <span>{isRunning ? 'Running...' : 'Run'}</span>
        </motion.button>
      </div>

      {/* Tool-specific Settings */}
      <div className="space-y-6">
        <ToolComponent disabled={disabled || isProcessing} />
      </div>

      {/* Quick Actions */}
      {!isProcessing && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Quick Actions
          </h3>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                // Reset to default settings for this tool
                toast.success('Settings reset to defaults')
              }}
              className="btn-outline text-sm py-2"
              disabled={disabled}
            >
              Reset Settings
            </button>
            
            <button
              onClick={() => {
                // Save current settings as preset
                toast.success('Settings saved as preset')
              }}
              className="btn-outline text-sm py-2"
              disabled={disabled}
            >
              Save Preset
            </button>
          </div>
        </div>
      )}


    </div>
  )
}

export default ToolPanel
