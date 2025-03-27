"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { uploadFile } from "@/lib/storage-service"
import { Loader2, Upload } from "lucide-react"

interface FileUploadProps {
  onUploadComplete: (url: string) => void
  folder?: string
  accept?: string
  maxSize?: number // in MB
  buttonText?: string
}

export function FileUpload({
  onUploadComplete,
  folder = "uploads",
  accept = "image/*",
  maxSize = 5, // 5MB default
  buttonText = "Upload File",
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size exceeds ${maxSize}MB limit`)
      return
    }

    setError(null)
    setIsUploading(true)

    try {
      const url = await uploadFile(file, folder)
      onUploadComplete(url)
    } catch (err: any) {
      console.error("Upload error:", err)
      setError(err.message || "Failed to upload file")
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("file-upload")?.click()}
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
              {buttonText}
            </>
          )}
        </Button>
      </div>
      <input id="file-upload" type="file" accept={accept} onChange={handleFileChange} className="hidden" />
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  )
}

