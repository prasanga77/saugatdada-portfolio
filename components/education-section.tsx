// Update the education section to fetch data from the CMS
"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import SectionHeader from "./section-header"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Calendar, MapPin, Award } from "lucide-react"
import { getEducation, type EducationData } from "@/lib/firebase-service"

export default function EducationSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.2 })
  const [education, setEducation] = useState<EducationData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEducation = async () => {
      try {
        const data = await getEducation()
        setEducation(data)
      } catch (error) {
        console.error("Error fetching education data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEducation()
  }, [])

  if (loading) {
    return (
      <section id="education" className="py-12 bg-muted/30">
        <div className="container px-4 md:px-6">
          <SectionHeader title="Education" subtitle="My academic background and qualifications" />
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="education" ref={ref} className="py-12 bg-muted/30 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/5 rounded-full blur-xl -z-10"></div>
      <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-primary/5 rounded-full blur-xl -z-10"></div>

      <div className="container px-4 md:px-6">
        <SectionHeader title="Education" subtitle="My academic background and qualifications" />

        <div className="max-w-4xl mx-auto">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              className="mb-6 relative" // Reduced from mb-8
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Timeline connector */}
              {index < education.length - 1 && (
                <motion.div
                  className="absolute left-8 top-16 bottom-0 w-0.5 bg-primary/20"
                  initial={{ height: 0 }}
                  animate={isInView ? { height: "100%" } : { height: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                ></motion.div>
              )}

              <div className="flex">
                <motion.div
                  className="flex-shrink-0 mr-4"
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : { scale: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10, delay: index * 0.1 }}
                >
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    {index === 0 ? (
                      <Award className="h-8 w-8 text-primary" />
                    ) : (
                      <GraduationCap className="h-8 w-8 text-primary" />
                    )}
                  </div>
                </motion.div>

                <Card className="flex-grow border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-primary to-primary/60"></div>
                  <CardContent className="p-5">
                    {" "}
                    {/* Reduced from p-6 */}
                    <h3 className="font-bold text-xl mb-2">{edu.degree}</h3>
                    <p className="text-lg mb-2">{edu.institution}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{edu.years}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{edu.location}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

