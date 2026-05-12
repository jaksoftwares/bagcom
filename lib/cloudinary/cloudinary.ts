// Cloudinary configuration and upload functions
const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  width: number
  height: number
  format: string
  resource_type: string
}

export const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResult> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET)
  formData.append('folder', 'bagcom-marketplace')

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error)
    throw error
  }
}

export const uploadMultipleToCloudinary = async (files: File[]): Promise<CloudinaryUploadResult[]> => {
  const uploadPromises = files.map(file => uploadToCloudinary(file))
  
  try {
    const results = await Promise.all(uploadPromises)
    return results
  } catch (error) {
    console.error('Error uploading multiple images:', error)
    throw error
  }
}

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    // Note: For security reasons, deletion should be handled on the backend
    // This is a placeholder for the frontend implementation
    console.log('Delete image with public_id:', publicId)
    
    // In a real implementation, you would call your backend API
    // which would handle the Cloudinary deletion using the Admin API
    const response = await fetch('/api/delete-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ publicId }),
    })

    if (!response.ok) {
      throw new Error('Failed to delete image')
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error)
    throw error
  }
}

export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number
    height?: number
    quality?: 'auto' | number
    format?: 'auto' | 'webp' | 'jpg' | 'png'
    crop?: 'fill' | 'fit' | 'scale' | 'crop'
  } = {}
): string => {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'fill'
  } = options

  let transformations = []

  if (width || height) {
    let sizeTransform = `c_${crop}`
    if (width) sizeTransform += `,w_${width}`
    if (height) sizeTransform += `,h_${height}`
    transformations.push(sizeTransform)
  }

  if (quality) {
    transformations.push(`q_${quality}`)
  }

  if (format) {
    transformations.push(`f_${format}`)
  }

  const transformString = transformations.length > 0 ? `/${transformations.join(',')}` : ''

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload${transformString}/${publicId}`
}

// Utility function to extract public_id from Cloudinary URL
export const extractPublicIdFromUrl = (url: string): string => {
  const parts = url.split('/')
  const uploadIndex = parts.findIndex(part => part === 'upload')
  
  if (uploadIndex === -1) {
    throw new Error('Invalid Cloudinary URL')
  }

  // Get everything after 'upload' and any transformations
  const pathAfterUpload = parts.slice(uploadIndex + 1)
  
  // Remove version if present (starts with 'v' followed by numbers)
  const pathWithoutVersion = pathAfterUpload.filter(part => !/^v\d+$/.test(part))
  
  // Join the remaining parts and remove file extension
  const publicIdWithExtension = pathWithoutVersion.join('/')
  const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '')
  
  return publicId
}

// Image validation
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload JPEG, PNG, WebP, or GIF images.'
    }
  }

  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size too large. Please upload images smaller than 10MB.'
    }
  }

  return { isValid: true }
}

// Batch validation for multiple files
export const validateImageFiles = (files: File[]): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  const maxFiles = 5

  if (files.length > maxFiles) {
    errors.push(`Too many files. Maximum ${maxFiles} images allowed.`)
  }

  files.forEach((file, index) => {
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      errors.push(`File ${index + 1}: ${validation.error}`)
    }
  })

  return {
    isValid: errors.length === 0,
    errors
  }
}