"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Base64ImageUpload } from "./base64-image-upload"
import { addBlogPost, updateBlogPostWithBase64Image, type BlogPostData } from "@/lib/firebase-service"
import { Loader2 } from "lucide-react"

interface BlogPostFormProps {
  initialData?: Partial<BlogPostData>
  onSuccess?: () => void
  isEdit?: boolean
}

export function BlogPostForm({ initialData, onSuccess, isEdit = false }: BlogPostFormProps) {
  const defaultData: BlogPostData = {
    title: "",
    content: "",
    excerpt: "",
    author: "Dr. Saugat Bhandari",
    date: new Date(),
    imageUrl: "",
    published: true,
    ...initialData,
  }

  const [formData, setFormData] = useState<BlogPostData>(defaultData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }))
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
      if (isEdit && formData.id) {
        await updateBlogPostWithBase64Image(formData.id, formData)
        setSuccess("Blog post updated successfully")
      } else {
        const newData = {
          ...formData,
          date: new Date(), // Set current date for new posts
        }
        await addBlogPost(newData)
        setSuccess("Blog post created successfully")
      }
      onSuccess?.()
    } catch (err: any) {
      console.error("Error saving blog post:", err)
      setError(err.message || "Failed to save blog post")
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
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} rows={2} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea id="content" name="content" value={formData.content} onChange={handleChange} rows={10} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input id="author" name="author" value={formData.author} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label>Featured Image</Label>
        <Base64ImageUpload onUploadComplete={handleImageUpload} currentImage={formData.imageUrl} />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="published" checked={formData.published} onCheckedChange={handleSwitchChange} />
        <Label htmlFor="published">Published</Label>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-500">{success}</p>}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : isEdit ? (
          "Update Post"
        ) : (
          "Create Post"
        )}
      </Button>
    </form>
  )
}

