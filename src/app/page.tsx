"use client"

import { useState } from "react"
import { LandingSection } from "@/components/landing-section"
import { EditorSection } from "@/components/editor-section"
import { PreviewSection } from "@/components/preview-section"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

// Import your existing types
import type { Field, AIResponseField, ResultItem } from "@/types/api"

type ViewMode = "landing" | "editor" | "preview"

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewMode>("landing")
  const [input, setInput] = useState<string>("")
  const [result, setResult] = useState<ResultItem[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [aiLoading, setAiLoading] = useState<boolean>(false)
  const { toast } = useToast()

  const handleParseSubmit = async () => {
    if (!input.trim()) {
      toast({
        title: "Error",
        description: "Please provide JSON input",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        body: input,
        headers: { "Content-Type": "application/json" },
      })

      if (!res.ok) {
        throw new Error("Failed to parse JSON")
      }

      const data: ResultItem[] = await res.json()
      setResult(data)
      setCurrentView("preview")

      toast({
        title: "Success",
        description: `JSON parsed successfully! Found ${data.length} fields.`,
      })
    } catch (err) {
      console.error("Parse failed:", err)
      toast({
        title: "Parse Error",
        description: "Invalid JSON format. Please check your input.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAiSubmit = async () => {
    const fields: Field[] = result
      .map((item) => ({ path: item.path, type: item.type }))
      .filter((f: Field) => f.path && f.type)

    if (fields.length === 0) {
      toast({
        title: "Error",
        description: "No valid fields to process",
        variant: "destructive",
      })
      return
    }

    setAiLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fields }),
      })

      if (!res.ok) {
        throw new Error("AI service error")
      }

      const raw = await res.json()
      const responseText = raw.text || raw.completion || JSON.stringify(raw)
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/)
      const cleaned = jsonMatch ? jsonMatch[1] : responseText
      const data: AIResponseField[] = JSON.parse(cleaned)

      if (!Array.isArray(data)) {
        throw new Error("Invalid AI response format")
      }

      const cleanPath = (path: string) =>
        path
          .replace(/`/g, "")
          .replace(/^\d+\./, "")
          .trim()

      const updated: ResultItem[] = result.map((item) => {
        const found = data.find((f: AIResponseField) => {
          const cleanedAI = cleanPath(f.path)
          const cleanedItem = cleanPath(item.path)
          return cleanedAI === cleanedItem
        })

        return {
          ...item,
          description: found?.description || item.description,
        }
      })

      setResult(updated)
      const filledCount = updated.filter((r) => r.description?.trim()).length

      toast({
        title: "AI Descriptions Generated",
        description: `Successfully generated descriptions for ${filledCount} fields.`,
      })
    } catch (err) {
      console.error("AI generation failed:", err)
      toast({
        title: "AI Error",
        description: "Failed to generate descriptions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setAiLoading(false)
    }
  }

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string
        const parsed = JSON.parse(text)
        setInput(JSON.stringify(parsed, null, 2))
        setCurrentView("editor")

        toast({
          title: "File Loaded",
          description: "JSON file loaded successfully",
        })
      } catch (err) {
        console.error("File parse failed:", err)
        toast({
          title: "File Error",
          description: "Invalid JSON file format",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  const loadSampleData = () => {
    const sampleJson = {
      user: {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
        profile: {
          age: 30,
          location: "New York",
          preferences: {
            theme: "dark",
            notifications: true,
          },
        },
      },
      posts: [
        {
          id: 1,
          title: "Sample Post",
          content: "This is a sample post content",
          published: true,
          tags: ["sample", "demo"],
        },
      ],
    }

    setInput(JSON.stringify(sampleJson, null, 2))
    setCurrentView("editor")

    toast({
      title: "Sample Loaded",
      description: "Sample JSON data loaded for testing",
    })
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background">
        {currentView === "landing" && (
          <LandingSection
            onUploadClick={() => setCurrentView("editor")}
            onPasteClick={() => setCurrentView("editor")}
            onSampleClick={loadSampleData}
          />
        )}

        {currentView === "editor" && (
          <EditorSection
            input={input}
            setInput={setInput}
            onParse={handleParseSubmit}
            onFileUpload={handleFileUpload}
            loading={loading}
            onBack={() => setCurrentView("landing")}
          />
        )}

        {currentView === "preview" && (
          <PreviewSection
            result={result}
            setResult={setResult}
            onAiGenerate={handleAiSubmit}
            aiLoading={aiLoading}
            onBack={() => setCurrentView("editor")}
            onEdit={() => setCurrentView("editor")}
          />
        )}

        <Toaster />
      </div>
    </ThemeProvider>
  )
}
