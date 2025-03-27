"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"
import { Download, FileText, Calendar, MapPin, Mail, Phone } from "lucide-react"
import { getHeroData, type HeroData } from "@/lib/firebase-service"

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0)
  const [heroData, setHeroData] = useState<HeroData>({
    title: "Dr. Saugat Bhandari",
    subtitle: "MBBS",
    description:
      "Looking forward to work as a medical professional, gain experience and learn as well as provide my help to the institution.",
    imageUrl: "/placeholder.svg?height=400&width=400",
    showScrollIndicator: true,
  })
  const [loading, setLoading] = useState(true)
  const ref = useRef(null)

  useEffect(() => {
    const fetchHeroData = async () => {
      try {
        const data = await getHeroData()
        if (data) {
          setHeroData(data)
        }
      } catch (error) {
        console.error("Error fetching hero data:", error)
        // Use default data if there's an error
      } finally {
        setLoading(false)
      }
    }

    fetchHeroData()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleDownloadCV = () => {
    // Create a link element
    const link = document.createElement("a")

    // Set the href to a placeholder PDF URL (in a real app, this would be your actual CV file)
    link.href = "/cv-placeholder.pdf"

    // Set the download attribute with the desired filename
    link.download = "Dr-Saugat-Bhandari-CV.pdf"

    // Append to the document
    document.body.appendChild(link)

    // Trigger the click event
    link.click()

    // Clean up
    document.body.removeChild(link)
  }

  return (
    <section
      ref={ref}
      id="hero"
      className="relative min-h-screen flex items-center pt-24 md:pt-32 pb-12 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/10 to-transparent"></div>

        {/* Animated circles - slowed down */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 12, // Slowed down from 8
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.7, 0.4, 0.7],
          }}
          transition={{
            duration: 15, // Slowed down from 10
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      <div className="container px-4 md:px-6 relative">
        <div className="w-full">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div
              className="space-y-5" // Increased from space-y-4 for more spacing
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="flex items-center space-x-2">
                <div className="h-1 w-10 bg-primary rounded-full"></div>
                <span className="text-primary font-medium">Medical Professional & Researcher</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                {heroData.title.split(" ").map((word, index, array) =>
                  index === array.length - 1 ? (
                    <span key={index} className="text-gradient">
                      {word}
                    </span>
                  ) : (
                    <span key={index}>{word} </span>
                  ),
                )}
              </h1>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-muted-foreground">{heroData.subtitle}</h2>

              <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
                {heroData.description}
              </p>

              <div className="flex flex-wrap gap-4 pt-3">
                {" "}
                {/* Increased from pt-2 */}
                <Link href="#contact">
                  <Button
                    size="lg"
                    className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                  >
                    Contact Me
                  </Button>
                </Link>
                <Link href="#blog">
                  <Button
                    variant="outline"
                    size="lg"
                    className="rounded-full border-2 hover:bg-primary/5 transition-all"
                  >
                    Read My Blog
                  </Button>
                </Link>
              </div>

              {/* Improved CV Download Button */}
              <motion.div
                className="pt-5" // Increased from pt-4
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <button
                  onClick={handleDownloadCV}
                  className="group relative flex items-center gap-3 bg-white dark:bg-gray-800 rounded-full py-3 px-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="bg-primary text-white p-2 rounded-full">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-sm text-muted-foreground">Download</span>
                    <span className="font-semibold">Curriculum Vitae</span>
                  </div>
                  <div className="ml-2 bg-primary/10 p-1.5 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Download className="h-4 w-4 text-primary" />
                  </div>
                </button>
              </motion.div>

              {/* Quick contact info */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-4" // Increased from pt-3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}
              >
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  <span>+977 9849087656</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2 text-primary" />
                  <span>saugatbhandari2014@gmail.com</span>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            >
              <div className="relative w-72 h-72 md:w-[450px] md:h-[450px] mx-auto">
                {/* Decorative elements */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 animate-pulse"></div>

                {/* Outer ring with dots - slowed down animation */}
                <div className="absolute inset-0 rounded-full">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-3 h-3 bg-primary/80 rounded-full animate-pulse-glow"
                      style={{
                        top: `${50 + 46 * Math.sin(i * (Math.PI / 6))}%`,
                        left: `${50 + 46 * Math.cos(i * (Math.PI / 6))}%`,
                        animationDelay: `${i * 0.3}s`, // Slowed down from 0.2s
                        animationDuration: "3s", // Slowed down from default
                      }}
                    ></div>
                  ))}
                </div>

                {/* Circular border with gap - animation slowed in CSS */}
                <div className="absolute inset-4 rounded-full border-4 border-dashed border-primary/30 animate-spin-slow"></div>

                {/* Image container */}
                <div className="absolute inset-8 overflow-hidden rounded-full border-4 border-primary/80 shadow-2xl">
                  <Image
                    src={heroData.imageUrl || "/placeholder.svg?height=400&width=400"}
                    alt="Dr. Saugat Bhandari"
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>

                {/* Floating badges */}
                <div className="absolute -right-4 top-1/4 bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 animate-float">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                  </div>
                </div>

                <div className="absolute -left-4 bottom-1/4 bg-white dark:bg-gray-800 shadow-lg rounded-full p-3 animate-float-delay">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"></path>
                      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"></path>
                      <circle cx="20" cy="10" r="2"></circle>
                    </svg>
                  </div>
                </div>

                {/* Stats cards */}
                <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-3 animate-float">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Experience</div>
                      <div className="font-bold">5+ Years</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -left-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-3 animate-float-delay">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Based in</div>
                      <div className="font-bold">Kathmandu</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Add grid pattern */}
      <style jsx global>{`
      .bg-grid-pattern {
        background-image: 
          linear-gradient(to right, rgba(var(--primary), 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(var(--primary), 0.1) 1px, transparent 1px);
        background-size: 40px 40px;
      }
    `}</style>
    </section>
  )
}

