import { db, isServicesAvailable, ensureFirebaseInitialized } from "./firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

export interface SectionVisibilitySettings {
  hero: boolean
  about: boolean
  experience: boolean
  education: boolean
  publications: boolean
  trainings: boolean
  skills: boolean
  blog: boolean
  contact: boolean
}

// Default settings - all sections visible
const defaultSettings: SectionVisibilitySettings = {
  hero: true,
  about: true,
  experience: true,
  education: true,
  publications: true,
  trainings: true,
  skills: true,
  blog: true,
  contact: true,
}

// Get section visibility settings
export const getSectionVisibility = async (): Promise<SectionVisibilitySettings> => {
  try {
    // Try to get from localStorage first
    const localData = localStorage.getItem("sectionVisibility")
    if (localData) {
      return JSON.parse(localData)
    }
  } catch (e) {
    console.error("Error reading from localStorage:", e)
  }

  // Initialize Firebase if needed
  ensureFirebaseInitialized()

  if (!isServicesAvailable) {
    console.log("Firebase services are not available, using default section visibility settings")
    return defaultSettings
  }

  try {
    const docRef = doc(db, "settings", "sectionVisibility")
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const data = docSnap.data() as SectionVisibilitySettings
      // Save to localStorage for future use
      localStorage.setItem("sectionVisibility", JSON.stringify(data))
      return data
    } else {
      // If no settings exist yet, create default settings
      await setDoc(docRef, defaultSettings)
      localStorage.setItem("sectionVisibility", JSON.stringify(defaultSettings))
      return defaultSettings
    }
  } catch (error) {
    console.error("Error getting section visibility settings:", error)
    return defaultSettings
  }
}

// Update section visibility settings
export const updateSectionVisibility = async (settings: SectionVisibilitySettings): Promise<void> => {
  // Always save to localStorage
  try {
    localStorage.setItem("sectionVisibility", JSON.stringify(settings))
  } catch (e) {
    console.error("Error saving to localStorage:", e)
  }

  // Initialize Firebase if needed
  ensureFirebaseInitialized()

  if (!isServicesAvailable) {
    console.log("Firebase services are not available, updated section visibility in localStorage only")
    return
  }

  try {
    const docRef = doc(db, "settings", "sectionVisibility")
    await setDoc(docRef, settings)
  } catch (error) {
    console.error("Error updating section visibility settings:", error)
    // Already saved to localStorage above
  }
}

