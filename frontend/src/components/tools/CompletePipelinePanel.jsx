import React from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, 
  ArrowRight, 
  Eye, 
  Crop, 
  Expand, 
  Type,
  Settings,
  Info,
  Clock
} from 'lucide-react'

import { useImage } from '../../context/ImageContext'

const CompletePipelinePanel = ({ disabled = false }) => {
  const { settings } = useImage()

  const pipelineSteps = [
    {
      id: 'ai-detect',
      name: 'AI Detection',
      icon: Eye,
      description: 'Analyze if image is AI-generated',
      color: 'from-orange-500 to-red-500',
      estimatedTime: '2-5s'
    },
    {
      id: 'smart-crop',
      name: 'Smart Crop',
      icon: Crop,
      description: `Crop to ${settings.aspectRatio} aspect ratio`,
      color: 'from-blue-500 to-cyan-500',
      estimatedTime: '3-8s'
    },
    {
      id: 'outpaint',
      name: 'Outpainting',
      icon: Expand,
      description: `Extend image by ${settings.outpaintSettings.extensionFactor}x`,
      color: 'from-purple-500 to-pink-500',
      estimatedTime: '15-30s'
    },
    {
      id: 'text-overlay',
      name: 'Text Overlay',
      icon: Type,
      description: settings.textOverlay ? `Add "${settings.textOverlay}"` : 'Skip (no text)',
      color: 'from-green-500 to-emerald-500',
      estimatedTime: '2-5s',
      optional: !settings.textOverlay
    }
  ]

  const totalEstimatedTime = pipelineSteps.reduce((total, step) => {
    if (step.optional) return total
    const timeRange = step.estimatedTime.split('-')
    const avgTime = (parseInt(timeRange[0]) + parseInt(timeRange[1])) / 2
    return total + avgTime
  }, 0)

  return (
    <div className="space-y-6">
      {/* Pipeline Overview */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl mb-4">
          <Zap className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Complete Pipeline
        </h3>
        
        <p className="text-gray-600 text-sm mb-4">
          Run all AI tools in sequence for comprehensive image preparation.
        </p>
        
        <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm">
          <Clock className="h-4 w-4" />
          <span>Est. {Math.round(totalEstimatedTime)}s total</span>
        </div>
      </div>

      {/* Pipeline Steps */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Processing Steps:</h4>
        
        {pipelineSteps.map((step, index) => {
          const Icon = step.icon
          const isLast = index === pipelineSteps.length - 1
          
          return (
            <div key={step.id} className="relative">
              <div className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                step.optional 
                  ? 'border-dashed border-gray-300 bg-gray-50 opacity-75' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                <div className={`p-2 rounded-lg bg-gradient-to-r ${step.color} flex-shrink-0`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h5 className="font-medium text-gray-900">
                      {step.name}
                      {step.optional && (
                        <span className="ml-2 text-xs text-gray-500">(Optional)</span>
                      )}
                    </h5>
                    <span className="text-xs text-gray-500">{step.estimatedTime}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{step.description}</p>
                </div>
                
                <div className="text-gray-400">
                  <span className="text-lg font-bold">{index + 1}</span>
                </div>
              </div>
              
              {!isLast && (
                <div className="flex justify-center py-2">
                  <ArrowRight className="h-4 w-4 text-gray-400" />
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Current Settings Summary */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          Current Settings
        </h4>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Aspect Ratio:</span>
            <span className="font-medium text-gray-900">{settings.aspectRatio}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Extension Factor:</span>
            <span className="font-medium text-gray-900">{settings.outpaintSettings.extensionFactor}x</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Text Overlay:</span>
            <span className="font-medium text-gray-900">
              {settings.textOverlay ? `"${settings.textOverlay.substring(0, 20)}${settings.textOverlay.length > 20 ? '...' : ''}"` : 'None'}
            </span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-600">Font Size:</span>
            <span className="font-medium text-gray-900">{settings.textStyle.fontSize}px</span>
          </div>
        </div>
      </div>

      {/* Pipeline Benefits */}
      <div className="p-4 bg-indigo-50 rounded-lg">
        <h3 className="text-sm font-medium text-indigo-900 mb-2 flex items-center">
          <Info className="h-4 w-4 mr-1" />
          Pipeline Benefits:
        </h3>
        <ul className="text-sm text-indigo-800 space-y-1">
          <li>• Comprehensive analysis and processing</li>
          <li>• Optimized workflow for social media</li>
          <li>• Consistent quality across all steps</li>
          <li>• Single click for complete transformation</li>
        </ul>
      </div>

      {/* Advanced Pipeline Options */}
      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
          Advanced Pipeline Options
        </summary>
        
        <div className="mt-3 space-y-4 pl-4 border-l-2 border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="save-intermediates"
              defaultChecked
              disabled={disabled}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="save-intermediates" className="text-sm text-gray-700">
              Save intermediate results
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="skip-on-error"
              defaultChecked
              disabled={disabled}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="skip-on-error" className="text-sm text-gray-700">
              Continue pipeline if step fails
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="optimize-quality"
              defaultChecked
              disabled={disabled}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="optimize-quality" className="text-sm text-gray-700">
              Optimize for quality over speed
            </label>
          </div>
        </div>
      </details>

      {/* Run Pipeline Button */}
      <div className="space-y-3">
        <button
          disabled={disabled}
          className={`w-full btn-primary flex items-center justify-center space-x-2 py-3 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Zap className="h-5 w-5" />
          <span>Run Complete Pipeline</span>
        </button>
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            This will process your image through all selected steps
          </p>
        </div>
      </div>
    </div>
  )
}

export default CompletePipelinePanel
