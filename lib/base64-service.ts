// Base64 storage service for small images
// This is a lightweight alternative to Firebase Storage

// Maximum size for Base64 storage (in bytes)
const MAX_SIZE = 1 * 1024 * 1024 // 1MB

// Function to convert file to Base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

// Function to store a small image in Firestore as Base64
export const storeImageAsBase64 = async (file: File): Promise<string> => {
  if (file.size > MAX_SIZE) {
    throw new Error(`File size exceeds maximum of ${MAX_SIZE / 1024 / 1024}MB for Base64 storage`)
  }

  try {
    // Convert to Base64
    const base64 = await fileToBase64(file)
    return base64
  } catch (error) {
    console.error("Error converting file to Base64:", error)
    throw new Error("Failed to convert file to Base64")
  }
}

// Function to compress an image before converting to Base64
export const compressImage = async (file: File, maxWidth = 800, quality = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = URL.createObjectURL(file)

    img.onload = () => {
      const canvas = document.createElement("canvas")
      let width = img.width
      let height = img.height

      // Calculate new dimensions
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }

      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext("2d")
      ctx?.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas to Blob conversion failed"))
            return
          }

          const newFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          })

          resolve(newFile)
        },
        file.type,
        quality,
      )
    }

    img.onerror = () => {
      reject(new Error("Error loading image"))
    }
  })
}

// Function to check if a string is a Base64 image
export const isBase64Image = (str: string): boolean => {
  return str?.startsWith("data:image/")
}

// Function to store Base64 images in localStorage as a fallback
export const storeBase64InLocalStorage = (key: string, base64: string): void => {
  try {
    localStorage.setItem(key, base64)
  } catch (error) {
    console.error("Error storing Base64 in localStorage:", error)
  }
}

// Function to retrieve Base64 images from localStorage
export const getBase64FromLocalStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error("Error retrieving Base64 from localStorage:", error)
    return null
  }
}

