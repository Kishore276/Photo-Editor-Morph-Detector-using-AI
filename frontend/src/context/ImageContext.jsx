import React, { createContext, useContext, useReducer } from 'react'

const ImageContext = createContext()

const initialState = {
  currentImage: null,
  uploadedImages: [],
  processedImages: [],
  results: {},
  isProcessing: false,
  processingStep: null,
  processingProgress: 0,
  selectedTool: null,
  settings: {
    aspectRatio: '1:1',
    outpaintSettings: {
      extensionFactor: 1.5,
      customPrompt: ''
    },
    cropSettings: {
      paddingColor: [255, 255, 255]
    }
  }
}

function imageReducer(state, action) {
  switch (action.type) {
    case 'SET_CURRENT_IMAGE':
      return {
        ...state,
        currentImage: action.payload
      }
    
    case 'ADD_UPLOADED_IMAGE':
      return {
        ...state,
        uploadedImages: [...state.uploadedImages, action.payload],
        currentImage: action.payload
      }
    
    case 'ADD_PROCESSED_IMAGE':
      return {
        ...state,
        processedImages: [...state.processedImages, action.payload]
      }
    
    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload.isProcessing,
        processingStep: action.payload.step || null,
        processingProgress: action.payload.progress || 0
      }
    
    case 'UPDATE_PROCESSING_PROGRESS':
      return {
        ...state,
        processingProgress: action.payload
      }
    
    case 'SET_SELECTED_TOOL':
      return {
        ...state,
        selectedTool: action.payload
      }
    
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      }
    
    case 'UPDATE_TEXT_STYLE':
      return {
        ...state,
        settings: {
          ...state.settings,
          textStyle: {
            ...state.settings.textStyle,
            ...action.payload
          }
        }
      }
    
    case 'UPDATE_OUTPAINT_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          outpaintSettings: {
            ...state.settings.outpaintSettings,
            ...action.payload
          }
        }
      }
    
    case 'UPDATE_CROP_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          cropSettings: {
            ...state.settings.cropSettings,
            ...action.payload
          }
        }
      }

    case 'SET_RESULTS':
      return {
        ...state,
        results: {
          ...state.results,
          [action.payload.toolId]: action.payload.result
        }
      }

    case 'CLEAR_IMAGES':
      return {
        ...state,
        currentImage: null,
        uploadedImages: [],
        processedImages: []
      }
    
    case 'RESET_PROCESSING':
      return {
        ...state,
        isProcessing: false,
        processingStep: null,
        processingProgress: 0
      }
    
    default:
      return state
  }
}

export function ImageProvider({ children }) {
  const [state, dispatch] = useReducer(imageReducer, initialState)

  const actions = {
    setCurrentImage: (image) => {
      dispatch({ type: 'SET_CURRENT_IMAGE', payload: image })
    },
    
    addUploadedImage: (image) => {
      dispatch({ type: 'ADD_UPLOADED_IMAGE', payload: image })
    },
    
    addProcessedImage: (image) => {
      dispatch({ type: 'ADD_PROCESSED_IMAGE', payload: image })
    },
    
    setProcessing: (isProcessing, step = null, progress = 0) => {
      dispatch({ 
        type: 'SET_PROCESSING', 
        payload: { isProcessing, step, progress } 
      })
    },
    
    updateProcessingProgress: (progress) => {
      dispatch({ type: 'UPDATE_PROCESSING_PROGRESS', payload: progress })
    },
    
    setSelectedTool: (tool) => {
      dispatch({ type: 'SET_SELECTED_TOOL', payload: tool })
    },
    
    updateSettings: (settings) => {
      dispatch({ type: 'UPDATE_SETTINGS', payload: settings })
    },
    
    updateTextStyle: (style) => {
      dispatch({ type: 'UPDATE_TEXT_STYLE', payload: style })
    },
    
    updateOutpaintSettings: (settings) => {
      dispatch({ type: 'UPDATE_OUTPAINT_SETTINGS', payload: settings })
    },
    
    updateCropSettings: (settings) => {
      dispatch({ type: 'UPDATE_CROP_SETTINGS', payload: settings })
    },

    setResults: (toolId, result) => {
      dispatch({ type: 'SET_RESULTS', payload: { toolId, result } })
    },

    clearImages: () => {
      dispatch({ type: 'CLEAR_IMAGES' })
    },

    resetProcessing: () => {
      dispatch({ type: 'RESET_PROCESSING' })
    }
  }

  const value = {
    ...state,
    ...actions
  }

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  )
}

export function useImage() {
  const context = useContext(ImageContext)
  if (!context) {
    throw new Error('useImage must be used within an ImageProvider')
  }
  return context
}

export default ImageContext
