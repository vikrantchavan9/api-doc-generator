"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Upload, Play, FileCheck } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface EditorSectionProps {
     input: string
     setInput: (value: string) => void
     onParse: () => void
     onFileUpload: (file: File) => void
     loading: boolean
     onBack: () => void
}

export function EditorSection({ input, setInput, onParse, onFileUpload, loading, onBack }: EditorSectionProps) {
     const [dragActive, setDragActive] = useState(false)

     const handleDrag = (e: React.DragEvent) => {
          e.preventDefault()
          e.stopPropagation()
          if (e.type === "dragenter" || e.type === "dragover") {
               setDragActive(true)
          } else if (e.type === "dragleave") {
               setDragActive(false)
          }
     }

     const handleDrop = (e: React.DragEvent) => {
          e.preventDefault()
          e.stopPropagation()
          setDragActive(false)

          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
               const file = e.dataTransfer.files[0]
               if (file.type === "application/json" || file.name.endsWith(".json")) {
                    onFileUpload(file)
               }
          }
     }

     const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files && e.target.files[0]) {
               onFileUpload(e.target.files[0])
          }
     }

     return (
          <div className="min-h-screen bg-background">
               {/* Header */}
               <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-16 items-center justify-between">
                         <div className="flex items-center space-x-4">
                              <Button variant="ghost" size="sm" onClick={onBack}>
                                   <ArrowLeft className="h-4 w-4 mr-2" />
                                   Back
                              </Button>
                              <div className="flex items-center space-x-2">
                                   <FileCheck className="h-5 w-5" />
                                   <span className="font-semibold">JSON Editor</span>
                              </div>
                         </div>
                         <ThemeToggle />
                    </div>
               </header>

               {/* Main Content */}
               <main className="container py-8">
                    <div className="max-w-4xl mx-auto space-y-6">
                         <div className="text-center space-y-2">
                              <h1 className="text-3xl font-bold">Input Your JSON Schema</h1>
                              <p className="text-muted-foreground">Upload a file or paste your JSON schema to get started</p>
                         </div>

                         <Tabs defaultValue="paste" className="w-full">
                              <TabsList className="grid w-full grid-cols-2">
                                   <TabsTrigger value="paste">Paste JSON</TabsTrigger>
                                   <TabsTrigger value="upload">Upload File</TabsTrigger>
                              </TabsList>

                              <TabsContent value="paste" className="space-y-4">
                                   <Card>
                                        <CardHeader>
                                             <CardTitle className="flex items-center space-x-2">
                                                  <FileCheck className="h-5 w-5" />
                                                  <span>JSON Schema Editor</span>
                                             </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                             <div className="space-y-2">
                                                  <Label htmlFor="json-input">Paste your JSON schema here</Label>
                                                  <Textarea
                                                       id="json-input"
                                                       placeholder='{"user": {"id": 1, "name": "John Doe", "email": "john@example.com"}}'
                                                       value={input}
                                                       onChange={(e) => setInput(e.target.value)}
                                                       className="min-h-[300px] font-mono text-sm"
                                                  />
                                             </div>

                                             <div className="flex justify-between items-center">
                                                  <div className="text-sm text-muted-foreground">{input.length} characters</div>
                                                  <Button onClick={onParse} disabled={loading || !input.trim()} className="min-w-[120px]">
                                                       {loading ? (
                                                            <>
                                                                 <div className="animate-spin h-4 w-4 mr-2 border-2 border-current border-t-transparent rounded-full" />
                                                                 Parsing...
                                                            </>
                                                       ) : (
                                                            <>
                                                                 <Play className="h-4 w-4 mr-2" />
                                                                 Parse & Generate
                                                            </>
                                                       )}
                                                  </Button>
                                             </div>
                                        </CardContent>
                                   </Card>
                              </TabsContent>

                              <TabsContent value="upload" className="space-y-4">
                                   <Card>
                                        <CardHeader>
                                             <CardTitle className="flex items-center space-x-2">
                                                  <Upload className="h-5 w-5" />
                                                  <span>File Upload</span>
                                             </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                             <div
                                                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                                                            ? "border-primary bg-primary/5"
                                                            : "border-muted-foreground/25 hover:border-muted-foreground/50"
                                                       }`}
                                                  onDragEnter={handleDrag}
                                                  onDragLeave={handleDrag}
                                                  onDragOver={handleDrag}
                                                  onDrop={handleDrop}
                                             >
                                                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                                                  <div className="space-y-2">
                                                       <p className="text-lg font-medium">Drop your JSON file here, or click to browse</p>
                                                       <p className="text-sm text-muted-foreground">Supports .json files up to 10MB</p>
                                                  </div>
                                                  <input type="file" accept=".json" onChange={handleFileInput} className="hidden" id="file-upload" />
                                                  <Button
                                                       variant="outline"
                                                       className="mt-4"
                                                       onClick={() => document.getElementById("file-upload")?.click()}
                                                  >
                                                       Choose File
                                                  </Button>
                                             </div>
                                        </CardContent>
                                   </Card>
                              </TabsContent>
                         </Tabs>
                    </div>
               </main>
          </div>
     )
}
