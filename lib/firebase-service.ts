// Import necessary Firebase modules
import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  type Timestamp,
  Firestore,
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  Auth,
} from "firebase/auth";

// Define types
export interface AboutData {
  bio: string;
  highlights: string[];
}

export interface HeroData {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  showScrollIndicator: boolean;
}

export interface ExperienceData {
  id?: string;
  title: string;
  company: string;
  period: string;
  description: string;
  order: number;
}

export interface EducationData {
  id?: string;
  degree: string;
  institution: string;
  location: string;
  years: string;
  order: number;
}

export interface PublicationData {
  id?: string;
  title: string;
  event: string;
  date: string;
  location: string;
  type: string;
  pdfLink?: string;
  color?: string;
  icon?: string;
  order: number;
}

export interface TrainingData {
  id?: string;
  title: string;
  date: string;
  location: string;
  icon?: string;
  order: number;
}

export interface SkillData {
  id?: string;
  name: string;
  level?: number;
  type: "technical" | "personal";
  icon?: string;
  order: number;
}

export interface BlogPostData {
  id?: string;
  title: string;
  content: string;
  date: Timestamp | Date;
  author: string;
  imageUrl?: string;
  excerpt: string;
  published: boolean;
}

export interface MessageData {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date?: Timestamp | Date | string;
  read?: boolean;
}

export interface SectionVisibilitySettings {
  hero: boolean;
  about: boolean;
  experience: boolean;
  education: boolean;
  publications: boolean;
  trainings: boolean;
  skills: boolean;
  blog: boolean;
  contact: boolean;
}

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app;
let db: Firestore | undefined;
let auth: Auth | undefined;

const isBrowser = typeof window !== "undefined";

if (isBrowser) {
  try {
    if (!getApps().length) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.error("Error initializing Firebase:", error);
  }
}

// Helper function to check if Firebase is available
export const isServicesAvailable = (): boolean => {
  return isBrowser && !!db;
};

// Helper function to ensure Firebase is initialized
export const ensureFirebaseInitialized = (): boolean => {
  return isServicesAvailable();
};

// Default settings for section visibility
const defaultVisibilitySettings: SectionVisibilitySettings = {
  hero: true,
  about: true,
  experience: true,
  education: true,
  publications: true,
  trainings: true,
  skills: true,
  blog: true,
  contact: true,
};

