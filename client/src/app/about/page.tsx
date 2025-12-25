"use client";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Twitter, Github, Linkedin, Heart, Coffee } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-slate-100 dark:to-slate-400 bg-clip-text text-transparent mb-6">
            About Pensieve
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Welcome to our corner of the internet where ideas come to life,
            stories unfold, and knowledge is shared with passion.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-12 border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <Heart className="h-6 w-6 text-red-500" />
              <h2 className="text-3xl font-semibold">Our Mission</h2>
            </div>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              We believe in the power of storytelling and knowledge sharing. Our
              blog serves as a platform where technology meets creativity, where
              complex ideas are simplified, and where every reader can find
              something valuable to take away.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">📚</span>
                </div>
                <h3 className="font-semibold mb-2">Educational</h3>
                <p className="text-sm text-muted-foreground">
                  Sharing knowledge and insights
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="font-semibold mb-2">Innovative</h3>
                <p className="text-sm text-muted-foreground">
                  Exploring cutting-edge topics
                </p>
              </div>
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-sm text-muted-foreground">
                  Building connections together
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Author Section */}
        <Card className="mb-12 border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                <Image
                  src="/placeholder.svg?height=200&width=200" // Replace with actual author image URL
                  alt="Author profile"
                  width={200}
                  height={200}
                  className="rounded-full border-4 border-white shadow-lg"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-semibold mb-4">Meet the Author</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Hi I am Anurag Dahal a passionate developer with over 2 years
                  of experience in the tech industry.The main moto was to build
                  a platform where sharing content is easy and accessible to
                  everyone. I would love to connect with you and share my
                  knowledge with you.
                </p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                  <Badge variant="secondary">JavaScript</Badge>
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Next.js</Badge>
                  <Badge variant="secondary">Node.js</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                </div>
                <div className="flex gap-4 justify-center md:justify-start">
                  <Button variant="outline" size="icon">
                    <Twitter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What You'll Find Section */}
        <Card className="mb-12 border-0 shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-3xl font-semibold mb-6 text-center">
              What You&apos;ll Find Here
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">💻</span>
                  Tech Tutorials
                </h3>
                <p className="text-muted-foreground mb-4">
                  Step-by-step guides on the latest technologies, frameworks,
                  and development practices.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Web Development</li>
                  <li>• Mobile Apps</li>
                  <li>• DevOps & Cloud</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">💡</span>
                  Industry Insights
                </h3>
                <p className="text-muted-foreground mb-4">
                  Analysis of trends, best practices, and the future of
                  technology.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Market Analysis</li>
                  <li>• Career Advice</li>
                  <li>• Tech Reviews</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Project Showcases
                </h3>
                <p className="text-muted-foreground mb-4">
                  Real-world projects with code examples and detailed
                  explanations.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Open Source Projects</li>
                  <li>• Case Studies</li>
                  <li>• Code Walkthroughs</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span className="text-2xl">🌱</span>
                  Learning Resources
                </h3>
                <p className="text-muted-foreground mb-4">
                  Curated resources to help you grow and stay updated in tech.
                </p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Book Recommendations</li>
                  <li>• Course Reviews</li>
                  <li>• Tool Comparisons</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Coffee className="h-6 w-6 text-amber-600" />
              <h2 className="text-3xl font-semibold">Let&apos;s Connect</h2>
            </div>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Have a question, suggestion, or just want to say hello? I&apos;d
              love to hear from you! Feel free to reach out through any of the
              channels below.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild>
                <Link
                  href="mailto:dahal.codecraft@gmail.com"
                  className="flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Send Email
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/contact" className="flex items-center gap-2">
                  Contact Form
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-6">
              Usually responds within 24 hours
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
