// Update the about section to fetch data from the CMS
"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import SectionHeader from "./section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Award, BookOpen, HeartPulse, Microscope, CheckCircle } from "lucide-react"
import { getAboutData, type AboutData } from "@/lib/firebase-service"

export default function AboutSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  const [aboutData, setAboutData] = useState<AboutData>({ bio: "", highlights: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        const data = await getAboutData()
        setAboutData(data)
      } catch (error) {
        console.error("Error fetching about data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAboutData()
  }, [])

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  if (loading) {
    return (
      <section id="about" className="py-12 bg-muted/30">
        <div className="container px-4 md:px-6">
          <SectionHeader
            title="About Me"
            subtitle="Medical professional with a focus on pediatric infectious diseases"
          />
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="about" ref={ref} className="py-12 bg-muted/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 rounded-bl-full -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary/5 rounded-tr-full -z-10"></div>

      <div className="container px-4 md:px-6">
        <SectionHeader title="About Me" subtitle="Medical professional with a focus on pediatric infectious diseases" />

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            className="space-y-4" // Reduced from space-y-6
            variants={container}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
          >
            <motion.div variants={item} className="relative">
              <div className="absolute top-0 left-0 w-12 h-12 -ml-6 -mt-6 bg-primary/10 rounded-full"></div>
              <p className="text-lg relative z-10">{aboutData.bio}</p>
            </motion.div>

            <motion.div variants={item} className="pt-2">
              <h3 className="text-xl font-bold mb-3">Key Highlights</h3>
              <ul className="space-y-2">
                {aboutData.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 mt-1 bg-primary/10 p-1 rounded-full">
                      <CheckCircle className="h-4 w-4 text-primary" />
                    </div>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4" // Reduced from gap-6
            variants={container}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
          >
            <motion.div variants={item}>
              <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardContent className="p-5 flex items-start space-x-4">
                  {" "}
                  {/* Reduced from p-6 */}
                  <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                    <HeartPulse className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Clinical Practice</h3>
                    <p className="text-muted-foreground">Surgery and pediatrics</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardContent className="p-5 flex items-start space-x-4">
                  {" "}
                  {/* Reduced from p-6 */}
                  <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Microscope className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">Research</h3>
                    <p className="text-muted-foreground">Infectious diseases focus</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardContent className="p-5 flex items-start space-x-4">
                  {" "}
                  {/* Reduced from p-6 */}
                  <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">ESPID Rep</h3>
                    <p className="text-muted-foreground">Nepal's representative</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow overflow-hidden group">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardContent className="p-5 flex items-start space-x-4">
                  {" "}
                  {/* Reduced from p-6 */}
                  <div className="bg-primary/10 p-3 rounded-full group-hover:bg-primary/20 transition-colors">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                      Continuous Learning
                    </h3>
                    <p className="text-muted-foreground">Multiple certifications</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