export const getSectionVisibility = async (): Promise<SectionVisibilitySettings> => {
  if (!isServicesAvailable()) {
    try {
      const localData = localStorage.getItem("sectionVisibility");
      if (localData) {
        return JSON.parse(localData) as SectionVisibilitySettings;
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
    return defaultVisibilitySettings;
  }

  try {
    const docRef = doc(db!, "settings", "sectionVisibility");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as SectionVisibilitySettings;
      localStorage.setItem("sectionVisibility", JSON.stringify(data));
      return data;
    } else {
      await setDoc(docRef, defaultVisibilitySettings);
      localStorage.setItem("sectionVisibility", JSON.stringify(defaultVisibilitySettings));
      return defaultVisibilitySettings;
    }
  } catch (error) {
    console.error("Error getting section visibility settings:", error);
    return defaultVisibilitySettings;
  }
};

export const updateSectionVisibility = async (settings: SectionVisibilitySettings): Promise<void> => {
  try {
    localStorage.setItem("sectionVisibility", JSON.stringify(settings));
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }

  if (!isServicesAvailable() || !db) {
    return;
  }

  try {
    const docRef = doc(db, "settings", "sectionVisibility");
    await setDoc(docRef, settings);
  } catch (error) {
    console.error("Error updating section visibility settings:", error);
  }
};

// Helper function for Firebase operations with better error handling
export const handleFirebaseOperation = async <T>(
  operation: () => Promise<T>,
  fallbackOperation: () => T | Promise<T>,
  errorMessage: string
): Promise<T> => {
  if (!isServicesAvailable() || !db) {
    console.log("Firebase services not available, using fallback");
    return await fallbackOperation();
  }

  try {
    return await operation();
  } catch (error) {
    console.error(`${errorMessage}:`, error);
    console.log("Using fallback operation");
    return await fallbackOperation();
  }
};

// Hero Section
export const getHeroData = async (): Promise<HeroData> => {
  const defaultData: HeroData = {
    title: "Dr. Saugat Bhandari",
    subtitle: "MBBS",
    description:
      "Looking forward to work as a medical professional, gain experience and learn as well as provide my help to the institution.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    showScrollIndicator: true,
  };

  if (!isServicesAvailable()) {
    try {
      const localData = localStorage.getItem("heroData");
      if (localData) {
        return JSON.parse(localData) as HeroData;
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
    return defaultData;
  }

  try {
    const docRef = doc(db!, "data", "hero");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as HeroData;
      localStorage.setItem("heroData", JSON.stringify(data));
      return data;
    } else {
      await setDoc(docRef, defaultData);
      localStorage.setItem("heroData", JSON.stringify(defaultData));
      return defaultData;
    }
  } catch (error) {
    console.error("Error getting hero data:", error);
    return defaultData;
  }
};

export const updateHeroData = async (data: HeroData): Promise<void> => {
  try {
    localStorage.setItem("heroData", JSON.stringify(data));
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }

  if (!isServicesAvailable() || !db) {
    return;
  }

  try {
    const docRef = doc(db, "data", "hero");
    await setDoc(docRef, data);
  } catch (error) {
    console.error("Error updating hero data:", error);
  }
};

// About Section
export const getAboutData = async (): Promise<AboutData> => {
  const defaultData: AboutData = { bio: "", highlights: [] };

  if (!isServicesAvailable()) {
    try {
      const localData = localStorage.getItem("aboutData");
      if (localData) {
        return JSON.parse(localData) as AboutData;
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
    return defaultData;
  }

  try {
    const docRef = doc(db!, "data", "about");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as AboutData;
      localStorage.setItem("aboutData", JSON.stringify(data));
      return data;
    } else {
      await setDoc(docRef, defaultData);
      localStorage.setItem("aboutData", JSON.stringify(defaultData));
      return defaultData;
    }
  } catch (error) {
    console.error("Error getting about data:", error);
    return defaultData;
  }
};

export const updateAboutData = async (data: AboutData): Promise<void> => {
  try {
    localStorage.setItem("aboutData", JSON.stringify(data));
  } catch (e) {
    console.error("Error saving to localStorage:", e);
  }

  if (!isServicesAvailable() || !db) {
    return;
  }

  try {
    const docRef = doc(db, "data", "about");
    await setDoc(docRef, data);
  } catch (error) {
    console.error("Error updating about data:", error);
  }
};

// Experience Section
export const getExperiences = async (): Promise<ExperienceData[]> => {
  if (!isServicesAvailable()) {
    try {
      const localData = localStorage.getItem("experiences");
      if (localData) {
        return JSON.parse(localData) as ExperienceData[];
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
    return [];
  }

  try {
    const experiencesCollection = collection(db!, "experiences");
    const q = query(experiencesCollection, orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const experiences: ExperienceData[] = [];
    querySnapshot.forEach((doc) => {
      experiences.push({ id: doc.id, ...doc.data() } as ExperienceData);
    });
    localStorage.setItem("experiences", JSON.stringify(experiences));
    return experiences;
  } catch (error) {
    console.error("Error getting experiences:", error);
    return [];
  }
};

export const addExperience = async (experience: ExperienceData): Promise<string> => {
  try {
    const experiences: ExperienceData[] = JSON.parse(localStorage.getItem("experiences") || "[]");
    const newId = `local_${Date.now()}`;
    const newExperience = { ...experience, id: newId };
    experiences.push(newExperience);
    localStorage.setItem("experiences", JSON.stringify(experiences));

    if (!isServicesAvailable() || !db) {
      return newId;
    }

    const experiencesCollection = collection(db, "experiences");
    const docRef = await addDoc(experiencesCollection, experience);

    const updatedExperiences = experiences.map((exp: ExperienceData) =>
      exp.id === newId ? { ...exp, id: docRef.id } : exp
    );
    localStorage.setItem("experiences", JSON.stringify(updatedExperiences));

    return docRef.id;
  } catch (error) {
    console.error("Error adding experience:", error);
    return "";
  }
};

export const updateExperience = async (id: string, experience: ExperienceData): Promise<void> => {
  try {
    const experiences: ExperienceData[] = JSON.parse(localStorage.getItem("experiences") || "[]");
    const updatedExperiences = experiences.map((exp: ExperienceData) =>
      exp.id === id ? { ...experience, id } : exp
    );
    localStorage.setItem("experiences", JSON.stringify(updatedExperiences));

    if (!isServicesAvailable() || !db) {
      return;
    }

    const experienceDoc = doc(db, "experiences", id);
    await updateDoc(experienceDoc, { ...experience });
  } catch (error) {
    console.error("Error updating experience:", error);
  }
};

export const deleteExperience = async (id: string): Promise<void> => {
  try {
    const experiences: ExperienceData[] = JSON.parse(localStorage.getItem("experiences") || "[]");
    const filteredExperiences = experiences.filter((exp: ExperienceData) => exp.id !== id);
    localStorage.setItem("experiences", JSON.stringify(filteredExperiences));

    if (!isServicesAvailable() || !db) {
      return;
    }

    const experienceDoc = doc(db, "experiences", id);
    await deleteDoc(experienceDoc);
  } catch (error) {
    console.error("Error deleting experience:", error);
  }
};

// Education Section
export const getEducation = async (): Promise<EducationData[]> => {
  if (!isServicesAvailable()) {
    try {
      const localData = localStorage.getItem("education");
      if (localData) {
        return JSON.parse(localData) as EducationData[];
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
    return [];
  }

  try {
    const educationCollection = collection(db!, "education");
    const q = query(educationCollection, orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const education: EducationData[] = [];
    querySnapshot.forEach((doc) => {
      education.push({ id: doc.id, ...doc.data() } as EducationData);
    });
    localStorage.setItem("education", JSON.stringify(education));
    return education;
  } catch (error) {
    console.error("Error getting education:", error);
    return [];
  }
};

export const addEducation = async (education: EducationData): Promise<string> => {
  try {
    const educationList: EducationData[] = JSON.parse(localStorage.getItem("education") || "[]");
    const newId = `local_${Date.now()}`;
    const newEducation = { ...education, id: newId };
    educationList.push(newEducation);
    localStorage.setItem("education", JSON.stringify(educationList));

    if (!isServicesAvailable() || !db) {
      return newId;
    }

    const educationCollection = collection(db, "education");
    const docRef = await addDoc(educationCollection, education);

    const updatedEducation = educationList.map((edu: EducationData) =>
      edu.id === newId ? { ...edu, id: docRef.id } : edu
    );
    localStorage.setItem("education", JSON.stringify(updatedEducation));

    return docRef.id;
  } catch (error) {
    console.error("Error adding education:", error);
    return "";
  }
};

export const updateEducation = async (id: string, education: EducationData): Promise<void> => {
  try {
    const educationList: EducationData[] = JSON.parse(localStorage.getItem("education") || "[]");
    const updatedEducation = educationList.map((edu: EducationData) =>
      edu.id === id ? { ...education, id } : edu
    );
    localStorage.setItem("education", JSON.stringify(updatedEducation));

    if (!isServicesAvailable() || !db) {
      return;
    }

    const educationDoc = doc(db, "education", id);
    await updateDoc(educationDoc, { ...education });
  } catch (error) {
    console.error("Error updating education:", error);
  }
};

export const deleteEducation = async (id: string): Promise<void> => {
  try {
    const educationList: EducationData[] = JSON.parse(localStorage.getItem("education") || "[]");
    const filteredEducation = educationList.filter((edu: EducationData) => edu.id !== id);
    localStorage.setItem("education", JSON.stringify(filteredEducation));

    if (!isServicesAvailable() || !db) {
      return;
    }

    const educationDoc = doc(db, "education", id);
    await deleteDoc(educationDoc);
  } catch (error) {
    console.error("Error deleting education:", error);
  }
};

// Publications Section
export const getPublications = async (): Promise<PublicationData[]> => {
  if (!isServicesAvailable()) {
    try {
      const localData = localStorage.getItem("publications");
      if (localData) {
        return JSON.parse(localData) as PublicationData[];
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
    return [];
  }

  try {
    const publicationsCollection = collection(db!, "publications");
    const q = query(publicationsCollection, orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const publications: PublicationData[] = [];
    querySnapshot.forEach((doc) => {
      publications.push({ id: doc.id, ...doc.data() } as PublicationData);
    });
    localStorage.setItem("publications", JSON.stringify(publications));
    return publications;
  } catch (error) {
    console.error("Error getting publications:", error);
    return [];
  }
};

export const addPublication = async (publication: PublicationData): Promise<string> => {
  try {
    const publications: PublicationData[] = JSON.parse(localStorage.getItem("publications") || "[]");
    const newId = `local_${Date.now()}`;
    const newPublication = { ...publication, id: newId };
    publications.push(newPublication);
    localStorage.setItem("publications", JSON.stringify(publications));

    if (!isServicesAvailable() || !db) {
      return newId;
    }

    const publicationsCollection = collection(db, "publications");
    const docRef = await addDoc(publicationsCollection, publication);

    const updatedPublications = publications.map((pub: PublicationData) =>
      pub.id === newId ? { ...pub, id: docRef.id } : pub
    );
    localStorage.setItem("publications", JSON.stringify(updatedPublications));

    return docRef.id;
  } catch (error) {
    console.error("Error adding publication:", error);
    return "";
  }
};

export const updatePublication = async (id: string, publication: PublicationData): Promise<void> => {
  try {
    const publications: PublicationData[] = JSON.parse(localStorage.getItem("publications") || "[]");
    const updatedPublications = publications.map((pub: PublicationData) =>
      pub.id === id ? { ...publication, id } : pub
    );
    localStorage.setItem("publications", JSON.stringify(updatedPublications));

    if (!isServicesAvailable() || !db) {
      return;
    }

    const publicationDoc = doc(db, "publications", id);
    await updateDoc(publicationDoc, { ...publication });
  } catch (error) {
    console.error("Error updating publication:", error);
  }
};

export const deletePublication = async (id: string): Promise<void> => {
  try {
    const publications: PublicationData[] = JSON.parse(localStorage.getItem("publications") || "[]");
    const filteredPublications = publications.filter((pub: PublicationData) => pub.id !== id);
    localStorage.setItem("publications", JSON.stringify(filteredPublications));

    if (!isServicesAvailable() || !db) {
      return;
    }

    const publicationDoc = doc(db, "publications", id);
    await deleteDoc(publicationDoc);
  } catch (error) {
    console.error("Error deleting publication:", error);
  }
};

// Trainings Section
export const getTrainings = async (): Promise<TrainingData[]> => {
  if (!isServicesAvailable()) {
    try {
      const localData = localStorage.getItem("trainings");
      if (localData) {
        return JSON.parse(localData) as TrainingData[];
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
    return [];
  }

  try {
    const trainingsCollection = collection(db!, "trainings");
    const q = query(trainingsCollection, orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const trainings: TrainingData[] = [];
    querySnapshot.forEach((doc) => {
      trainings.push({ id: doc.id, ...doc.data() } as TrainingData);
    });
    localStorage.setItem("trainings", JSON.stringify(trainings));
    return trainings;
  } catch (error) {
    console.error("Error getting trainings:", error);
    return [];
  }
};

export const addTraining = async (training: TrainingData): Promise<string> => {
  try {
    const trainings: TrainingData[] = JSON.parse(localStorage.getItem("trainings") || "[]");
    const newId = `local_${Date.now()}`;
    const newTraining = { ...training, id: newId };
    trainings.push(newTraining);
    localStorage.setItem("trainings", JSON.stringify(trainings));

    if (!isServicesAvailable() || !db) {
      return newId;
    }

    const trainingsCollection = collection(db, "trainings");
    const docRef = await addDoc(trainingsCollection, training);

    const updatedTrainings = trainings.map((train: TrainingData) =>
      train.id === newId ? { ...train, id: docRef.id } : train
    );
    localStorage.setItem("trainings", JSON.stringify(updatedTrainings));

    return docRef.id;
  } catch (error) {
    console.error("Error adding training:", error);
    return "";
  }
};

export const updateTraining = async (id: string, training: TrainingData): Promise<void> => {
  try {
    const trainings: TrainingData[] = JSON.parse(localStorage.getItem("trainings") || "[]");
    const updatedTrainings = trainings.map((train: TrainingData) =>
      train.id === id ? { ...training, id } : train
    );
    localStorage.setItem("trainings", JSON.stringify(updatedTrainings));

    if (!isServicesAvailable() || !db) {
      return;
    }

    const trainingDoc = doc(db, "trainings", id);
    await updateDoc(trainingDoc, { ...training });
  } catch (error) {
    console.error("Error updating training:", error);
  }
};

export const deleteTraining = async (id: string): Promise<void> => {
  try {
    const trainings: TrainingData[] = JSON.parse(localStorage.getItem("trainings") || "[]");
    const filteredTrainings = trainings.filter((train: TrainingData) => train.id !== id);
    localStorage.setItem("trainings", JSON.stringify(filteredTrainings));

    if (!isServicesAvailable() || !db) {
      return;
    }

    const trainingDoc = doc(db, "trainings", id);
    await deleteDoc(trainingDoc);
  } catch (error) {
    console.error("Error deleting training:", error);
  }
};

// Skills Section
export const getSkills = async (): Promise<SkillData[]> => {
  if (!isServicesAvailable()) {
    try {
      const localData = localStorage.getItem("skills");
      if (localData) {
        return JSON.parse(localData) as SkillData[];
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
    return [];
  }

  try {
    const skillsCollection = collection(db!, "skills");
    const q = query(skillsCollection, orderBy("order", "asc"));
    const querySnapshot = await getDocs(q);
    const skills: SkillData[] = [];
    querySnapshot.forEach((doc) => {
      skills.push({ id: doc.id, ...doc.data() } as SkillData);
    });
    localStorage.setItem("skills", JSON.stringify(skills));
    return skills;
  } catch (error) {
    console.error("Error getting skills:", error);
    return [];
  }
};

export const addSkill = async (skill: SkillData): Promise<string> => {
  try {
    const skills: SkillData[] = JSON.parse(localStorage.getItem("skills") || "[]");
    const newId = `local_${Date.now()}`;
    const newSkill = { ...skill, id: newId };
    skills.push(newSkill);
    localStorage.setItem("skills", JSON.stringify(skills));

    if (!isServicesAvailable() || !db) {
      return newId;
    }

    const skillsCollection = collection(db, "skills");
    const docRef = await addDoc(skillsCollection, skill);

    const updatedSkills = skills.map((s: SkillData) => (s.id === newId ? { ...s, id: docRef.id } : s));
    localStorage.setItem("skills", JSON.stringify(updatedSkills));

    return docRef.id;
  } catch (error) {
    console.error("Error adding skill:", error);
    return "";
  }
};

export const updateSkill = async (id: string, skill: SkillData): Promise<void> => {
  try {
    const skills: SkillData[] = JSON.parse(localStorage.getItem("skills") || "[]");
    const updatedSkills = skills.map((s: SkillData) => (s.id === id ? { ...skill, id } : s));
    localStorage.setItem("skills", JSON.stringify(updatedSkills));

    if (!isServicesAvailable() || !db) {
      return;
    }

    const skillDoc = doc(db, "skills", id);
    await updateDoc(skillDoc, { ...skill });
  } catch (error) {
    console.error("Error updating skill:", error);
  }
};

export const deleteSkill = async (id: string): Promise<void> => {
  try {
    const skills: SkillData[] = JSON.parse(localStorage.getItem("skills") || "[]");
    const filteredSkills = skills.filter((s: SkillData) => s.id !== id);
    localStorage.setItem("skills", JSON.stringify(filteredSkills));

    if (!isServicesAvailable() || !db) {
      return;
    }

    const skillDoc = doc(db, "skills", id);
    await deleteDoc(skillDoc);
  } catch (error) {
    console.error("Error deleting skill:", error);
  }
};

// Blog Section
export const getBlogPosts = async (): Promise<BlogPostData[]> => {
  if (!isServicesAvailable()) {
    try {
      const localData = localStorage.getItem("blogPosts");
      if (localData) {
        return JSON.parse(localData) as BlogPostData[];
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
    return [];
  }

  try {
    const blogPostsCollection = collection(db!, "blogPosts");
    const q = query(blogPostsCollection, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const blogPosts: BlogPostData[] = [];
    querySnapshot.forEach((doc) => {
      blogPosts.push({ id: doc.id, ...doc.data() } as BlogPostData);
    });
    localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
    return blogPosts;
  } catch (error) {
    console.error("Error getting blog posts:", error);
    return [];
  }
};

export const addBlogPost = async (blogPost: BlogPostData): Promise<string> => {
  try {
    const blogPosts: BlogPostData[] = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    const newId = `local_${Date.now()}`;
    const newBlogPost = { ...blogPost, id: newId };
    blogPosts.push(newBlogPost);
    localStorage.setItem("blogPosts", JSON.stringify(blogPosts));

    if (!isServicesAvailable() || !db) {
      return newId;
    }

    const blogPostsCollection = collection(db, "blogPosts");
    const docRef = await addDoc(blogPostsCollection, blogPost);

    const updatedBlogPosts = blogPosts.map((post: BlogPostData) =>
      post.id === newId ? { ...post, id: docRef.id } : post
    );
    localStorage.setItem("blogPosts", JSON.stringify(updatedBlogPosts));

    return docRef.id;
  } catch (error) {
    console.error("Error adding blog post:", error);
    return "";
  }
};

export const updateBlogPost = async (id: string, blogPost: BlogPostData): Promise<void> => {
  try {
    const blogPosts: BlogPostData[] = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    const updatedBlogPosts = blogPosts.map((post: BlogPostData) =>
      post.id === id ? { ...blogPost, id } : post
    );
    localStorage.setItem("blogPosts", JSON.stringify(updatedBlogPosts));

    if (!isServicesAvailable() || !db) {
      return;
    }

    const blogPostDoc = doc(db, "blogPosts", id);
    await updateDoc(blogPostDoc, { ...blogPost });
  } catch (error) {
    console.error("Error updating blog post:", error);
  }
};

export const deleteBlogPost = async (id: string): Promise<void> => {
  try {
    const blogPosts: BlogPostData[] = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    const filteredBlogPosts = blogPosts.filter((post: BlogPostData) => post.id !== id);
    localStorage.setItem("blogPosts", JSON.stringify(filteredBlogPosts));

    if (!isServicesAvailable() || !db) {
      return;
    }

    const blogPostDoc = doc(db, "blogPosts", id);
    await deleteDoc(blogPostDoc);
  } catch (error) {
    console.error("Error deleting blog post:", error);
  }
};

// Contact Form
export const submitContactForm = async (messageData: MessageData): Promise<void> => {
  try {
    const messages: MessageData[] = JSON.parse(localStorage.getItem("contactMessages") || "[]");
    const newMessage = {
      ...messageData,
      id: `local_${Date.now()}`,
      date: new Date().toISOString(),
      read: false,
    };
    messages.push(newMessage);
    localStorage.setItem("contactMessages", JSON.stringify(messages));

    if (!isServicesAvailable() || !db) {
      return;
    }

    const messagesCollection = collection(db, "messages");
    await addDoc(messagesCollection, {
      ...messageData,
      date: new Date(),
      read: false,
    });
  } catch (error) {
    console.error("Error submitting contact form:", error);
  }
};

// Messages Section
export const getMessages = async (): Promise<MessageData[]> => {
  if (!isServicesAvailable()) {
    try {
      const localData = localStorage.getItem("contactMessages");
      if (localData) {
        return JSON.parse(localData) as MessageData[];
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e);
    }
    return [];
  }

  try {
    const messagesCollection = collection(db!, "messages");
    const q = query(messagesCollection, orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const messages: MessageData[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() } as MessageData);
    });
    localStorage.setItem("contactMessages", JSON.stringify(messages));
    return messages;
  } catch (error) {
    console.error("Error getting messages:", error);
    return [];
  }
};

export const updateMessageReadStatus = async (id: string, read: boolean): Promise<void> => {
  try {
    const messages: MessageData[] = JSON.parse(localStorage.getItem("contactMessages") || "[]");
    const updatedMessages = messages.map((msg: MessageData) => (msg.id === id ? { ...msg, read } : msg));
    localStorage.setItem("contactMessages", JSON.stringify(updatedMessages));

    if (!isServicesAvailable() || !db) {
      return;
    }

    const messageDoc = doc(db, "messages", id);
    await updateDoc(messageDoc, { read });
  } catch (error) {
    console.error("Error updating message status:", error);
  }
};

export const deleteMessage = async (id: string): Promise<void> => {
  try {
    const messages: MessageData[] = JSON.parse(localStorage.getItem("contactMessages") || "[]");
    const filteredMessages = messages.filter((msg: MessageData) => msg.id !== id);
    localStorage.setItem("contactMessages", JSON.stringify(filteredMessages));

    if (!isServicesAvailable() || !db) {
      return;
    }

    const messageDoc = doc(db, "messages", id);
    await deleteDoc(messageDoc);
  } catch (error) {
    console.error("Error deleting message:", error);
  }
};

// Admin Authentication
export const loginAdmin = async (email: string, password: string): Promise<void> => {
  if (!isServicesAvailable() || !auth) {
    if (email === "admin@example.com" && password === "password") {
      localStorage.setItem("adminAuthenticated", "true");
      return;
    }
    throw new Error("Firebase services are not available. Please use demo credentials.");
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    localStorage.setItem("adminAuthenticated", "true");
  } catch (error) {
    console.error("Error logging in admin:", error);
    throw error;
  }
};

export const logoutAdmin = async (): Promise<void> => {
  localStorage.removeItem("adminAuthenticated");

  if (!isServicesAvailable() || !auth) {
    return;
  }

  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out admin:", error);
  }
};

// Additional functions for Base64 image handling
export const updateHeroWithBase64Image = async (data: HeroData): Promise<void> => {
  return updateHeroData(data);
};

export const updateBlogPostWithBase64Image = async (id: string, blogPost: BlogPostData): Promise<void> => {
  return updateBlogPost(id, blogPost);
};