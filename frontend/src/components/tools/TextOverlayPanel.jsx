import React from 'react'
import { motion } from 'framer-motion'
import { SketchPicker } from 'react-color'
import { 
  Type, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Palette,
  Eye,
  Info,
  Sliders
} from 'lucide-react'

import { useImage } from '../../context/ImageContext'

const TextOverlayPanel = ({ disabled = false }) => {
  const { settings, updateSettings, updateTextStyle } = useImage()

  const placementOptions = [
    { value: 'auto', label: 'Auto', icon: Eye, description: 'AI chooses best position' },
    { value: 'center', label: 'Center', icon: AlignCenter, description: 'Center of image' },
    { value: 'top', label: 'Top', icon: AlignCenter, description: 'Top center' },
    { value: 'bottom', label: 'Bottom', icon: AlignCenter, description: 'Bottom center' },
    { value: 'top-left', label: 'Top Left', icon: AlignLeft, description: 'Upper left corner' },
    { value: 'top-right', label: 'Top Right', icon: AlignRight, description: 'Upper right corner' },
    { value: 'bottom-left', label: 'Bottom Left', icon: AlignLeft, description: 'Lower left corner' },
    { value: 'bottom-right', label: 'Bottom Right', icon: AlignRight, description: 'Lower right corner' }
  ]

  const fontSizePresets = [
    { value: 24, label: 'Small' },
    { value: 36, label: 'Medium' },
    { value: 48, label: 'Large' },
    { value: 64, label: 'X-Large' },
    { value: 96, label: 'XXL' }
  ]

  const handleTextChange = (e) => {
    updateSettings({ textOverlay: e.target.value })
  }

  const handleFontSizeChange = (size) => {
    updateTextStyle({ fontSize: size })
  }

  const handlePlacementChange = (placement) => {
    updateTextStyle({ placement })
  }

  const handleFontColorChange = (color) => {
    const rgb = [color.rgb.r, color.rgb.g, color.rgb.b]
    updateTextStyle({ fontColor: rgb })
  }

  const handleAutoContrastChange = (e) => {
    updateTextStyle({ autoContrast: e.target.checked })
  }

  const fontColorRgb = {
    r: settings.textStyle.fontColor[0],
    g: settings.textStyle.fontColor[1],
    b: settings.textStyle.fontColor[2]
  }

  return (
    <div className="space-y-6">
      {/* Text Input */}
      <div>
        <label className="label flex items-center">
          <Type className="h-4 w-4 mr-2" />
          Text Content
        </label>
        
        <textarea
          value={settings.textOverlay}
          onChange={handleTextChange}
          disabled={disabled}
          placeholder="Enter your text here..."
          className="input min-h-[80px] resize-none mt-2"
          rows={3}
        />
        
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{settings.textOverlay.length} characters</span>
          <span>Keep it short for best results</span>
        </div>
      </div>

      {/* Font Size */}
      <div>
        <label className="label flex items-center">
          <Sliders className="h-4 w-4 mr-2" />
          Font Size
        </label>
        
        <div className="mt-2">
          <div className="flex items-center space-x-4 mb-3">
            <input
              type="range"
              min="12"
              max="120"
              step="4"
              value={settings.textStyle.fontSize}
              onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
              disabled={disabled}
              className="flex-1"
            />
            <div className="min-w-[60px] text-sm font-medium text-gray-900">
              {settings.textStyle.fontSize}px
            </div>
          </div>
          
          <div className="flex space-x-2">
            {fontSizePresets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handleFontSizeChange(preset.value)}
                disabled={disabled}
                className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                  settings.textStyle.fontSize === preset.value
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : disabled
                    ? 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Text Placement */}
      <div>
        <label className="label flex items-center">
          <AlignCenter className="h-4 w-4 mr-2" />
          Text Placement
        </label>
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          {placementOptions.map((option) => {
            const Icon = option.icon
            const isSelected = settings.textStyle.placement === option.value
            
            return (
              <button
                key={option.value}
                onClick={() => handlePlacementChange(option.value)}
                disabled={disabled}
                className={`p-3 rounded-lg border text-left transition-colors ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : disabled
                    ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Icon className={`h-4 w-4 ${
                    isSelected ? 'text-primary-600' : 'text-gray-400'
                  }`} />
                  <span className="font-medium text-sm">{option.label}</span>
                </div>
                <p className="text-xs text-gray-600">{option.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Font Color */}
      <div>
        <label className="label flex items-center">
          <Palette className="h-4 w-4 mr-2" />
          Font Color
        </label>
        
        <div className="mt-2">
          <div className="flex items-center space-x-3 mb-3">
            <div 
              className="w-8 h-8 rounded-lg border-2 border-gray-300"
              style={{ 
                backgroundColor: `rgb(${fontColorRgb.r}, ${fontColorRgb.g}, ${fontColorRgb.b})` 
              }}
            />
            <span className="text-sm text-gray-600">
              RGB({fontColorRgb.r}, {fontColorRgb.g}, {fontColorRgb.b})
            </span>
          </div>
          
          {!disabled && (
            <SketchPicker
              color={fontColorRgb}
              onChange={handleFontColorChange}
              disableAlpha
              width="100%"
            />
          )}
        </div>

        {/* Color Presets */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Quick Colors:</p>
          <div className="flex space-x-2">
            {[
              { name: 'White', rgb: [255, 255, 255] },
              { name: 'Black', rgb: [0, 0, 0] },
              { name: 'Red', rgb: [239, 68, 68] },
              { name: 'Blue', rgb: [59, 130, 246] },
              { name: 'Green', rgb: [34, 197, 94] },
              { name: 'Yellow', rgb: [251, 191, 36] }
            ].map((preset) => (
              <button
                key={preset.name}
                onClick={() => updateTextStyle({ fontColor: preset.rgb })}
                disabled={disabled}
                className="w-8 h-8 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors"
                style={{ backgroundColor: `rgb(${preset.rgb.join(', ')})` }}
                title={preset.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Auto Contrast */}
      <div className="flex items-center space-x-3">
        <input
          type="checkbox"
          id="auto-contrast"
          checked={settings.textStyle.autoContrast}
          onChange={handleAutoContrastChange}
          disabled={disabled}
          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
        />
        <label htmlFor="auto-contrast" className="text-sm text-gray-700">
          Auto-adjust color for better contrast
        </label>
      </div>

      {/* Text Overlay Info */}
      <div className="p-4 bg-green-50 rounded-lg">
        <h3 className="text-sm font-medium text-green-900 mb-2 flex items-center">
          <Info className="h-4 w-4 mr-1" />
          Smart Text Features:
        </h3>
        <ul className="text-sm text-green-800 space-y-1">
          <li>• Auto placement avoids covering main subjects</li>
          <li>• Automatic contrast adjustment for readability</li>
          <li>• Option to place text behind subjects</li>
          <li>• Outline and shadow effects for better visibility</li>
        </ul>
      </div>

      {/* Advanced Options */}
      <details className="group">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors">
          Advanced Options
        </summary>
        
        <div className="mt-3 space-y-4 pl-4 border-l-2 border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="behind-subject"
              disabled={disabled}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="behind-subject" className="text-sm text-gray-700">
              Place text behind main subject
            </label>
          </div>
          
          <div>
            <label className="label">Text Opacity</label>
            <input
              type="range"
              min="50"
              max="255"
              step="5"
              defaultValue="255"
              disabled={disabled}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="label">Outline Width</label>
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              defaultValue="2"
              disabled={disabled}
              className="w-full"
            />
          </div>
        </div>
      </details>
    </div>
  )
}

export default TextOverlayPanel
