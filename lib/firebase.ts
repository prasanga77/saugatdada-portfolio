// Improve Firebase initialization to handle errors better
import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore, enableIndexedDbPersistence } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
let firebaseApp: FirebaseApp | null = null
let firestoreDb: Firestore | null = null
let firebaseStorage = null
let firebaseAuth = null
let isConfigured = false
let initializationAttempted = false

// Check if we're in the browser environment
const isBrowser = typeof window !== "undefined"

// Check if Firebase is properly configured
const checkFirebaseConfig = () => {
  // Check if all required Firebase config values are available
  const requiredKeys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
  return requiredKeys.every(
    (key) =>
      firebaseConfig[key as keyof typeof firebaseConfig] !== undefined &&
      firebaseConfig[key as keyof typeof firebaseConfig] !== null &&
      firebaseConfig[key as keyof typeof firebaseConfig] !== "",
  )
}

// Function to initialize Firebase services
const initializeFirebase = () => {
  if (!isBrowser || initializationAttempted) return false

  initializationAttempted = true

  try {
    // Check if Firebase config is valid
    isConfigured = checkFirebaseConfig()

    if (!isConfigured) {
      console.warn("Firebase configuration is incomplete. Using local storage fallback.")
      return false
    }

    console.log("Firebase configuration is valid, initializing services...")

    // Initialize Firebase app first
    try {
      // Check if Firebase is already initialized
      if (!getApps().length) {
        firebaseApp = initializeApp(firebaseConfig)
        console.log("Firebase app initialized successfully")
      } else {
        firebaseApp = getApps()[0]
        console.log("Using existing Firebase app")
      }
    } catch (appError) {
      console.error("Error initializing Firebase app:", appError)
      firebaseApp = null
      return false
    }

    // Only proceed if app initialization was successful
    if (!firebaseApp) {
      console.error("Firebase app initialization failed")
      return false
    }

    // Initialize Auth first
    try {
      firebaseAuth = getAuth(firebaseApp)
      console.log("Firebase Auth initialized successfully")
    } catch (authError) {
      console.error("Error initializing Firebase Auth:", authError)
      firebaseAuth = null
    }

    // Initialize Firestore
    try {
      firestoreDb = getFirestore(firebaseApp)

      // Enable offline persistence (will catch and handle errors internally)
      if (firestoreDb) {
        enableIndexedDbPersistence(firestoreDb).catch((err) => {
          if (err.code === "failed-precondition") {
            console.warn("Firestore persistence could not be enabled: multiple tabs open")
          } else if (err.code === "unimplemented") {
            console.warn("Firestore persistence is not available in this browser")
          } else {
            console.error("Error enabling Firestore persistence:", err)
          }
        })
      }

      console.log("Firestore initialized successfully")
    } catch (firestoreError) {
      console.error("Error initializing Firestore:", firestoreError)
      firestoreDb = null
    }

    // Initialize Storage - with better error handling
    try {
      // Check if Storage is enabled in the Firebase project
      if (firebaseConfig.storageBucket) {
        firebaseStorage = getStorage(firebaseApp)
        console.log("Firebase Storage initialized successfully")
      } else {
        console.warn("Firebase Storage bucket not configured. Storage will not be available.")
        firebaseStorage = null
      }
    } catch (storageError) {
      console.error("Error initializing Firebase Storage:", storageError)
      console.warn("Firebase Storage will not be available. This is okay if you're not using Storage features.")
      firebaseStorage = null
    }

    // Return true if at least one service was initialized successfully
    return !!firebaseAuth || !!firestoreDb || !!firebaseStorage
  } catch (error) {
    console.error("Firebase initialization error:", error)
    // Set services to null if initialization fails
    firebaseApp = null
    firestoreDb = null
    firebaseStorage = null
    firebaseAuth = null
    isConfigured = false
    return false
  }
}

// Initialize Firebase
const isInitialized = initializeFirebase()

// Export a function to check if all Firebase services are available
const areFirebaseServicesAvailable = () => {
  return isConfigured && !!firebaseApp && (!!firestoreDb || !!firebaseStorage || !!firebaseAuth) // At least one service should be available
}

// Lazy initialization function that can be called before using Firebase services
export const ensureFirebaseInitialized = () => {
  if (!initializationAttempted) {
    return initializeFirebase()
  }
  return isInitialized
}

export const app = firebaseApp
export const db = firestoreDb
export const storage = firebaseStorage
export const auth = firebaseAuth
export const isFirebaseConfigured = isConfigured
export const isServicesAvailable = areFirebaseServicesAvailable()

