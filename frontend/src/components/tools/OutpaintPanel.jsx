import React from 'react'
import { motion } from 'framer-motion'
import {
  Expand,
  Zap,
  Palette,
  Image as ImageIcon,
  Info,
  Sliders
} from 'lucide-react'

import { useImage } from '../../context/ImageContext'

const OutpaintPanel = ({ disabled = false }) => {
  const { settings, updateOutpaintSettings } = useImage()

  const extensionPresets = [
    { value: 1.2, label: 'Subtle (1.2x)', description: 'Small extension for minor adjustments' },
    { value: 1.5, label: 'Moderate (1.5x)', description: 'Balanced extension for most use cases' },
    { value: 2.0, label: 'Large (2.0x)', description: 'Significant extension for dramatic changes' },
    { value: 2.5, label: 'Maximum (2.5x)', description: 'Maximum extension for creative effects' }
  ]

  const promptPresets = [
    { 
      value: '', 
      label: 'Auto-Generated', 
      description: 'Let AI analyze and extend naturally' 
    },
    { 
      value: 'seamless natural background, high quality, detailed', 
      label: 'Natural Background', 
      description: 'Extend with natural, realistic backgrounds' 
    },
    { 
      value: 'studio background, professional lighting, clean', 
      label: 'Studio Style', 
      description: 'Clean, professional studio-like extension' 
    },
    { 
      value: 'artistic background, creative, stylized', 
      label: 'Artistic Style', 
      description: 'Creative and artistic background extension' 
    },
    { 
      value: 'minimalist background, simple, clean lines', 
      label: 'Minimalist', 
      description: 'Simple, clean minimalist extension' 
    }
  ]

  const handleExtensionFactorChange = (factor) => {
    updateOutpaintSettings({ extensionFactor: factor })
  }

  const handleCustomPromptChange = (e) => {
    updateOutpaintSettings({ customPrompt: e.target.value })
  }

  const handlePromptPresetSelect = (prompt) => {
    updateOutpaintSettings({ customPrompt: prompt })
  }

  return (
    <div className="space-y-6">
      {/* Extension Factor */}
      <div>
        <label className="label flex items-center">
          <Expand className="h-4 w-4 mr-2" />
          Extension Factor
        </label>
        
        <div className="mt-2">
          <div className="flex items-center space-x-4 mb-4">
            <input
              type="range"
              min="1.1"
              max="3.0"
              step="0.1"
              value={settings.outpaintSettings.extensionFactor}
              onChange={(e) => handleExtensionFactorChange(parseFloat(e.target.value))}
              disabled={disabled}
              className="flex-1"
            />
            <div className="min-w-[60px] text-sm font-medium text-gray-900">
              {settings.outpaintSettings.extensionFactor.toFixed(1)}x
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {extensionPresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handleExtensionFactorChange(preset.value)}
                disabled={disabled}
                className={`p-2 rounded-lg border text-left text-sm transition-colors ${
                  Math.abs(settings.outpaintSettings.extensionFactor - preset.value) < 0.05
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : disabled
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">{preset.label}</div>
                <div className="text-xs text-gray-600 mt-1">{preset.description}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Prompt */}
      <div>
        <label className="label flex items-center">
          <Zap className="h-4 w-4 mr-2" />
          Style Prompt
        </label>
        
        <div className="mt-2 space-y-3">
          {/* Prompt Presets */}
          <div className="grid grid-cols-1 gap-2">
            {promptPresets.map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePromptPresetSelect(preset.value)}
                disabled={disabled}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  settings.outpaintSettings.customPrompt === preset.value
                    ? 'border-primary-500 bg-primary-50'
                    : disabled
                    ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium text-gray-900 mb-1">{preset.label}</div>
                <div className="text-sm text-gray-600">{preset.description}</div>
              </button>
            ))}
          </div>
          
          {/* Custom Prompt Input */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              Or enter custom prompt:
            </label>
            <textarea
              value={settings.outpaintSettings.customPrompt}
              onChange={handleCustomPromptChange}
              disabled={disabled}
              placeholder="Describe the style and content you want for the extended areas..."
              className="input min-h-[80px] resize-none"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty for automatic style detection
            </p>
          </div>
        </div>
      </div>

      {/* Quality Settings */}
      <div>
        <label className="label flex items-center">
          <Sliders className="h-4 w-4 mr-2" />
          Quality Settings
        </label>
        
        <div className="mt-2 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-700">Inference Steps</span>
              <span className="text-sm text-gray-500">20</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              step="5"
              defaultValue="20"
              disabled={disabled}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Faster</span>
              <span>Higher Quality</span>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-700">Guidance Scale</span>
              <span className="text-sm text-gray-500">7.5</span>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              defaultValue="7.5"
              disabled={disabled}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Creative</span>
              <span>Precise</span>
            </div>
          </div>
        </div>
      </div>

      {/* Outpainting Info */}
      <div className="p-4 bg-purple-50 rounded-lg">
        <h3 className="text-sm font-medium text-purple-900 mb-2 flex items-center">
          <Info className="h-4 w-4 mr-1" />
          How Outpainting Works:
        </h3>
        <ul className="text-sm text-purple-800 space-y-1">
          <li>• AI analyzes your image style and content</li>
          <li>• Generates seamless extensions beyond original borders</li>
          <li>• Maintains consistent lighting and perspective</li>
          <li>• Higher extension factors take longer to process</li>
        </ul>
      </div>

      {/* Advanced Options */}
      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
          Advanced Options
        </summary>
        
        <div className="mt-3 space-y-4 pl-4 border-l-2 border-gray-200">
          <div>
            <label className="label">Seed (for reproducible results)</label>
            <input
              type="number"
              placeholder="Random"
              disabled={disabled}
              className="input"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="preserve-aspect"
              defaultChecked
              disabled={disabled}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="preserve-aspect" className="text-sm text-gray-700">
              Preserve original aspect ratio
            </label>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enhance-details"
              defaultChecked
              disabled={disabled}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="enhance-details" className="text-sm text-gray-700">
              Enhance fine details
            </label>
          </div>
        </div>
      </details>
    </div>
  )
}

export default OutpaintPanel
