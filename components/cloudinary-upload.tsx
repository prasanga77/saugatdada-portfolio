"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { uploadToCloudinary } from "@/lib/cloudinary-service"
import { Loader2, Upload, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  onUploadComplete: (url: string) => void
  currentImage?: string
  maxSize?: number // in MB
}

export function CloudinaryUpload({
  onUploadComplete,
  currentImage,
  maxSize = 2, // 2MB default
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(currentImage || null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check if it's an image
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file")
      return
    }

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`Image size exceeds ${maxSize}MB limit`)
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    setError(null)
    setIsUploading(true)

    try {
      const url = await uploadToCloudinary(file)
      onUploadComplete(url)
    } catch (err: any) {
      console.error("Upload error:", err)
      setError(err.message || "Failed to upload image")
    } finally {
      setIsUploading(false)
    }
  }

  const clearImage = () => {
    setPreview(null)
    onUploadComplete("")
  }

  return (
    <div className="w-full">
      {preview ? (
        <div className="relative mb-4 overflow-hidden rounded-md border border-gray-200">
          <div className="relative aspect-video w-full">
            <Image
              src={preview || "/placeholder.svg?height=200&width=200"}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute right-2 top-2"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="mb-4 flex aspect-video w-full items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50">
          <div className="text-center">
            <Upload className="mx-auto h-8 w-8 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">Click to upload an image</p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("cloudinary-upload")?.click()}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              {preview ? "Change Image" : "Upload Image"}
            </>
          )}
        </Button>
      </div>
      <input id="cloudinary-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  )
}

