"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertCircle,
  Lock,
  Mail,
  Calendar,
  CheckCircle,
  X,
  Edit,
  Trash,
  Plus,
  Save,
  FileText,
  Award,
  BookOpen,
  Briefcase,
  GraduationCap,
  Star,
  PenTool,
  Upload,
  ImageIcon,
  MapPin,
  Home,
  RefreshCw,
  Eye,
  EyeOff,
  Settings,
} from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import {
  getMessages,
  updateMessageReadStatus,
  deleteMessage,
  getHeroData,
  updateHeroData,
  getAboutData,
  updateAboutData,
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
  getEducation,
  addEducation,
  updateEducation,
  deleteEducation,
  getPublications,
  addPublication,
  updatePublication,
  deletePublication,
  getTrainings,
  addTraining,
  updateTraining,
  deleteTraining,
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
  getBlogPosts,
  addBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getSectionVisibility,
  updateSectionVisibility,
  type MessageData,
  type HeroData,
  type AboutData,
  type ExperienceData,
  type EducationData,
  type PublicationData,
  type TrainingData,
  type SkillData,
  type BlogPostData,
  type SectionVisibilitySettings,
} from "@/lib/mongodb-service"
import { signOut } from "next-auth/react"

export default function AdminPage() {
  const [messages, setMessages] = useState<MessageData[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("messages")
  const [isSaving, setIsSaving] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Hero section state
  const [heroData, setHeroData] = useState<HeroData>({
    title: "",
    subtitle: "",
    description: "",
    imageUrl: "",
    showScrollIndicator: true,
  })
  const [heroLoading, setHeroLoading] = useState(false)

  // About section state
  const [aboutData, setAboutData] = useState<AboutData>({ bio: "", highlights: [] })
  const [aboutLoading, setAboutLoading] = useState(false)
  const [highlightInput, setHighlightInput] = useState("")

  // Experience section state
  const [experiences, setExperiences] = useState<ExperienceData[]>([])
  const [experienceLoading, setExperienceLoading] = useState(false)
  const [currentExperience, setCurrentExperience] = useState<ExperienceData | null>(null)
  const [isExperienceDialogOpen, setIsExperienceDialogOpen] = useState(false)

  // Education section state
  const [education, setEducation] = useState<EducationData[]>([])
  const [educationLoading, setEducationLoading] = useState(false)
  const [currentEducation, setCurrentEducation] = useState<EducationData | null>(null)
  const [isEducationDialogOpen, setIsEducationDialogOpen] = useState(false)

  // Publications section state
  const [publications, setPublications] = useState<PublicationData[]>([])
  const [publicationsLoading, setPublicationsLoading] = useState(false)
  const [currentPublication, setCurrentPublication] = useState<PublicationData | null>(null)
  const [isPublicationDialogOpen, setIsPublicationDialogOpen] = useState(false)

  // Trainings section state
  const [trainings, setTrainings] = useState<TrainingData[]>([])
  const [trainingsLoading, setTrainingsLoading] = useState(false)
  const [currentTraining, setCurrentTraining] = useState<TrainingData | null>(null)
  const [isTrainingDialogOpen, setIsTrainingDialogOpen] = useState(false)

  // Skills section state
  const [skills, setSkills] = useState<SkillData[]>([])
  const [skillsLoading, setSkillsLoading] = useState(false)
  const [currentSkill, setCurrentSkill] = useState<SkillData | null>(null)
  const [isSkillDialogOpen, setIsSkillDialogOpen] = useState(false)

  // Blog section state
  const [blogPosts, setBlogPosts] = useState<BlogPostData[]>([])
  const [blogLoading, setBlogLoading] = useState(false)
  const [currentBlogPost, setCurrentBlogPost] = useState<BlogPostData | null>(null)
  const [isBlogPostDialogOpen, setIsBlogPostDialogOpen] = useState(false)
  const [richText, setRichText] = useState("")

  // Section visibility state
  const [sectionVisibility, setSectionVisibility] = useState<SectionVisibilitySettings>({
    hero: true,
    about: true,
    experience: true,
    education: true,
    publications: true,
    trainings: true,
    skills: true,
    blog: true,
    contact: true,
  })
  const [sectionVisibilityLoading, setSectionVisibilityLoading] = useState(false)

  // File Upload ref
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Function to trigger a refresh of the frontend
  const triggerFrontendRefresh = () => {
    // Dispatch a storage event to notify other tabs/windows
    window.dispatchEvent(new Event("storage"))
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/auth/signin' })
  }

  // Message functions
  const fetchMessages = async () => {
    setLoading(true)
    try {
      const fetchedMessages = await getMessages()
      setMessages(fetchedMessages)
    } catch (error) {
      console.error("Error fetching messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string, currentStatus: boolean) => {
    try {
      await updateMessageReadStatus(id, !currentStatus)
      setMessages(messages.map((msg) => (msg.id === id ? { ...msg, read: !currentStatus } : msg)))
    } catch (error) {
      console.error("Error updating message status:", error)
    }
  }

  const handleDeleteMessage = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteMessage(id)
        setMessages(messages.filter((msg) => msg.id !== id))
        alert("Message deleted successfully!")
      } catch (error) {
        console.error("Error deleting message:", error)
        alert("Failed to delete message. Please try again.")
      }
    }
  }

  // Hero functions
  const fetchHeroData = async () => {
    setHeroLoading(true)
    try {
      const data = await getHeroData()
      setHeroData(data)
    } catch (error) {
      console.error("Error fetching hero data:", error)
    } finally {
      setHeroLoading(false)
    }
  }

  const handleSaveHero = async () => {
    setIsSaving(true)
    try {
      await updateHeroData(heroData)
      triggerFrontendRefresh()
      alert("Hero section updated successfully!")
    } catch (error) {
      console.error("Error saving hero data:", error)
      alert("Failed to update hero section. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setHeroData({
          ...heroData,
          imageUrl: (reader.result as string) || "/placeholder.svg?height=400&width=400",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // About functions
  const fetchAboutData = async () => {
    setAboutLoading(true)
    try {
      const data = await getAboutData()
      setAboutData(data)
    } catch (error) {
      console.error("Error fetching about data:", error)
    } finally {
      setAboutLoading(false)
    }
  }

  const handleSaveAbout = async () => {
    setIsSaving(true)
    try {
      await updateAboutData(aboutData)
      triggerFrontendRefresh()
      alert("About section updated successfully!")
    } catch (error) {
      console.error("Error saving about data:", error)
      alert("Failed to update about section. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const addHighlight = () => {
    if (highlightInput.trim()) {
      setAboutData({
        ...aboutData,
        highlights: [...aboutData.highlights, highlightInput.trim()],
      })
      setHighlightInput("")
    }
  }

  const removeHighlight = (index: number) => {
    setAboutData({
      ...aboutData,
      highlights: aboutData.highlights.filter((_, i) => i !== index),
    })
  }

  // Experience functions
  const fetchExperiences = async () => {
    setExperienceLoading(true)
    try {
      const data = await getExperiences()
      setExperiences(data)
    } catch (error) {
      console.error("Error fetching experiences:", error)
    } finally {
      setExperienceLoading(false)
    }
  }

  const handleSaveExperience = async () => {
    if (!currentExperience) return

    setIsSaving(true)
    try {
      if (currentExperience.id) {
        await updateExperience(currentExperience.id, currentExperience)
        setExperiences(experiences.map((exp) => (exp.id === currentExperience.id ? currentExperience : exp)))
      } else {
        const newId = await addExperience({
          ...currentExperience,
          order: experiences.length + 1,
        })
        setExperiences([...experiences, { ...currentExperience, id: newId }])
      }
      setIsExperienceDialogOpen(false)
      triggerFrontendRefresh()
      alert(currentExperience.id ? "Experience updated successfully!" : "Experience added successfully!")
    } catch (error) {
      console.error("Error saving experience:", error)
      alert("Failed to save experience. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteExperience = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this experience?")) {
      try {
        await deleteExperience(id)
        setExperiences(experiences.filter((exp) => exp.id !== id))
        triggerFrontendRefresh()
        alert("Experience deleted successfully!")
      } catch (error) {
        console.error("Error deleting experience:", error)
        alert("Failed to delete experience. Please try again.")
      }
    }
  }

  const openNewExperienceDialog = () => {
    setCurrentExperience({
      title: "",
      company: "",
      period: "",
      description: "",
      order: experiences.length + 1,
    })
    setIsExperienceDialogOpen(true)
  }

  const openEditExperienceDialog = (experience: ExperienceData) => {
    setCurrentExperience({ ...experience })
    setIsExperienceDialogOpen(true)
  }

  // Education functions
  const fetchEducation = async () => {
    setEducationLoading(true)
    try {
      const data = await getEducation()
      setEducation(data)
    } catch (error) {
      console.error("Error fetching education:", error)
    } finally {
      setEducationLoading(false)
    }
  }

  const handleSaveEducation = async () => {
    if (!currentEducation) return

    setIsSaving(true)
    try {
      if (currentEducation.id) {
        await updateEducation(currentEducation.id, currentEducation)
        setEducation(education.map((edu) => (edu.id === currentEducation.id ? currentEducation : edu)))
      } else {
        const newId = await addEducation({
          ...currentEducation,
          order: education.length + 1,
        })
        setEducation([...education, { ...currentEducation, id: newId }])
      }
      setIsEducationDialogOpen(false)
      triggerFrontendRefresh()
      alert(currentEducation.id ? "Education updated successfully!" : "Education added successfully!")
    } catch (error) {
      console.error("Error saving education:", error)
      alert("Failed to save education. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteEducation = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this education?")) {
      try {
        await deleteEducation(id)
        setEducation(education.filter((edu) => edu.id !== id))
        triggerFrontendRefresh()
        alert("Education deleted successfully!")
      } catch (error) {
        console.error("Error deleting education:", error)
        alert("Failed to save education. Please try again.")
      }
    }
  }

  const openNewEducationDialog = () => {
    setCurrentEducation({
      degree: "",
      institution: "",
      location: "",
      years: "",
      order: education.length + 1,
    })
    setIsEducationDialogOpen(true)
  }

  const openEditEducationDialog = (educationItem: EducationData) => {
    setCurrentEducation({ ...educationItem })
    setIsEducationDialogOpen(true)
  }

  // Publications functions
  const fetchPublications = async () => {
    setPublicationsLoading(true)
    try {
      const data = await getPublications()
      setPublications(data)
    } catch (error) {
      console.error("Error fetching publications:", error)
    } finally {
      setPublicationsLoading(false)
    }
  }

  const handleSavePublication = async () => {
    if (!currentPublication) return

    setIsSaving(true)
    try {
      if (currentPublication.id) {
        await updatePublication(currentPublication.id, currentPublication)
        setPublications(publications.map((pub) => (pub.id === currentPublication.id ? currentPublication : pub)))
      } else {
        const newId = await addPublication({
          ...currentPublication,
          order: publications.length + 1,
        })
        setPublications([...publications, { ...currentPublication, id: newId }])
      }
      setIsPublicationDialogOpen(false)
      triggerFrontendRefresh()
      alert(currentPublication.id ? "Publication updated successfully!" : "Publication added successfully!")
    } catch (error) {
      console.error("Error saving publication:", error)
      alert("Failed to save publication. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeletePublication = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this publication?")) {
      try {
        await deletePublication(id)
        setPublications(publications.filter((pub) => pub.id !== id))
        triggerFrontendRefresh()
        alert("Publication deleted successfully!")
      } catch (error) {
        console.error("Error deleting publication:", error)
        alert("Failed to save publication. Please try again.")
      }
    }
  }

  const openNewPublicationDialog = () => {
    setCurrentPublication({
      title: "",
      event: "",
      date: "",
      location: "",
      type: "Publication",
      color: "blue",
      icon: "FileText",
      order: publications.length + 1,
    })
    setIsPublicationDialogOpen(true)
  }

  const openEditPublicationDialog = (publication: PublicationData) => {
    setCurrentPublication({ ...publication })
    setIsPublicationDialogOpen(true)
  }

  // Trainings functions
  const fetchTrainings = async () => {
    setTrainingsLoading(true)
    try {
      const data = await getTrainings()
      setTrainings(data)
    } catch (error) {
      console.error("Error fetching trainings:", error)
    } finally {
      setTrainingsLoading(false)
    }
  }

  const handleSaveTraining = async () => {
    if (!currentTraining) return

    setIsSaving(true)
    try {
      if (currentTraining.id) {
        await updateTraining(currentTraining.id, currentTraining)
        setTrainings(trainings.map((training) => (training.id === currentTraining.id ? currentTraining : training)))
      } else {
        const newId = await addTraining({
          ...currentTraining,
          order: trainings.length + 1,
        })
        setTrainings([...trainings, { ...currentTraining, id: newId }])
      }
      setIsTrainingDialogOpen(false)
      triggerFrontendRefresh()
      alert(currentTraining.id ? "Training updated successfully!" : "Training added successfully!")
    } catch (error) {
      console.error("Error saving training:", error)
      alert("Failed to save training. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteTraining = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this training?")) {
      try {
        await deleteTraining(id)
        setTrainings(trainings.filter((training) => training.id !== id))
        triggerFrontendRefresh()
        alert("Training deleted successfully!")
      } catch (error) {
        console.error("Error deleting training:", error)
        alert("Failed to save training. Please try again.")
      }
    }
  }

  const openNewTrainingDialog = () => {
    setCurrentTraining({
      title: "",
      date: "",
      location: "",
      icon: "Award",
      order: trainings.length + 1,
    })
    setIsTrainingDialogOpen(true)
  }

  const openEditTrainingDialog = (training: TrainingData) => {
    setCurrentTraining({ ...training })
    setIsTrainingDialogOpen(true)
  }

  // Skills functions
  const fetchSkills = async () => {
    setSkillsLoading(true)
    try {
      const data = await getSkills()
      setSkills(data)
    } catch (error) {
      console.error("Error fetching skills:", error)
    } finally {
      setSkillsLoading(false)
    }
  }

  const handleSaveSkill = async () => {
    if (!currentSkill) return

    setIsSaving(true)
    try {
      if (currentSkill.id) {
        await updateSkill(currentSkill.id, currentSkill)
        setSkills(skills.map((skill) => (skill.id === currentSkill.id ? currentSkill : skill)))
      } else {
        const newId = await addSkill({
          ...currentSkill,
          order:
            currentSkill.type === "technical"
              ? skills.filter((s) => s.type === "technical").length + 1
              : skills.filter((s) => s.type === "personal").length + 1,
        })
        setSkills([...skills, { ...currentSkill, id: newId }])
      }
      setIsSkillDialogOpen(false)
      triggerFrontendRefresh()
      alert(currentSkill.id ? "Skill updated successfully!" : "Skill added successfully!")
    } catch (error) {
      console.error("Error saving skill:", error)
      alert("Failed to save skill. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteSkill = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await deleteSkill(id)
        setSkills(skills.filter((skill) => skill.id !== id))
        triggerFrontendRefresh()
        alert("Skill deleted successfully!")
      } catch (error) {
        console.error("Error deleting skill:", error)
        alert("Failed to save skill. Please try again.")
      }
    }
  }

  const openNewSkillDialog = () => {
    setCurrentSkill({
      name: "",
      level: 80,
      type: "technical",
      icon: "Star",
      order: 1,
    })
    setIsSkillDialogOpen(true)
  }

  const openEditSkillDialog = (skill: SkillData) => {
    setCurrentSkill({ ...skill })
    setIsSkillDialogOpen(true)
  }

  // Blog functions
  const fetchBlogPosts = async () => {
    setBlogLoading(true)
    try {
      const data = await getBlogPosts()
      setBlogPosts(data)
    } catch (error) {
      console.error("Error fetching blog posts:", error)
    } finally {
      setBlogLoading(false)
    }
  }

  const handleSaveBlogPost = async () => {
    if (!currentBlogPost) return

    setIsSaving(true)
    try {
      if (currentBlogPost.id) {
        await updateBlogPost(currentBlogPost.id, {
          ...currentBlogPost,
          content: richText,
        })
        setBlogPosts(
          blogPosts.map((post) => (post.id === currentBlogPost.id ? { ...currentBlogPost, content: richText } : post)),
        )
      } else {
        const newId = await addBlogPost({
          ...currentBlogPost,
          content: richText,
          date: new Date(),
        })
        setBlogPosts([
          {
            ...currentBlogPost,
            id: newId,
            content: richText,
            date: new Date(),
          },
          ...blogPosts,
        ])
      }
      setIsBlogPostDialogOpen(false)
      triggerFrontendRefresh()
      alert(currentBlogPost.id ? "Blog post updated successfully!" : "Blog post added successfully!")
    } catch (error) {
      console.error("Error saving blog post:", error)
      alert("Failed to save blog post. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteBlogPost = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await deleteBlogPost(id)
        setBlogPosts(blogPosts.filter((post) => post.id !== id))
        triggerFrontendRefresh()
        alert("Blog post deleted successfully!")
      } catch (error) {
        console.error("Error deleting blog post:", error)
        alert("Failed to save blog post. Please try again.")
      }
    }
  }

  const openNewBlogPostDialog = () => {
    setCurrentBlogPost({
      title: "",
      content: "",
      date: new Date(),
      author: "Dr. Saugat Bhandari",
      excerpt: "",
      published: true,
      imageUrl: "/placeholder.svg?height=200&width=400",
    })
    setRichText("")
    setIsBlogPostDialogOpen(true)
  }

  const openEditBlogPostDialog = (post: BlogPostData) => {
    setCurrentBlogPost({ ...post })
    setRichText(post.content)
    setIsBlogPostDialogOpen(true)
  }

  const handleBlogImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && currentBlogPost) {
      const reader = new FileReader()
      reader.onload = () => {
        setCurrentBlogPost({
          ...currentBlogPost,
          imageUrl: (reader.result as string) || "/placeholder.svg?height=200&width=400",
        })
      }
      reader.readAsDataURL(file)
    }
  }

  // Section visibility functions
  const fetchSectionVisibility = async () => {
    setSectionVisibilityLoading(true)
    try {
      const settings = await getSectionVisibility()
      setSectionVisibility(settings)
    } catch (error) {
      console.error("Error fetching section visibility settings:", error)
    } finally {
      setSectionVisibilityLoading(false)
    }
  }

  const handleSaveSectionVisibility = async () => {
    setIsSaving(true)
    try {
      await updateSectionVisibility(sectionVisibility)
      triggerFrontendRefresh()
      alert("Section visibility settings updated successfully!")
    } catch (error) {
      console.error("Error saving section visibility settings:", error)
      alert("Failed to update section visibility settings. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  // Function to manually refresh data - to be called only by user interaction
  const refreshCurrentSection = () => {
    // Fetch data for the current active tab
    switch (activeTab) {
      case "messages":
        fetchMessages();
        break;
      case "hero":
        fetchHeroData();
        break;
      case "about":
        fetchAboutData();
        break;
      case "experience":
        fetchExperiences();
        break;
      case "education":
        fetchEducation();
        break;
      case "publications":
        fetchPublications();
        break;
      case "trainings":
        fetchTrainings();
        break;
      case "skills":
        fetchSkills();
        break;
      case "blog":
        fetchBlogPosts();
        break;
      case "settings":
        fetchSectionVisibility();
        break;
      default:
        console.warn(`No refresh handler for tab: ${activeTab}`);
    }
  }

  useEffect(() => {
    refreshCurrentSection()
  }, [activeTab, refreshTrigger])

  // Helper function to format date
  const formatDate = (date: string | { toDate: () => Date } | Date | undefined) => {
    if (!date) return "Unknown date"

    if (typeof date === "string") {
      return new Date(date).toLocaleDateString() + " at " + new Date(date).toLocaleTimeString()
    } else if (date instanceof Date) {
      return date.toLocaleDateString() + " at " + date.toLocaleTimeString()
    } else if (date && typeof date.toDate === "function") {
      const dateObj = date.toDate()
      return dateObj.toLocaleDateString() + " at " + dateObj.toLocaleTimeString()
    }
    return "Unknown date"
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4">
      <div className="container mx-auto py-6">
        {/* Header with improved mobile layout */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <Button
              variant="outline"
              size="icon"
              onClick={refreshCurrentSection}
              title="Refresh data"
              className="hidden sm:flex"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Button variant="outline" className="flex-1 sm:flex-initial" onClick={() => window.open("/", "_blank")}>
              <Home className="mr-2 h-4 w-4" /> View Site
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-initial" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="messages" value={activeTab} onValueChange={setActiveTab}>
          {/* Mobile-friendly tabs */}
          <div className="mb-6 bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md">
            <div className="overflow-x-auto">
              <TabsList className="flex flex-nowrap min-w-max w-full justify-start sm:justify-center">
                <TabsTrigger value="messages" className="flex items-center gap-1 whitespace-nowrap">
                  <Mail className="h-4 w-4" /> <span className="hidden sm:inline">Messages</span>
                </TabsTrigger>
                <TabsTrigger value="hero" className="flex items-center gap-1 whitespace-nowrap">
                  <ImageIcon className="h-4 w-4" /> <span className="hidden sm:inline">Hero</span>
                </TabsTrigger>
                <TabsTrigger value="about" className="flex items-center gap-1 whitespace-nowrap">
                  <FileText className="h-4 w-4" /> <span className="hidden sm:inline">About</span>
                </TabsTrigger>
                <TabsTrigger value="experience" className="flex items-center gap-1 whitespace-nowrap">
                  <Briefcase className="h-4 w-4" /> <span className="hidden sm:inline">Experience</span>
                </TabsTrigger>
                <TabsTrigger value="education" className="flex items-center gap-1 whitespace-nowrap">
                  <GraduationCap className="h-4 w-4" /> <span className="hidden sm:inline">Education</span>
                </TabsTrigger>
                <TabsTrigger value="publications" className="flex items-center gap-1 whitespace-nowrap">
                  <Award className="h-4 w-4" /> <span className="hidden sm:inline">Publications</span>
                </TabsTrigger>
                <TabsTrigger value="trainings" className="flex items-center gap-1 whitespace-nowrap">
                  <BookOpen className="h-4 w-4" /> <span className="hidden sm:inline">Trainings</span>
                </TabsTrigger>
                <TabsTrigger value="skills" className="flex items-center gap-1 whitespace-nowrap">
                  <Star className="h-4 w-4" /> <span className="hidden sm:inline">Skills</span>
                </TabsTrigger>
                <TabsTrigger value="blog" className="flex items-center gap-1 whitespace-nowrap">
                  <PenTool className="h-4 w-4" /> <span className="hidden sm:inline">Blog</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-1 whitespace-nowrap">
                  <Settings className="h-4 w-4" /> <span className="hidden sm:inline">Settings</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          {/* Messages Tab */}
          <TabsContent value="messages">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Contact Messages</CardTitle>
                  <CardDescription>View and manage messages from the contact form</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={refreshCurrentSection}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <svg
                      className="animate-spin h-8 w-8 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No messages received yet.</div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <Card
                        key={message.id}
                        className={`border ${message.read ? "border-gray-200" : "border-primary"}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-2">
                            <div>
                              <h3 className="font-bold text-lg flex items-center flex-wrap gap-2">
                                {message.subject}
                                {!message.read && <Badge className="bg-primary text-white">New</Badge>}
                              </h3>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Mail className="h-4 w-4 mr-1" />
                                <span>{message.email}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 self-end sm:self-start">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(message.id!, message.read!)}
                                title={message.read ? "Mark as unread" : "Mark as read"}
                              >
                                {message.read ? <X className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteMessage(message.id!)}
                                className="text-destructive"
                                title="Delete message"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground mb-3">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{formatDate(message.date)}</span>
                          </div>
                          <div className="bg-muted/30 p-3 rounded-md">
                            <p className="whitespace-pre-wrap">{message.message}</p>
                          </div>
                          <div className="mt-3 text-sm">
                            From: <span className="font-medium">{message.name}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hero Tab */}
          <TabsContent value="hero">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Hero Section</CardTitle>
                  <CardDescription>Edit your hero section content and image</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={refreshCurrentSection}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {heroLoading ? (
                  <div className="flex justify-center py-8">
                    <svg
                      className="animate-spin h-8 w-8 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/2 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="heroTitle">Title</Label>
                          <Input
                            id="heroTitle"
                            value={heroData.title}
                            onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                            placeholder="Dr. Saugat Bhandari"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="heroSubtitle">Subtitle</Label>
                          <Input
                            id="heroSubtitle"
                            value={heroData.subtitle}
                            onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                            placeholder="MBBS"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="heroDescription">Description</Label>
                          <Textarea
                            id="heroDescription"
                            rows={3}
                            value={heroData.description}
                            onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                            placeholder="Professional description..."
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Label htmlFor="showScrollIndicator" className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="checkbox"
                              id="showScrollIndicator"
                              checked={heroData.showScrollIndicator}
                              onChange={(e) => setHeroData({ ...heroData, showScrollIndicator: e.target.checked })}
                              className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span>Show scroll indicator</span>
                          </Label>
                        </div>
                      </div>

                      <div className="w-full md:w-1/2 space-y-4">
                        <div className="space-y-2">
                          <Label>Profile Image</Label>
                          <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-md">
                            <div className="relative w-48 h-48 mb-4 overflow-hidden rounded-full">
                              <img
                                src={heroData.imageUrl || "/placeholder.svg?height=200&width=200"}
                                alt="Profile"
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <Button
                              variant="outline"
                              onClick={() => fileInputRef.current?.click()}
                              className="flex items-center gap-2"
                            >
                              <Upload className="h-4 w-4" /> Upload New Image
                            </Button>
                            <input
                              type="file"
                              ref={fileInputRef}
                              accept="image/*"
                              onChange={handleHeroImageUpload}
                              className="hidden"
                            />
                            <p className="mt-2 text-sm text-muted-foreground">Recommended size: 400x400 pixels</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button onClick={handleSaveHero} disabled={isSaving} className="w-full sm:w-auto">
                      {isSaving ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Save className="mr-2 h-4 w-4" /> Save Changes
                        </span>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>About Section</CardTitle>
                  <CardDescription>Edit your bio and professional highlights</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={refreshCurrentSection}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {aboutLoading ? (
                  <div className="flex justify-center py-8">
                    <svg
                      className="animate-spin h-8 w-8 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        rows={5}
                        value={aboutData.bio}
                        onChange={(e) => setAboutData({ ...aboutData, bio: e.target.value })}
                        placeholder="Enter your professional bio here..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Professional Highlights</Label>
                      <div className="space-y-2">
                        {aboutData.highlights.map((highlight, index) => (
                          <div key={index} className="flex items-center gap-2 bg-muted/30 p-2 rounded-md">
                            <span className="flex-1">{highlight}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeHighlight(index)}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 mt-2">
                        <Input
                          placeholder="Add a new highlight..."
                          value={highlightInput}
                          onChange={(e) => setHighlightInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addHighlight()
                            }
                          }}
                          className="flex-1"
                        />
                        <Button onClick={addHighlight} type="button">
                          Add
                        </Button>
                      </div>
                    </div>

                    <Button onClick={handleSaveAbout} disabled={isSaving} className="w-full sm:w-auto">
                      {isSaving ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <Save className="mr-2 h-4 w-4" /> Save Changes
                        </span>
                      )}
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Tab */}
          <TabsContent value="experience">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Experience Management</CardTitle>
                  <CardDescription>Add, edit, or remove professional experiences</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={refreshCurrentSection}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                  </Button>
                  <Button onClick={openNewExperienceDialog} className="flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {experienceLoading ? (
                  <div className="flex justify-center py-8">
                    <svg
                      className="animate-spin h-8 w-8 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : experiences.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No experiences added yet.</div>
                ) : (
                  <div className="space-y-4">
                    {experiences.map((experience) => (
                      <Card key={experience.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            <div className="p-4 sm:p-6 flex-1">
                              <h3 className="font-bold text-lg">{experience.title}</h3>
                              <p className="text-primary">{experience.company}</p>
                              <p className="text-sm text-muted-foreground">{experience.period}</p>
                              <p className="mt-2">{experience.description}</p>
                            </div>
                            <div className="flex sm:flex-col justify-end p-4 bg-muted/20">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => openEditExperienceDialog(experience)}
                              >
                                <Edit className="h-4 w-4" /> Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1 text-destructive"
                                onClick={() => handleDeleteExperience(experience.id!)}
                              >
                                <Trash className="h-4 w-4" /> Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Experience Dialog */}
            <Dialog open={isExperienceDialogOpen} onOpenChange={setIsExperienceDialogOpen}>
              <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{currentExperience?.id ? "Edit Experience" : "Add New Experience"}</DialogTitle>
                  <DialogDescription>
                    {currentExperience?.id
                      ? "Update the details of your professional experience."
                      : "Add details about your professional experience."}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={currentExperience?.title || ""}
                      onChange={(e) =>
                        setCurrentExperience((prev) => (prev ? { ...prev, title: e.target.value } : null))
                      }
                      placeholder="e.g. Medical Officer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input
                      id="company"
                      value={currentExperience?.company || ""}
                      onChange={(e) =>
                        setCurrentExperience((prev) => (prev ? { ...prev, company: e.target.value } : null))
                      }
                      placeholder="e.g. Patan Hospital"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="period">Time Period</Label>
                    <Input
                      id="period"
                      value={currentExperience?.period || ""}
                      onChange={(e) =>
                        setCurrentExperience((prev) => (prev ? { ...prev, period: e.target.value } : null))
                      }
                      placeholder="e.g. January 2020 - Present"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      rows={4}
                      value={currentExperience?.description || ""}
                      onChange={(e) =>
                        setCurrentExperience((prev) => (prev ? { ...prev, description: e.target.value } : null))
                      }
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsExperienceDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveExperience} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Education Management</CardTitle>
                  <CardDescription>Add, edit, or remove educational qualifications</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={refreshCurrentSection}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                  </Button>
                  <Button onClick={openNewEducationDialog} className="flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {educationLoading ? (
                  <div className="flex justify-center py-8">
                    <svg
                      className="animate-spin h-8 w-8 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : education.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No education added yet.</div>
                ) : (
                  <div className="space-y-4">
                    {education.map((edu) => (
                      <Card key={edu.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            <div className="p-4 sm:p-6 flex-1">
                              <h3 className="font-bold text-lg">{edu.degree}</h3>
                              <p className="text-primary">{edu.institution}</p>
                              <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>{edu.years}</span>
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{edu.location}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex sm:flex-col justify-end p-4 bg-muted/20">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => openEditEducationDialog(edu)}
                              >
                                <Edit className="h-4 w-4" /> Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1 text-destructive"
                                onClick={() => handleDeleteEducation(edu.id!)}
                              >
                                <Trash className="h-4 w-4" /> Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Education Dialog */}
            <Dialog open={isEducationDialogOpen} onOpenChange={setIsEducationDialogOpen}>
              <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{currentEducation?.id ? "Edit Education" : "Add New Education"}</DialogTitle>
                  <DialogDescription>
                    {currentEducation?.id
                      ? "Update the details of your education."
                      : "Add details about your education."}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="degree">Degree/Certification</Label>
                    <Input
                      id="degree"
                      value={currentEducation?.degree || ""}
                      onChange={(e) =>
                        setCurrentEducation((prev) => (prev ? { ...prev, degree: e.target.value } : null))
                      }
                      placeholder="e.g. MBBS"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution">Institution</Label>
                    <Input
                      id="institution"
                      value={currentEducation?.institution || ""}
                      onChange={(e) =>
                        setCurrentEducation((prev) => (prev ? { ...prev, institution: e.target.value } : null))
                      }
                      placeholder="e.g. Patan Academy of Health Sciences"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={currentEducation?.location || ""}
                      onChange={(e) =>
                        setCurrentEducation((prev) => (prev ? { ...prev, location: e.target.value } : null))
                      }
                      placeholder="e.g. Lalitpur, Nepal"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="years">Years</Label>
                    <Input
                      id="years"
                      value={currentEducation?.years || ""}
                      onChange={(e) =>
                        setCurrentEducation((prev) => (prev ? { ...prev, years: e.target.value } : null))
                      }
                      placeholder="e.g. 2014 - 2020"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsEducationDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveEducation} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Publications Tab */}
          <TabsContent value="publications">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Publications Management</CardTitle>
                  <CardDescription>Add, edit, or remove publications and presentations</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={refreshCurrentSection}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                  </Button>
                  <Button onClick={openNewPublicationDialog} className="flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {publicationsLoading ? (
                  <div className="flex justify-center py-8">
                    <svg
                      className="animate-spin h-8 w-8 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : publications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No publications added yet.</div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {publications.map((pub) => (
                      <Card key={pub.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                          <div className="p-4">
                            <div className="flex items-start gap-3 mb-3">
                              <Badge className="mt-1">{pub.type}</Badge>
                              <div className="flex-1">
                                <h3 className="font-bold text-lg">{pub.title}</h3>
                                <p className="text-primary">{pub.event}</p>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:gap-4 text-sm text-muted-foreground mt-1 mb-3">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{pub.date}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{pub.location}</span>
                              </div>
                            </div>
                            <div className="flex justify-end gap-2 border-t pt-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1"
                                onClick={() => openEditPublicationDialog(pub)}
                              >
                                <Edit className="h-4 w-4" /> Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1 text-destructive"
                                onClick={() => handleDeletePublication(pub.id!)}
                              >
                                <Trash className="h-4 w-4" /> Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Publication Dialog */}
            <Dialog open={isPublicationDialogOpen} onOpenChange={setIsPublicationDialogOpen}>
              <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{currentPublication?.id ? "Edit Publication" : "Add New Publication"}</DialogTitle>
                  <DialogDescription>
                    {currentPublication?.id
                      ? "Update the details of your publication or presentation."
                      : "Add details about your publication or presentation."}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={currentPublication?.title || ""}
                      onChange={(e) =>
                        setCurrentPublication((prev) => (prev ? { ...prev, title: e.target.value } : null))
                      }
                      placeholder="e.g. Clinical Characteristics of RSV Infections in Infants"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={currentPublication?.type || "Publication"}
                      onValueChange={(value) =>
                        setCurrentPublication((prev) => (prev ? { ...prev, type: value } : null))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Publication">Publication</SelectItem>
                        <SelectItem value="Poster Presentation">Poster Presentation</SelectItem>
                        <SelectItem value="Oral Presentation">Oral Presentation</SelectItem>
                        <SelectItem value="Conference Paper">Conference Paper</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event">Journal/Conference</Label>
                    <Input
                      id="event"
                      value={currentPublication?.event || ""}
                      onChange={(e) =>
                        setCurrentPublication((prev) => (prev ? { ...prev, event: e.target.value } : null))
                      }
                      placeholder="e.g. European Society for Paediatric Infectious Diseases Annual Meeting"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      value={currentPublication?.date || ""}
                      onChange={(e) =>
                        setCurrentPublication((prev) => (prev ? { ...prev, date: e.target.value } : null))
                      }
                      placeholder="e.g. May 2023"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location/Volume</Label>
                    <Input
                      id="location"
                      value={currentPublication?.location || ""}
                      onChange={(e) =>
                        setCurrentPublication((prev) => (prev ? { ...prev, location: e.target.value } : null))
                      }
                      placeholder="e.g. Ljubljana, Slovenia or Volume 17, Issue 4"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pdfLink">PDF Link (optional)</Label>
                    <Input
                      id="pdfLink"
                      value={currentPublication?.pdfLink || ""}
                      onChange={(e) =>
                        setCurrentPublication((prev) => (prev ? { ...prev, pdfLink: e.target.value } : null))
                      }
                      placeholder="e.g. https://example.com/publication.pdf"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Select
                        value={currentPublication?.color || "blue"}
                        onValueChange={(value) =>
                          setCurrentPublication((prev) => (prev ? { ...prev, color: value } : null))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select color" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blue">Blue</SelectItem>
                          <SelectItem value="green">Green</SelectItem>
                          <SelectItem value="purple">Purple</SelectItem>
                          <SelectItem value="orange">Orange</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="icon">Icon</Label>
                      <Select
                        value={currentPublication?.icon || "FileText"}
                        onValueChange={(value) =>
                          setCurrentPublication((prev) => (prev ? { ...prev, icon: value } : null))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select icon" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FileText">Document</SelectItem>
                          <SelectItem value="Award">Award</SelectItem>
                          <SelectItem value="BookOpen">Book</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsPublicationDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSavePublication} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Trainings Tab */}
          <TabsContent value="trainings">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Trainings Management</CardTitle>
                  <CardDescription>Add, edit, or remove trainings and certifications</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={refreshCurrentSection}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                  </Button>
                  <Button onClick={openNewTrainingDialog} className="flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {trainingsLoading ? (
                  <div className="flex justify-center py-8">
                    <svg
                      className="animate-spin h-8 w-8 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : trainings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No trainings added yet.</div>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {trainings.map((training) => (
                      <Card key={training.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-4 mb-3">
                            <div className="bg-primary/10 p-3 rounded-full">
                              <Award className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg">{training.title}</h3>
                              <div className="flex flex-col text-sm text-muted-foreground mt-1">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  <span>{training.date}</span>
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  <span>{training.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 border-t pt-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1"
                              onClick={() => openEditTrainingDialog(training)}
                            >
                              <Edit className="h-4 w-4" /> Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="flex items-center gap-1 text-destructive"
                              onClick={() => handleDeleteTraining(training.id!)}
                            >
                              <Trash className="h-4 w-4" /> Delete
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Training Dialog */}
            <Dialog open={isTrainingDialogOpen} onOpenChange={setIsTrainingDialogOpen}>
              <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{currentTraining?.id ? "Edit Training" : "Add New Training"}</DialogTitle>
                  <DialogDescription>
                    {currentTraining?.id
                      ? "Update the details of your training or certification."
                      : "Add details about your training or certification."}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={currentTraining?.title || ""}
                      onChange={(e) => setCurrentTraining((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                      placeholder="e.g. Health Research Proposal Development"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      value={currentTraining?.date || ""}
                      onChange={(e) => setCurrentTraining((prev) => (prev ? { ...prev, date: e.target.value } : null))}
                      placeholder="e.g. May 19-24, 2024"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={currentTraining?.location || ""}
                      onChange={(e) =>
                        setCurrentTraining((prev) => (prev ? { ...prev, location: e.target.value } : null))
                      }
                      placeholder="e.g. Nepal"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Select
                      value={currentTraining?.icon || "Award"}
                      onValueChange={(value) => setCurrentTraining((prev) => (prev ? { ...prev, icon: value } : null))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Award">Award</SelectItem>
                        <SelectItem value="FileText">Document</SelectItem>
                        <SelectItem value="BookOpen">Book</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsTrainingDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveTraining} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Skills Management</CardTitle>
                  <CardDescription>Add, edit, or remove technical and personal skills</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={refreshCurrentSection}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                  </Button>
                  <Button onClick={openNewSkillDialog} className="flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {skillsLoading ? (
                  <div className="flex justify-center py-8">
                    <svg
                      className="animate-spin h-8 w-8 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : skills.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No skills added yet.</div>
                ) : (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Technical Skills</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {skills
                          .filter((skill) => skill.type === "technical")
                          .map((skill) => (
                            <Card key={skill.id} className="overflow-hidden hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex items-start space-x-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                      <Star className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                      <h4 className="font-medium">{skill.name}</h4>
                                      <div className="flex items-center mt-1">
                                        <div className="w-full bg-muted rounded-full h-2 mr-2">
                                          <div
                                            className="bg-primary h-2 rounded-full"
                                            style={{ width: `${skill.level}%` }}
                                          ></div>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{skill.level}%</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => openEditSkillDialog(skill)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-destructive"
                                      onClick={() => handleDeleteSkill(skill.id!)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Personal Skills</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        {skills
                          .filter((skill) => skill.type === "personal")
                          .map((skill) => (
                            <Card key={skill.id} className="overflow-hidden hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                      <Star className="h-5 w-5 text-primary" />
                                    </div>
                                    <h4 className="font-medium">{skill.name}</h4>
                                  </div>
                                  <div className="flex">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                      onClick={() => openEditSkillDialog(skill)}
                                    >
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-destructive"
                                      onClick={() => handleDeleteSkill(skill.id!)}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skill Dialog */}
            <Dialog open={isSkillDialogOpen} onOpenChange={setIsSkillDialogOpen}>
              <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{currentSkill?.id ? "Edit Skill" : "Add New Skill"}</DialogTitle>
                  <DialogDescription>
                    {currentSkill?.id
                      ? "Update the details of your skill."
                      : "Add details about your technical or personal skill."}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Skill Name</Label>
                    <Input
                      id="name"
                      value={currentSkill?.name || ""}
                      onChange={(e) => setCurrentSkill((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                      placeholder="e.g. Microsoft Office Suite"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Skill Type</Label>
                    <Select
                      value={currentSkill?.type || "technical"}
                      onValueChange={(value) =>
                        setCurrentSkill((prev) => (prev ? { ...prev, type: value as "technical" | "personal" } : null))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technical Skill</SelectItem>
                        <SelectItem value="personal">Personal Attribute</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {currentSkill?.type === "technical" && (
                    <div className="space-y-2">
                      <Label htmlFor="level">Proficiency Level (%)</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="level"
                          type="number"
                          min="0"
                          max="100"
                          value={currentSkill?.level || 80}
                          onChange={(e) =>
                            setCurrentSkill((prev) =>
                              prev ? { ...prev, level: Number.parseInt(e.target.value) } : null,
                            )
                          }
                        />
                        <span>%</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Select
                      value={currentSkill?.icon || "Star"}
                      onValueChange={(value) => setCurrentSkill((prev) => (prev ? { ...prev, icon: value } : null))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Star">Star</SelectItem>
                        <SelectItem value="FileSpreadsheet">Spreadsheet</SelectItem>
                        <SelectItem value="LineChart">Chart</SelectItem>
                        <SelectItem value="Microscope">Microscope</SelectItem>
                        <SelectItem value="Stethoscope">Stethoscope</SelectItem>
                        <SelectItem value="BookOpen">Book</SelectItem>
                        <SelectItem value="Users">Users</SelectItem>
                        <SelectItem value="Clock">Clock</SelectItem>
                        <SelectItem value="Brain">Brain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsSkillDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveSkill} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Blog Tab */}
          <TabsContent value="blog">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Blog Management</CardTitle>
                  <CardDescription>Add, edit, or remove blog posts</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={refreshCurrentSection}>
                    <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                  </Button>
                  <Button onClick={openNewBlogPostDialog} className="flex items-center gap-1">
                    <Plus className="h-4 w-4" /> Add
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {blogLoading ? (
                  <div className="flex justify-center py-8">
                    <svg
                      className="animate-spin h-8 w-8 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : blogPosts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">No blog posts added yet.</div>
                ) : (
                  <div className="space-y-4">
                    {blogPosts.map((post) => (
                      <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            <div className="sm:w-1/4 h-40 sm:h-auto relative">
                              <img
                                src={post.imageUrl || "/placeholder.svg?height=200&width=200"}
                                alt={post.title}
                                className="w-full h-full object-cover"
                              />
                              {!post.published && <Badge className="absolute top-2 right-2 bg-yellow-500">Draft</Badge>}
                            </div>
                            <div className="p-4 sm:p-6 flex-1">
                              <h3 className="font-bold text-xl mb-2">{post.title}</h3>
                              <div className="flex items-center text-sm text-muted-foreground mb-3">
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{formatDate(post.date)}</span>
                                <span className="mx-2">•</span>
                                <span>{post.author}</span>
                              </div>
                              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                              <div className="flex justify-end gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="flex items-center gap-1"
                                  onClick={() => openEditBlogPostDialog(post)}
                                >
                                  <Edit className="h-4 w-4" /> Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="flex items-center gap-1 text-destructive"
                                  onClick={() => handleDeleteBlogPost(post.id!)}
                                >
                                  <Trash className="h-4 w-4" /> Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Blog Post Dialog */}
            <Dialog open={isBlogPostDialogOpen} onOpenChange={setIsBlogPostDialogOpen}>
              <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{currentBlogPost?.id ? "Edit Blog Post" : "Add New Blog Post"}</DialogTitle>
                  <DialogDescription>
                    {currentBlogPost?.id
                      ? "Update the details of your blog post."
                      : "Add details about your new blog post."}
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={currentBlogPost?.title || ""}
                      onChange={(e) => setCurrentBlogPost((prev) => (prev ? { ...prev, title: e.target.value } : null))}
                      placeholder="e.g. Respiratory Viruses in Children: Current Trends and Challenges"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={currentBlogPost?.excerpt || ""}
                      onChange={(e) =>
                        setCurrentBlogPost((prev) => (prev ? { ...prev, excerpt: e.target.value } : null))
                      }
                      placeholder="A brief summary of your blog post..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={richText}
                      onChange={(e) => setRichText(e.target.value)}
                      placeholder="Write your blog post content here..."
                      rows={10}
                    />
                    <p className="text-xs text-muted-foreground">
                      HTML formatting is supported (e.g., &lt;h2&gt;Heading&lt;/h2&gt;, &lt;p&gt;Paragraph&lt;/p&gt;,
                      &lt;ul&gt;&lt;li&gt;List items&lt;/li&gt;&lt;/ul&gt;)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={currentBlogPost?.author || ""}
                      onChange={(e) =>
                        setCurrentBlogPost((prev) => (prev ? { ...prev, author: e.target.value } : null))
                      }
                      placeholder="e.g. Dr. Saugat Bhandari"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Featured Image</Label>
                    <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-md">
                      {currentBlogPost?.imageUrl && (
                        <div className="relative w-full h-48 mb-4 overflow-hidden rounded-md">
                          <img
                            src={currentBlogPost.imageUrl || "/placeholder.svg"}
                            alt="Featured"
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="h-4 w-4" /> Upload Image
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleBlogImageUpload}
                        className="hidden"
                      />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Recommended size: 1200x630 pixels (16:9 ratio)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Label htmlFor="published" className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        id="published"
                        checked={currentBlogPost?.published || false}
                        onChange={(e) =>
                          setCurrentBlogPost((prev) => (prev ? { ...prev, published: e.target.checked } : null))
                        }
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span>Publish this post</span>
                    </Label>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBlogPostDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveBlogPost} disabled={isSaving}>
                    {isSaving ? "Saving..." : currentBlogPost?.id ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Site Settings</CardTitle>
                  <CardDescription>Control which sections are visible on your website</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={refreshCurrentSection}>
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh
                </Button>
              </CardHeader>
              <CardContent>
                {sectionVisibilityLoading ? (
                  <div className="flex justify-center py-8">
                    <svg
                      className="animate-spin h-8 w-8 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                ) : (
                  <>
                    <div className="space-y-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <Card className="border shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Section Visibility</CardTitle>
                            <CardDescription>Toggle sections to show or hide them on your website</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4 pt-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                  {sectionVisibility.hero ? (
                                    <Eye className="h-4 w-4 text-primary" />
                                  ) : (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                <Label htmlFor="hero-visibility" className="font-medium">
                                  Hero Section
                                </Label>
                              </div>
                              <Switch
                                id="hero-visibility"
                                checked={sectionVisibility.hero}
                                onCheckedChange={(checked) =>
                                  setSectionVisibility((prev) => ({ ...prev, hero: checked }))
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                  {sectionVisibility.about ? (
                                    <Eye className="h-4 w-4 text-primary" />
                                  ) : (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                <Label htmlFor="about-visibility" className="font-medium">
                                  About Section
                                </Label>
                              </div>
                              <Switch
                                id="about-visibility"
                                checked={sectionVisibility.about}
                                onCheckedChange={(checked) =>
                                  setSectionVisibility((prev) => ({ ...prev, about: checked }))
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                  {sectionVisibility.experience ? (
                                    <Eye className="h-4 w-4 text-primary" />
                                  ) : (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                <Label htmlFor="experience-visibility" className="font-medium">
                                  Experience Section
                                </Label>
                              </div>
                              <Switch
                                id="experience-visibility"
                                checked={sectionVisibility.experience}
                                onCheckedChange={(checked) =>
                                  setSectionVisibility((prev) => ({ ...prev, experience: checked }))
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                  {sectionVisibility.education ? (
                                    <Eye className="h-4 w-4 text-primary" />
                                  ) : (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                <Label htmlFor="education-visibility" className="font-medium">
                                  Education Section
                                </Label>
                              </div>
                              <Switch
                                id="education-visibility"
                                checked={sectionVisibility.education}
                                onCheckedChange={(checked) =>
                                  setSectionVisibility((prev) => ({ ...prev, education: checked }))
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                  {sectionVisibility.publications ? (
                                    <Eye className="h-4 w-4 text-primary" />
                                  ) : (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                <Label htmlFor="publications-visibility" className="font-medium">
                                  Publications Section
                                </Label>
                              </div>
                              <Switch
                                id="publications-visibility"
                                checked={sectionVisibility.publications}
                                onCheckedChange={(checked) =>
                                  setSectionVisibility((prev) => ({ ...prev, publications: checked }))
                                }
                              />
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border shadow-sm">
                          <CardHeader className="pb-2">
                            <CardTitle className="text-lg">More Sections</CardTitle>
                            <CardDescription>Control visibility of additional sections</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4 pt-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                  {sectionVisibility.trainings ? (
                                    <Eye className="h-4 w-4 text-primary" />
                                  ) : (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                <Label htmlFor="trainings-visibility" className="font-medium">
                                  Trainings Section
                                </Label>
                              </div>
                              <Switch
                                id="trainings-visibility"
                                checked={sectionVisibility.trainings}
                                onCheckedChange={(checked) =>
                                  setSectionVisibility((prev) => ({ ...prev, trainings: checked }))
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                  {sectionVisibility.skills ? (
                                    <Eye className="h-4 w-4 text-primary" />
                                  ) : (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                <Label htmlFor="skills-visibility" className="font-medium">
                                  Skills Section
                                </Label>
                              </div>
                              <Switch
                                id="skills-visibility"
                                checked={sectionVisibility.skills}
                                onCheckedChange={(checked) =>
                                  setSectionVisibility((prev) => ({ ...prev, skills: checked }))
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                  {sectionVisibility.blog ? (
                                    <Eye className="h-4 w-4 text-primary" />
                                  ) : (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                <Label htmlFor="blog-visibility" className="font-medium">
                                  Blog Section
                                </Label>
                              </div>
                              <Switch
                                id="blog-visibility"
                                checked={sectionVisibility.blog}
                                onCheckedChange={(checked) =>
                                  setSectionVisibility((prev) => ({ ...prev, blog: checked }))
                                }
                              />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="p-2 rounded-full bg-primary/10">
                                  {sectionVisibility.contact ? (
                                    <Eye className="h-4 w-4 text-primary" />
                                  ) : (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                <Label htmlFor="contact-visibility" className="font-medium">
                                  Contact Section
                                </Label>
                              </div>
                              <Switch
                                id="contact-visibility"
                                checked={sectionVisibility.contact}
                                onCheckedChange={(checked) =>
                                  setSectionVisibility((prev) => ({ ...prev, contact: checked }))
                                }
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
                        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        <AlertTitle>Important</AlertTitle>
                        <AlertDescription>
                          Changes to section visibility will be immediately reflected on your website. The Hero section
                          is recommended to remain visible.
                        </AlertDescription>
                      </Alert>

                      <Button onClick={handleSaveSectionVisibility} disabled={isSaving} className="w-full sm:w-auto">
                        {isSaving ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          <span className="flex items-center">
                            <Save className="mr-2 h-4 w-4" /> Save Settings
                          </span>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
