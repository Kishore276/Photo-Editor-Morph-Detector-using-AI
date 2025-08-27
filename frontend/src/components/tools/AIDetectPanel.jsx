import React from 'react'
import { motion } from 'framer-motion'
import { 
  Eye, 
  Brain, 
  Camera, 
  Cpu,
  Info,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'

const AIDetectPanel = ({ disabled = false }) => {
  return (
    <div className="space-y-6">
      {/* Detection Info */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl mb-4">
          <Eye className="h-8 w-8 text-white" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          AI Image Detection
        </h3>
        
        <p className="text-gray-600 text-sm">
          Analyze your image to determine if it was created by AI or captured with a camera.
        </p>
      </div>

      {/* Detection Process */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
          <Brain className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-900">Neural Analysis</h4>
            <p className="text-xs text-blue-700">Advanced AI model analyzes image patterns</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
          <Camera className="h-5 w-5 text-green-600" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-green-900">Real Photo Detection</h4>
            <p className="text-xs text-green-700">Identifies camera artifacts and natural patterns</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
          <Cpu className="h-5 w-5 text-purple-600" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-purple-900">AI Generation Signs</h4>
            <p className="text-xs text-purple-700">Detects AI-specific generation artifacts</p>
          </div>
        </div>
      </div>

      {/* Confidence Levels */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Confidence Levels</h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">High (80%+)</span>
            </div>
            <span className="text-xs text-green-700">Very reliable result</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-900">Medium (60-80%)</span>
            </div>
            <span className="text-xs text-yellow-700">Moderately confident</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-900">Low (&lt; 60%)</span>
            </div>
            <span className="text-xs text-red-700">Uncertain result</span>
          </div>
        </div>
      </div>

      {/* Model Information */}
      <div className="p-4 bg-orange-50 rounded-lg">
        <h3 className="text-sm font-medium text-orange-900 mb-2 flex items-center">
          <Info className="h-4 w-4 mr-1" />
          How AI Detection Works:
        </h3>
        <ul className="text-sm text-orange-800 space-y-1">
          <li>• Analyzes pixel patterns and compression artifacts</li>
          <li>• Detects AI-specific generation signatures</li>
          <li>• Compares against known AI model characteristics</li>
          <li>• Provides confidence score with detailed analysis</li>
        </ul>
      </div>

      {/* Supported Formats */}
      <div>
        <h4 className="text-sm font-medium text-gray-900 mb-3">Supported Image Types</h4>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <div className="text-sm font-medium text-gray-900 mb-1">Real Photos</div>
            <div className="text-xs text-gray-600">DSLR, smartphone, webcam</div>
          </div>
          
          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <div className="text-sm font-medium text-gray-900 mb-1">AI Generated</div>
            <div className="text-xs text-gray-600">DALL-E, Midjourney, Stable Diffusion</div>
          </div>
        </div>
      </div>

      {/* Detection Tips */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Tips for Best Results:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Use high-resolution images when possible</li>
          <li>• Avoid heavily compressed or edited images</li>
          <li>• Original files work better than screenshots</li>
          <li>• Multiple images can provide more confidence</li>
        </ul>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <button
          disabled={disabled}
          className={`w-full btn-primary flex items-center justify-center space-x-2 ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Eye className="h-4 w-4" />
          <span>Analyze Image</span>
        </button>
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Analysis typically takes 2-5 seconds
          </p>
        </div>
      </div>
    </div>
  )
}

export default AIDetectPanel
