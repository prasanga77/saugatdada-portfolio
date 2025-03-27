"use client"

// Update the blog section to fetch data from the CMS
import { useEffect, useState } from "react"
import SectionHeader from "./section-header"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { getBlogPosts, type BlogPostData } from "@/lib/firebase-service"

export default function BlogSection() {
  const [blogPosts, setBlogPosts] = useState<BlogPostData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const data = await getBlogPosts()
        // Only show published posts and limit to 3
        const publishedPosts = data.filter((post) => post.published).slice(0, 3)
        setBlogPosts(publishedPosts)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  if (loading) {
    return (
      <section id="blog" className="py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <SectionHeader title="Blog" subtitle="Medical insights and research updates" />
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="blog" className="py-16 bg-muted/30">
      <div className="container px-4 md:px-6">
        <SectionHeader title="Blog" subtitle="Medical insights and research updates" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-video relative">
                <Image
                  src={post.imageUrl || "/placeholder.svg?height=200&width=400"}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="p-4">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>
                    {post.date instanceof Date
                      ? post.date.toLocaleDateString()
                      : typeof post.date === "string"
                        ? new Date(post.date).toLocaleDateString()
                        : post.date?.toDate().toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-bold text-xl">{post.title}</h3>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-muted-foreground">{post.excerpt}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Link href={`/blog/${post.id}`}>
                  <Button variant="link" className="p-0 h-auto font-medium text-primary flex items-center">
                    Read More <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/blog">
            <Button variant="outline" className="rounded-full">
              View All Posts
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

