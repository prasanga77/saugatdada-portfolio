"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export default function RichTextEditor({ value, onChange, placeholder = "Write something..." }: RichTextEditorProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="h-64 border rounded-md bg-muted/20"></div>
  }

  // Simple textarea as a fallback for the rich text editor
  return (
    <div className="rich-text-editor">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[200px] w-full"
        rows={10}
      />
      <div className="text-xs text-muted-foreground mt-2">
        HTML formatting is supported (e.g., &lt;b&gt;bold&lt;/b&gt;, &lt;i&gt;italic&lt;/i&gt;, &lt;ul&gt;&lt;li&gt;list
        items&lt;/li&gt;&lt;/ul&gt;)
      </div>
    </div>
  )
}

