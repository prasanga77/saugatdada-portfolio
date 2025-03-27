"use client"

// Update the skills section to fetch data from the CMS
import { useEffect, useState } from "react"
import SectionHeader from "./section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  FileSpreadsheet,
  LineChart,
  Microscope,
  Stethoscope,
  BookOpen,
  Users,
  Clock,
  Brain,
  CheckCircle,
  Star,
} from "lucide-react"
import { getSkills, type SkillData } from "@/lib/firebase-service"

export default function SkillsSection() {
  const [skills, setSkills] = useState<SkillData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills()
        setSkills(data)
      } catch (error) {
        console.error("Error fetching skills:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSkills()
  }, [])

  // Function to get icon component based on string name
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "FileSpreadsheet":
        return <FileSpreadsheet className="h-5 w-5 text-primary" />
      case "LineChart":
        return <LineChart className="h-5 w-5 text-primary" />
      case "Microscope":
        return <Microscope className="h-5 w-5 text-primary" />
      case "Stethoscope":
        return <Stethoscope className="h-5 w-5 text-primary" />
      case "BookOpen":
        return <BookOpen className="h-5 w-5 text-primary" />
      case "Users":
        return <Users className="h-5 w-5 text-primary" />
      case "Clock":
        return <Clock className="h-5 w-5 text-primary" />
      case "Brain":
        return <Brain className="h-5 w-5 text-primary" />
      default:
        return <Star className="h-5 w-5 text-primary" />
    }
  }

  if (loading) {
    return (
      <section id="skills" className="py-16">
        <div className="container px-4 md:px-6">
          <SectionHeader title="Skills" subtitle="Technical expertise and personal attributes" />
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  const technicalSkills = skills.filter((skill) => skill.type === "technical")
  const personalSkills = skills.filter((skill) => skill.type === "personal")

  return (
    <section id="skills" className="py-16">
      <div className="container px-4 md:px-6">
        <SectionHeader title="Skills" subtitle="Technical expertise and personal attributes" />

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Technical Skills */}
          <Card className="border-t-4 border-t-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-center">Technical Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {technicalSkills.map((skill) => {
                return (
                  <div key={skill.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-primary/10 p-2 rounded-full mr-3">{getIcon(skill.icon || "Star")}</div>
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: `${skill.level}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Personal Skills */}
          <Card className="border-t-4 border-t-primary">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl text-center">Personal Attributes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {personalSkills.map((skill) => {
                  return (
                    <div key={skill.id} className="flex items-center p-3 bg-muted/50 rounded-lg">
                      <div className="bg-primary/10 p-2 rounded-full mr-3">{getIcon(skill.icon || "Star")}</div>
                      <span className="font-medium">{skill.name}</span>
                      <CheckCircle className="h-5 w-5 text-primary ml-auto" />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

