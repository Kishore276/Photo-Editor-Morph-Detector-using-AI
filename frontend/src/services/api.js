import axios from 'axios'
import toast from 'react-hot-toast'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  timeout: 300000, // 5 minutes for AI processing
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add any auth headers here if needed
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const message = error.response?.data?.detail || error.message || 'An error occurred'
    
    // Don't show toast for certain errors (let components handle them)
    if (!error.config?.skipErrorToast) {
      toast.error(message)
    }
    
    return Promise.reject(error)
  }
)

// API endpoints
export const apiService = {
  // Health check
  async healthCheck() {
    try {
      const response = await api.get('/health')
      return response.data
    } catch (error) {
      throw new Error('Backend service is not available')
    }
  },

  // Upload image
  async uploadImage(file, onProgress) {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            onProgress(progress)
          }
        },
      })
      
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to upload image')
    }
  },

  // Smart crop
  async smartCrop(imageId, aspectRatio = '1:1', paddingColor = '255,255,255') {
    const formData = new FormData()
    formData.append('image_id', imageId)
    formData.append('aspect_ratio', aspectRatio)
    formData.append('padding_color', paddingColor)

    try {
      const response = await api.post('/smart-crop', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Smart crop failed')
    }
  },

  // Outpaint image
  async outpaintImage(imageId, extensionFactor = 1.5, customPrompt = null) {
    const formData = new FormData()
    formData.append('image_id', imageId)
    formData.append('extension_factor', extensionFactor.toString())
    if (customPrompt) {
      formData.append('custom_prompt', customPrompt)
    }

    try {
      const response = await api.post('/outpaint', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Outpainting failed')
    }
  },

  // Remove background
  async removeBackground(imageId) {
    try {
      const response = await api.post(`/remove-background/${imageId}`)
      console.log('Background removal response:', response.data)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Background removal failed')
    }
  },

  // AI detection
  async detectAI(imageId) {
    const formData = new FormData()
    formData.append('image_id', imageId)

    try {
      const response = await api.post('/ai-detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'AI detection failed')
    }
  },

  // Morph detection
  async detectMorph(imageId) {
    const formData = new FormData()
    formData.append('image_id', imageId)

    try {
      const response = await api.post('/morph-detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Morph detection failed')
    }
  },

  // Complete processing pipeline
  async processComplete(imageId, options = {}) {
    const {
      aspectRatio = '1:1',
      textOverlay = null,
      extensionFactor = 1.3,
      textStyle = null
    } = options

    const requestData = {
      image_id: imageId,
      aspect_ratio: aspectRatio,
      text_overlay: textOverlay,
      extension_factor: extensionFactor,
      text_style: textStyle
    }

    try {
      const response = await api.post('/process-complete', requestData)
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Complete processing failed')
    }
  },

  // Get image URL
  getImageUrl(path) {
    if (!path) {
      return null
    }
    if (path.startsWith('http')) {
      return path
    }
    return `${api.defaults.baseURL}${path}`
  },

    // Download image
  async downloadImage(url, filename) {
    try {
      console.log('Download request:', { url, filename })
      
      // If the URL contains a filename that could be downloaded via our download endpoint
      let downloadUrl = url
      
      // Check if this is one of our processed images
      if (url.includes('/uploads/') && (url.includes('.png') || url.includes('.jpg') || url.includes('.jpeg'))) {
        // Extract filename from URL
        const urlParts = url.split('/')
        const file = urlParts[urlParts.length - 1]
        // Use our download endpoint which sets proper headers
        downloadUrl = `/api/download/${file}`
        console.log('Using download endpoint:', downloadUrl)
      }
      
      const response = await api.get(downloadUrl, {
        responseType: 'blob',
      })
      
      console.log('Download response:', response.status, response.headers)
      
      // Create download link
      const blob = new Blob([response.data])
      const objectUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = objectUrl
      link.download = filename
      
      // Add to DOM, click, then remove
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(objectUrl)
      
      console.log('Download completed successfully')
      return true
    } catch (error) {
      console.error('Download error:', error)
      throw new Error('Failed to download image')
    }
  }
}

// Utility functions
export const utils = {
  // Format file size
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  },

  // Validate image file
  validateImageFile(file) {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 50 * 1024 * 1024 // 50MB
    
    if (!validTypes.includes(file.type)) {
      throw new Error('Please upload a valid image file (JPEG, PNG, or WebP)')
    }
    
    if (file.size > maxSize) {
      throw new Error('File size must be less than 50MB')
    }
    
    return true
  },

  // Generate unique ID
  generateId() {
    return Math.random().toString(36).substr(2, 9)
  },

  // Color array to string
  colorArrayToString(colorArray) {
    return colorArray.join(',')
  },

  // String to color array
  stringToColorArray(colorString) {
    return colorString.split(',').map(Number)
  },

  // Debounce function
  debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  // Throttle function
  throttle(func, limit) {
    let inThrottle
    return function() {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }
}

export default api
