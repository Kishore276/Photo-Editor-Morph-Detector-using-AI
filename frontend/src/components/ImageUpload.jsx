import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import { 
  Upload, 
  Image as ImageIcon, 
  X, 
  FileImage,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

import { useImage } from '../context/ImageContext'
import { apiService, utils } from '../services/api'

const ImageUpload = ({ disabled = false }) => {
  const { addUploadedImage, setProcessing } = useImage()
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    if (disabled) return

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      rejectedFiles.forEach(({ file, errors }) => {
        errors.forEach(error => {
          if (error.code === 'file-too-large') {
            toast.error(`File ${file.name} is too large. Maximum size is 50MB.`)
          } else if (error.code === 'file-invalid-type') {
            toast.error(`File ${file.name} is not a supported image format.`)
          } else {
            toast.error(`Error with file ${file.name}: ${error.message}`)
          }
        })
      })
    }

    // Handle accepted files
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0] // Only handle first file for now
      
      try {
        // Validate file
        utils.validateImageFile(file)
        
        setIsUploading(true)
        setUploadProgress(0)
        
        // Upload file
        const result = await apiService.uploadImage(file, (progress) => {
          setUploadProgress(progress)
        })
        
        // Add to context
        const imageData = {
          id: result.image_id,
          filename: result.filename,
          size: result.size,
          format: result.format,
          url: apiService.getImageUrl(result.url),
          uploadTime: new Date().toISOString(),
          fileSize: file.size
        }
        
        addUploadedImage(imageData)
        toast.success(`Image uploaded successfully!`)
        
      } catch (error) {
        console.error('Upload error:', error)
        toast.error(error.message || 'Failed to upload image')
      } finally {
        setIsUploading(false)
        setUploadProgress(0)
      }
    }
  }, [disabled, addUploadedImage])

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    isDragAccept
  } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
    disabled: disabled || isUploading
  })

  const getDropzoneStyle = () => {
    if (disabled) return 'border-gray-200 bg-gray-50 cursor-not-allowed'
    if (isDragReject) return 'border-red-500 bg-red-50'
    if (isDragAccept) return 'border-green-500 bg-green-50'
    if (isDragActive) return 'border-primary-500 bg-primary-50'
    return 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
  }

  const getDropzoneIcon = () => {
    if (disabled) return <AlertCircle className="h-12 w-12 text-gray-400" />
    if (isDragReject) return <X className="h-12 w-12 text-red-500" />
    if (isDragAccept) return <CheckCircle className="h-12 w-12 text-green-500" />
    if (isUploading) return <Upload className="h-12 w-12 text-primary-500 animate-bounce" />
    return <ImageIcon className="h-12 w-12 text-gray-400" />
  }

  const getDropzoneText = () => {
    if (disabled) return 'Upload disabled - Backend not available'
    if (isDragReject) return 'File type not supported'
    if (isDragAccept) return 'Drop to upload'
    if (isUploading) return 'Uploading...'
    if (isDragActive) return 'Drop your image here'
    return 'Drag & drop an image, or click to select'
  }

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Upload className="h-5 w-5 mr-2 text-primary-600" />
        Upload Image
      </h2>

      <motion.div
        {...getRootProps()}
        whileHover={!disabled && !isUploading ? { scale: 1.02 } : {}}
        whileTap={!disabled && !isUploading ? { scale: 0.98 } : {}}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer
          ${getDropzoneStyle()}
        `}
      >
        <input {...getInputProps()} />
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {getDropzoneIcon()}
          
          <div>
            <p className="text-lg font-medium text-gray-700 mb-2">
              {getDropzoneText()}
            </p>
            
            {!disabled && !isUploading && (
              <p className="text-sm text-gray-500">
                Supports JPEG, PNG, WebP up to 50MB
              </p>
            )}
          </div>

          {/* Upload Progress */}
          <AnimatePresence>
            {isUploading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                <div className="progress-bar">
                  <motion.div
                    className="progress-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {uploadProgress}% uploaded
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Upload Tips */}
      {!disabled && (
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
            <FileImage className="h-4 w-4 mr-1" />
            Tips for best results:
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Use high-resolution images (1080p or higher)</li>
            <li>• Ensure good lighting and clear subjects</li>
            <li>• Avoid heavily compressed or low-quality images</li>
            <li>• Square or landscape orientations work best</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default ImageUpload
