"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Base64ImageUpload } from "./base64-image-upload"
import { updateHeroWithBase64Image } from "@/lib/firebase-service"
import type { HeroData } from "@/lib/firebase-service"
import { Loader2 } from "lucide-react"

interface HeroFormProps {
  initialData: HeroData
  onSuccess?: () => void
}

export function HeroForm({ initialData, onSuccess }: HeroFormProps) {
  const [formData, setFormData] = useState<HeroData>(initialData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, showScrollIndicator: checked }))
  }

  const handleImageUpload = (base64: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: base64 }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      await updateHeroWithBase64Image(formData)
      setSuccess("Hero section updated successfully")
      onSuccess?.()
    } catch (err: any) {
      console.error("Error updating hero:", err)
      setError(err.message || "Failed to update hero section")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input id="subtitle" name="subtitle" value={formData.subtitle} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} rows={4} />
      </div>

      <div className="space-y-2">
        <Label>Profile Image</Label>
        <Base64ImageUpload
          onUploadComplete={handleImageUpload}
          currentImage={formData.imageUrl}
          maxWidth={400} // Smaller width for profile images
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="showScrollIndicator" checked={formData.showScrollIndicator} onCheckedChange={handleSwitchChange} />
        <Label htmlFor="showScrollIndicator">Show Scroll Indicator</Label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-500">{success}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  )
}

