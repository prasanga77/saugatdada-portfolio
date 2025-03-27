// Update the publications section to fetch data from the CMS
"use client"

import { useState, useRef, useEffect } from "react"
import { motion, useInView } from "framer-motion"
import SectionHeader from "./section-header"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, MapPin, Download, ExternalLink, Award, BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getPublications, type PublicationData } from "@/lib/firebase-service"

export default function PublicationsSection() {
  const [expandedItem, setExpandedItem] = useState<string | null>("pub1")
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [publications, setPublications] = useState<PublicationData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        const data = await getPublications()
        setPublications(data)
      } catch (error) {
        console.error("Error fetching publications:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPublications()
  }, [])

  // Function to get icon component based on string name
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "FileText":
        return <FileText className="h-5 w-5" />
      case "Award":
        return <Award className="h-5 w-5" />
      case "BookOpen":
        return <BookOpen className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  // Function to get color class based on color string
  const getColorClass = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
      case "green":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
      case "purple":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
      case "orange":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300"
      default:
        return "bg-primary/10 text-primary"
    }
  }

  if (loading) {
    return (
      <section id="publications" className="py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <SectionHeader
            title="Publications & Presentations"
            subtitle="My contributions to medical literature and conference presentations"
          />
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="publications" ref={ref} className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <SectionHeader
          title="Publications & Presentations"
          subtitle="My contributions to medical literature and conference presentations"
        />

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {publications.map((pub, index) => (
            <motion.div
              key={pub.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all overflow-hidden">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/60"></div>
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${getColorClass(pub.color || "blue")}`}>
                      {getIcon(pub.icon || "FileText")}
                    </div>
                    <div className="space-y-3 flex-1">
                      <div>
                        <Badge className={`mb-2 ${getColorClass(pub.color || "blue")}`}>{pub.type}</Badge>
                        <h3 className="font-bold text-lg">{pub.title}</h3>
                      </div>
                      <p className="text-muted-foreground">{pub.event}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{pub.date}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{pub.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-2">
                        {pub.pdfLink && (
                          <Button variant="outline" size="sm" className="flex items-center" asChild>
                            <a href={pub.pdfLink} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-2" />
                              Download PDF
                            </a>
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

