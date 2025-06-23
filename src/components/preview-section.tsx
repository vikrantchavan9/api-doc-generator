"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ArrowLeft, Edit3, FileText, Code, FileDown, Sparkles, Copy, Check } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import { generateMarkdown } from "@/utils/generateMarkdown"
import type { ResultItem, MarkdownItem } from "@/types/api"

interface PreviewSectionProps {
     result: ResultItem[]
     setResult: (result: ResultItem[]) => void
     onAiGenerate: () => void
     aiLoading: boolean
     onBack: () => void
     onEdit: () => void
}

export function PreviewSection({ result, setResult, onAiGenerate, aiLoading, onBack, onEdit }: PreviewSectionProps) {
     const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
     const { toast } = useToast()

     const groupedResults = result.reduce(
          (acc, item, index) => {
               const pathParts = item.path.split(".")
               const rootKey = pathParts[0] || "root"

               if (!acc[rootKey]) {
                    acc[rootKey] = []
               }
               acc[rootKey].push({ ...item, originalIndex: index })
               return acc
          },
          {} as Record<string, (ResultItem & { originalIndex: number })[]>,
     )

     const handleDescriptionChange = (originalIndex: number, newDescription: string) => {
          const newResult = [...result]
          newResult[originalIndex].description = newDescription
          setResult(newResult)
     }

     const copyToClipboard = async (text: string, index: number) => {
          try {
               await navigator.clipboard.writeText(text)
               setCopiedIndex(index)
               setTimeout(() => setCopiedIndex(null), 2000)
               toast({
                    title: "Copied!",
                    description: "Path copied to clipboard",
               })
          } catch {
               toast({
                    title: "Copy failed",
                    description: "Unable to copy to clipboard",
                    variant: "destructive",
               })
          }
     }

     const downloadJson = () => {
          const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" })
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = "api-documentation.json"
          link.click()
          URL.revokeObjectURL(url)

          toast({
               title: "Download Started",
               description: "JSON file download initiated",
          })
     }

     const downloadMarkdown = () => {
          const itemsForMarkdown: MarkdownItem[] = result.filter(
               (item): item is MarkdownItem => item.description != null && item.description.trim() !== "",
          )

          if (itemsForMarkdown.length === 0) {
               toast({
                    title: "No Content",
                    description: "Add descriptions to generate markdown",
                    variant: "destructive",
               })
               return
          }

          const markdown = generateMarkdown(itemsForMarkdown)
          const blob = new Blob([markdown], { type: "text/markdown" })
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = "api-documentation.md"
          link.click()
          URL.revokeObjectURL(url)

          toast({
               title: "Download Started",
               description: "Markdown file download initiated",
          })
     }

     const filledDescriptions = result.filter((r) => r.description?.trim()).length
     const totalFields = result.length

     return (
          <div className="min-h-screen bg-background">
               {/* Header */}
               <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-16 items-center justify-between">
                         <div className="flex items-center space-x-4">
                              <Button variant="ghost" size="sm" onClick={onBack}>
                                   <ArrowLeft className="h-4 w-4 mr-2" />
                                   Back to Editor
                              </Button>
                              <div className="flex items-center space-x-2">
                                   <FileText className="h-5 w-5" />
                                   <span className="font-semibold">Documentation Preview</span>
                              </div>
                         </div>
                         <div className="flex items-center space-x-2">
                              <ThemeToggle />
                         </div>
                    </div>
               </header>

               {/* Main Content */}
               <main className="container py-8">
                    <div className="max-w-6xl mx-auto space-y-6">
                         {/* Stats and Actions */}
                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div className="space-y-1">
                                   <h1 className="text-3xl font-bold">API Documentation</h1>
                                   <p className="text-muted-foreground">
                                        {filledDescriptions} of {totalFields} fields have descriptions
                                   </p>
                              </div>

                              <div className="flex flex-wrap gap-2">
                                   <Button onClick={onAiGenerate} disabled={aiLoading} variant="outline" className="min-w-[140px]">
                                        {aiLoading ? (
                                             <>
                                                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                                                  Generating...
                                             </>
                                        ) : (
                                             <>
                                                  <Sparkles className="h-4 w-4 mr-2" />
                                                  AI Descriptions
                                             </>
                                        )}
                                   </Button>

                                   <Button variant="outline" onClick={onEdit}>
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        Edit JSON
                                   </Button>

                                   <Button variant="outline" onClick={downloadJson}>
                                        <Code className="h-4 w-4 mr-2" />
                                        Export JSON
                                   </Button>

                                   <Button variant="outline" onClick={downloadMarkdown}>
                                        <FileDown className="h-4 w-4 mr-2" />
                                        Export Markdown
                                   </Button>
                              </div>
                         </div>

                         {/* Progress Bar */}
                         <Card>
                              <CardContent className="pt-6">
                                   <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium">Documentation Progress</span>
                                        <span className="text-sm text-muted-foreground">
                                             {Math.round((filledDescriptions / totalFields) * 100)}%
                                        </span>
                                   </div>
                                   <div className="w-full bg-secondary rounded-full h-2">
                                        <div
                                             className="bg-primary h-2 rounded-full transition-all duration-300"
                                             style={{ width: `${(filledDescriptions / totalFields) * 100}%` }}
                                        />
                                   </div>
                              </CardContent>
                         </Card>

                         {/* Documentation Sections */}
                         <div className="space-y-4">
                              <Accordion type="multiple" defaultValue={Object.keys(groupedResults)} className="w-full">
                                   {Object.entries(groupedResults).map(([groupName, items]) => (
                                        <AccordionItem key={groupName} value={groupName}>
                                             <AccordionTrigger className="text-left">
                                                  <div className="flex items-center justify-between w-full mr-4">
                                                       <span className="font-semibold text-lg capitalize">{groupName}</span>
                                                       <Badge variant="secondary">
                                                            {items.length} field{items.length !== 1 ? "s" : ""}
                                                       </Badge>
                                                  </div>
                                             </AccordionTrigger>
                                             <AccordionContent>
                                                  <div className="space-y-4 pt-4">
                                                       {items.map((item) => (
                                                            <Card
                                                                 key={item.originalIndex}
                                                                 className={`transition-colors ${item.fromAI ? "border-primary/50 bg-primary/5" : ""}`}
                                                            >
                                                                 <CardHeader className="pb-3">
                                                                      <div className="flex items-center justify-between">
                                                                           <div className="flex items-center space-x-2">
                                                                                <code className="text-sm font-mono bg-muted px-2 py-1 rounded">{item.path}</code>
                                                                                <Button
                                                                                     variant="ghost"
                                                                                     size="sm"
                                                                                     onClick={() => copyToClipboard(item.path, item.originalIndex)}
                                                                                >
                                                                                     {copiedIndex === item.originalIndex ? (
                                                                                          <Check className="h-3 w-3" />
                                                                                     ) : (
                                                                                          <Copy className="h-3 w-3" />
                                                                                     )}
                                                                                </Button>
                                                                           </div>
                                                                           <div className="flex items-center space-x-2">
                                                                                <Badge variant="outline">{item.type}</Badge>
                                                                                {item.fromAI && (
                                                                                     <Badge variant="secondary" className="text-xs">
                                                                                          <Sparkles className="h-3 w-3 mr-1" />
                                                                                          AI Generated
                                                                                     </Badge>
                                                                                )}
                                                                           </div>
                                                                      </div>
                                                                 </CardHeader>
                                                                 <CardContent>
                                                                      <div className="space-y-2">
                                                                           <label className="text-sm font-medium">Description</label>
                                                                           <Input
                                                                                placeholder="Add a description for this field..."
                                                                                value={item.description || ""}
                                                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                                                     handleDescriptionChange(item.originalIndex, e.target.value)
                                                                                }
                                                                                className="w-full"
                                                                           />
                                                                      </div>
                                                                 </CardContent>
                                                            </Card>
                                                       ))}
                                                  </div>
                                             </AccordionContent>
                                        </AccordionItem>
                                   ))}
                              </Accordion>
                         </div>
                    </div>
               </main>
          </div>
     )
}
