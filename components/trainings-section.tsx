"use client"

// Update the trainings section to fetch data from the CMS
import { useEffect, useState } from "react"
import SectionHeader from "./section-header"
import { Card, CardContent } from "@/components/ui/card"
import { Award, Calendar, MapPin } from "lucide-react"
import { getTrainings, type TrainingData } from "@/lib/firebase-service"

export default function TrainingsSection() {
  const [trainings, setTrainings] = useState<TrainingData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const data = await getTrainings()
        setTrainings(data)
      } catch (error) {
        console.error("Error fetching trainings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrainings()
  }, [])

  if (loading) {
    return (
      <section id="trainings" className="py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <SectionHeader
            title="Trainings & Certifications"
            subtitle="Professional development and specialized training courses"
          />
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="trainings" className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <SectionHeader
          title="Trainings & Certifications"
          subtitle="Professional development and specialized training courses"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {trainings.map((training, index) => (
            <Card key={training.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg">{training.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{training.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{training.location}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

