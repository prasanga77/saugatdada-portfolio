// Update the experience section to fetch data from the CMS
"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import SectionHeader from "./section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, Calendar } from "lucide-react"
import { getExperiences, type ExperienceData } from "@/lib/firebase-service"

export default function ExperienceSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [experiences, setExperiences] = useState<ExperienceData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const data = await getExperiences()
        setExperiences(data)
      } catch (error) {
        console.error("Error fetching experiences:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchExperiences()
  }, [])

  if (loading) {
    return (
      <section id="experience" className="py-12">
        <div className="container px-4 md:px-6">
          <SectionHeader
            title="Professional Experience"
            subtitle="My journey in clinical practice and medical research"
          />
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="experience" ref={ref} className="py-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/3 left-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-10"></div>
      <div className="absolute bottom-1/4 right-0 w-40 h-40 bg-primary/5 rounded-full blur-2xl -z-10"></div>

      <div className="container px-4 md:px-6">
        <SectionHeader
          title="Professional Experience"
          subtitle="My journey in clinical practice and medical research"
        />

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -ml-0.5 hidden md:block"></div>

          <div className="space-y-8">
            {" "}
            {/* Reduced from space-y-12 */}
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                className="relative"
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className={`md:flex items-center ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}>
                  {/* Timeline dot */}
                  <motion.div
                    className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full -ml-2 mt-6 hidden md:block"
                    initial={{ scale: 0 }}
                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.2 }}
                  ></motion.div>

                  {/* Content */}
                  <div className="md:w-1/2 md:px-6">
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-primary to-primary/60"></div>
                      <CardHeader className="pb-2 pt-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl font-bold">{exp.title}</CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-1" />
                            {exp.period}
                          </div>
                        </div>
                        <div className="flex items-center text-primary">
                          <Briefcase className="h-4 w-4 mr-2" />
                          <span className="font-medium">{exp.company}</span>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-4">
                        <p>{exp.description}</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Empty space for timeline alignment */}
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

