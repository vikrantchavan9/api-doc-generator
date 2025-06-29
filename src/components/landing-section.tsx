"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, Sparkles, Github, Shield } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import Image from "next/image";
import logo from "@/assets/logo5.png"

interface LandingSectionProps {
     onUploadClick: () => void
     onPasteClick: () => void
     onSampleClick: () => void
}

export function LandingSection({ onUploadClick, onPasteClick, onSampleClick }: LandingSectionProps) {
     return (
          <div className="min-h-screen flex flex-col">
               {/* Header */}
               <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="container flex h-16 items-center justify-between">
                         <div className="flex items-center space-x-2">

                              <Image src={logo} className="rounded-full" alt="logo" width={35} height={35} />

                              <span className="font-bold text-md">API DOC GENERATOR</span>
                         </div>
                         <ThemeToggle />
                    </div>
               </header>

               {/* Hero Section */}
               <main className="flex-1 flex items-center justify-center px-4 py-16">
                    <div className="max-w-4xl mx-auto text-center space-y-8">
                         <div className="space-y-4">
                              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                                   API Documentation
                                   <span className="text-primary"> Generator</span>
                              </h1>
                              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                                   Generate clean, AI-enhanced API docs from your JSON schema in seconds. Transform complex API structures
                                   into beautiful, readable documentation.
                              </p>
                         </div>

                         {/* Action Cards */}
                         <div className="grid md:grid-cols-3 gap-6 mt-12">
                              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onUploadClick}>
                                   <CardContent className="p-6 text-center space-y-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                                             <Upload className="h-6 w-6 text-primary" />
                                        </div>
                                        <h2 className="font-semibold text-lg">Upload JSON</h2>
                                        <p className="text-sm text-muted-foreground">
                                             Upload your JSON schema file and let AI generate comprehensive documentation
                                        </p>
                                        <Button className="w-full">Choose File</Button>
                                   </CardContent>
                              </Card>

                              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onPasteClick}>
                                   <CardContent className="p-6 text-center space-y-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                                             <FileText className="h-6 w-6 text-primary" />
                                        </div>
                                        <h2 className="font-semibold text-lg">Paste JSON</h2>
                                        <p className="text-sm text-muted-foreground">
                                             Paste your JSON directly into our advanced code editor with syntax highlighting
                                        </p>
                                        <Button className="w-full">Start Editing</Button>
                                   </CardContent>
                              </Card>

                              <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onSampleClick}>
                                   <CardContent className="p-6 text-center space-y-4">
                                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                                             <Sparkles className="h-6 w-6 text-primary" />
                                        </div>
                                        <h2 className="font-semibold text-lg">Try Sample</h2>
                                        <p className="text-sm text-muted-foreground">
                                             Explore with our sample JSON to see the power of AI-generated documentation
                                        </p>
                                        <Button className="w-full">Load Sample</Button>
                                   </CardContent>
                              </Card>
                         </div>

                         {/* Features */}
                         <div className="mt-16 grid md:grid-cols-3 gap-8 text-left">
                              <div className="space-y-2">
                                   <h4 className="font-semibold">AI-Powered Descriptions</h4>
                                   <p className="text-sm text-muted-foreground">
                                        Automatically generate meaningful descriptions for your API endpoints and fields
                                   </p>
                              </div>
                              <div className="space-y-2">
                                   <h4 className="font-semibold">Multiple Export Formats</h4>
                                   <p className="text-sm text-muted-foreground">
                                        Export your documentation as Markdown, HTML, or PDF for any use case
                                   </p>
                              </div>
                              <div className="space-y-2">
                                   <h4 className="font-semibold">Interactive Editor</h4>
                                   <p className="text-sm text-muted-foreground">
                                        Edit and customize descriptions inline with our intuitive interface
                                   </p>
                              </div>
                         </div>
                    </div>
               </main>

               {/* Footer */}
               <footer className="border-t py-6">
                    <div className="container flex items-center justify-center space-x-6 text-sm text-muted-foreground">
                         <a href="https://www.github.com/vikrantchavan9" className="flex items-center space-x-1 hover:text-foreground">
                              <Github className="h-4 w-4" />
                              <span>GitHub</span>
                         </a>
                         <a href="#" className="hover:text-foreground">
                              Terms
                         </a>
                         <a href="#" className="flex items-center space-x-1 hover:text-foreground">
                              <Shield className="h-4 w-4" />
                              <span>Privacy</span>
                         </a>
                    </div>
               </footer>
          </div>
     )
}
