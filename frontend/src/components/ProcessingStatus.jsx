import React from 'react'
import { motion } from 'framer-motion'
import { 
  Loader2, 
  X, 
  CheckCircle, 
  AlertCircle,
  Clock,
  Zap
} from 'lucide-react'

const ProcessingStatus = ({ step, progress, onCancel, error = null }) => {
  const getStepIcon = (stepName) => {
    if (error) return AlertCircle
    if (progress === 100) return CheckCircle
    return Loader2
  }

  const getStepColor = () => {
    if (error) return 'text-red-500'
    if (progress === 100) return 'text-green-500'
    return 'text-primary-500'
  }

  const Icon = getStepIcon(step)

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
          <Zap className="h-5 w-5 mr-2 text-primary-600" />
          Processing
        </h2>
        
        {onCancel && (
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Cancel Processing"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Current Step */}
        <div className="flex items-center space-x-3">
          <motion.div
            animate={progress < 100 && !error ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className={getStepColor()}
          >
            <Icon className="h-6 w-6" />
          </motion.div>
          
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">
              {error ? 'Processing Failed' : step || 'Processing...'}
            </h3>
            <p className="text-sm text-gray-600">
              {error 
                ? error 
                : progress === 100 
                ? 'Completed successfully!' 
                : 'Please wait while we process your image...'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {!error && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">{progress}%</span>
            </div>
            
            <div className="progress-bar">
              <motion.div
                className="progress-fill"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>
        )}

        {/* Processing Steps */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Processing Steps:</h4>
          
          <div className="space-y-1 text-sm">
            {[
              { name: 'Loading image', completed: progress > 0 },
              { name: 'AI analysis', completed: progress > 25 },
              { name: 'Processing', completed: progress > 50 },
              { name: 'Finalizing', completed: progress > 75 },
              { name: 'Complete', completed: progress === 100 }
            ].map((stepItem, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  stepItem.completed 
                    ? 'bg-green-500' 
                    : progress > index * 20 
                    ? 'bg-primary-500 animate-pulse' 
                    : 'bg-gray-300'
                }`} />
                <span className={stepItem.completed ? 'text-green-700' : 'text-gray-600'}>
                  {stepItem.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Estimated Time */}
        {progress < 100 && !error && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="h-4 w-4" />
            <span>Estimated time remaining: {Math.max(1, Math.round((100 - progress) / 10))} seconds</span>
          </div>
        )}

        {/* Tips */}
        {progress < 100 && !error && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Tip:</strong> Processing time depends on image size and complexity. 
              Larger images may take longer to process.
            </p>
          </div>
        )}

        {/* Error Actions */}
        {error && (
          <div className="flex space-x-2">
            <button
              onClick={onCancel}
              className="btn-outline flex-1"
            >
              Close
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary flex-1"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProcessingStatus
