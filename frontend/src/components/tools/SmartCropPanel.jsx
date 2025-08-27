import React from 'react'
import { motion } from 'framer-motion'
import { SketchPicker } from 'react-color'
import { 
  Crop, 
  Square, 
  Monitor, 
  Smartphone,
  Palette,
  Info
} from 'lucide-react'

import { useImage } from '../../context/ImageContext'

const SmartCropPanel = ({ disabled = false }) => {
  const { settings, updateSettings, updateCropSettings } = useImage()

  const aspectRatios = [
    { value: '1:1', label: 'Square (1:1)', icon: Square, description: 'Instagram posts, profile pictures' },
    { value: '16:9', label: 'Landscape (16:9)', icon: Monitor, description: 'YouTube thumbnails, banners' },
    { value: '9:16', label: 'Portrait (9:16)', icon: Smartphone, description: 'Instagram stories, TikTok' },
    { value: '4:3', label: 'Standard (4:3)', icon: Monitor, description: 'Traditional photos' },
    { value: '3:2', label: 'Photo (3:2)', icon: Monitor, description: 'DSLR standard' },
    { value: '21:9', label: 'Ultrawide (21:9)', icon: Monitor, description: 'Cinematic format' }
  ]

  const handleAspectRatioChange = (ratio) => {
    updateSettings({ aspectRatio: ratio })
  }

  const handlePaddingColorChange = (color) => {
    const rgb = [color.rgb.r, color.rgb.g, color.rgb.b]
    updateCropSettings({ paddingColor: rgb })
  }

  const paddingColorRgb = {
    r: settings.cropSettings.paddingColor[0],
    g: settings.cropSettings.paddingColor[1],
    b: settings.cropSettings.paddingColor[2]
  }

  return (
    <div className="space-y-6">
      {/* Aspect Ratio Selection */}
      <div>
        <label className="label flex items-center">
          <Crop className="h-4 w-4 mr-2" />
          Target Aspect Ratio
        </label>
        
        <div className="grid grid-cols-1 gap-3 mt-2">
          {aspectRatios.map((ratio) => {
            const Icon = ratio.icon
            const isSelected = settings.aspectRatio === ratio.value
            
            return (
              <motion.button
                key={ratio.value}
                onClick={() => handleAspectRatioChange(ratio.value)}
                disabled={disabled}
                whileHover={!disabled ? { scale: 1.02 } : {}}
                whileTap={!disabled ? { scale: 0.98 } : {}}
                className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : disabled
                    ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <Icon className={`h-5 w-5 mt-0.5 ${
                    isSelected ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 mb-1">
                      {ratio.label}
                    </div>
                    <div className="text-sm text-gray-600">
                      {ratio.description}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2" />
                  )}
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Padding Color */}
      <div>
        <label className="label flex items-center">
          <Palette className="h-4 w-4 mr-2" />
          Padding Color
        </label>
        
        <div className="mt-2">
          <div className="flex items-center space-x-3 mb-3">
            <div 
              className="w-8 h-8 rounded-lg border-2 border-gray-300 cursor-pointer"
              style={{ 
                backgroundColor: `rgb(${paddingColorRgb.r}, ${paddingColorRgb.g}, ${paddingColorRgb.b})` 
              }}
            />
            <span className="text-sm text-gray-600">
              RGB({paddingColorRgb.r}, {paddingColorRgb.g}, {paddingColorRgb.b})
            </span>
          </div>
          
          {!disabled && (
            <div className="relative">
              <SketchPicker
                color={paddingColorRgb}
                onChange={handlePaddingColorChange}
                disableAlpha
                width="100%"
              />
            </div>
          )}
        </div>

        {/* Color Presets */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Quick Colors:</p>
          <div className="flex space-x-2">
            {[
              { name: 'White', rgb: [255, 255, 255] },
              { name: 'Black', rgb: [0, 0, 0] },
              { name: 'Gray', rgb: [128, 128, 128] },
              { name: 'Blue', rgb: [59, 130, 246] },
              { name: 'Green', rgb: [34, 197, 94] }
            ].map((preset) => (
              <button
                key={preset.name}
                onClick={() => updateCropSettings({ paddingColor: preset.rgb })}
                disabled={disabled}
                className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                style={{ backgroundColor: `rgb(${preset.rgb.join(', ')})` }}
                title={preset.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Smart Crop Info */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
          <Info className="h-4 w-4 mr-1" />
          How Smart Crop Works:
        </h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Detects main subjects using AI object detection</li>
          <li>• Preserves important content when cropping</li>
          <li>• Uses padding instead of cutting when subjects would be lost</li>
          <li>• Automatically centers subjects in the frame</li>
        </ul>
      </div>

      {/* Advanced Options */}
      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
          Advanced Options
        </summary>
        
        <div className="mt-3 space-y-4 pl-4 border-l-2 border-gray-200">
          <div>
            <label className="label">Detection Confidence</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              defaultValue="0.5"
              disabled={disabled}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="preserve-quality"
              defaultChecked
              disabled={disabled}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="preserve-quality" className="text-sm text-gray-700">
              Preserve image quality
            </label>
          </div>
        </div>
      </details>
    </div>
  )
}

export default SmartCropPanel
