// Create a new file for storage service with fallbacks
import { storage, isServicesAvailable, ensureFirebaseInitialized } from "./firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

// Check if Firebase Storage is available
const isStorageAvailable = () => {
  // Try to initialize Firebase if it hasn't been initialized yet
  ensureFirebaseInitialized()

  // Check if Storage is available
  return isServicesAvailable && !!storage
}

// Function to convert file to Base64 for localStorage fallback
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })
}

// Function to upload a file
export const uploadFile = async (file: File, path: string): Promise<string> => {
  // Generate a unique filename
  const filename = `${path}/${Date.now()}-${file.name}`

  // Try to use Firebase Storage first
  if (isStorageAvailable()) {
    try {
      const storageRef = ref(storage, filename)
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      // Also save to localStorage as fallback
      try {
        const base64 = await fileToBase64(file)
        const storedFiles = JSON.parse(localStorage.getItem("storedFiles") || "{}")
        storedFiles[filename] = {
          url: downloadURL,
          base64,
          type: file.type,
          name: file.name,
          size: file.size,
          date: new Date().toISOString(),
        }
        localStorage.setItem("storedFiles", JSON.stringify(storedFiles))
      } catch (e) {
        console.warn("Failed to save file to localStorage:", e)
      }

      return downloadURL
    } catch (error) {
      console.error("Error uploading to Firebase Storage:", error)
      // Fall back to localStorage
    }
  }

  // Fallback to localStorage
  console.log("Using localStorage fallback for file storage")
  try {
    const base64 = await fileToBase64(file)

    // Store file info in localStorage
    const storedFiles = JSON.parse(localStorage.getItem("storedFiles") || "{}")
    storedFiles[filename] = {
      url: filename, // Use the filename as the URL
      base64,
      type: file.type,
      name: file.name,
      size: file.size,
      date: new Date().toISOString(),
    }
    localStorage.setItem("storedFiles", JSON.stringify(storedFiles))

    return filename // Return the filename as the URL
  } catch (e) {
    console.error("Error storing file in localStorage:", e)
    throw new Error("Failed to store file. Storage is not available.")
  }
}

// Function to get a file URL
export const getFileURL = async (path: string): Promise<string> => {
  // Try to use Firebase Storage first
  if (isStorageAvailable()) {
    try {
      const storageRef = ref(storage, path)
      return await getDownloadURL(storageRef)
    } catch (error) {
      console.error("Error getting file from Firebase Storage:", error)
      // Fall back to localStorage
    }
  }

  // Fallback to localStorage
  try {
    const storedFiles = JSON.parse(localStorage.getItem("storedFiles") || "{}")
    if (storedFiles[path]) {
      return storedFiles[path].base64
    }
  } catch (e) {
    console.error("Error getting file from localStorage:", e)
  }

  // If all else fails, return a placeholder
  return "/placeholder.svg?height=200&width=200"
}

// Function to delete a file
export const deleteFile = async (path: string): Promise<void> => {
  // Try to delete from localStorage first
  try {
    const storedFiles = JSON.parse(localStorage.getItem("storedFiles") || "{}")
    if (storedFiles[path]) {
      delete storedFiles[path]
      localStorage.setItem("storedFiles", JSON.stringify(storedFiles))
    }
  } catch (e) {
    console.error("Error deleting file from localStorage:", e)
  }

  // Try to delete from Firebase Storage if available
  if (isStorageAvailable()) {
    try {
      const storageRef = ref(storage, path)
      await deleteFile(path)
    } catch (error) {
      console.error("Error deleting file from Firebase Storage:", error)
      // Already deleted from localStorage above
    }
  }
}

