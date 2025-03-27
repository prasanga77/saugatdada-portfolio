// Update the blog post page to fetch data from the CMS
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Calendar, ArrowLeft, Share2, ThumbsUp, Bookmark } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getBlogPosts, type BlogPostData } from "@/lib/firebase-service"

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<BlogPostData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const posts = await getBlogPosts()
        const foundPost = posts.find((p) => p.id === params.id)

        if (foundPost) {
          setPost(foundPost)
        } else {
          setError(true)
        }
      } catch (err) {
        console.error("Error fetching blog post:", err)
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPost()
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <article className="pt-24 pb-16">
          <div className="container px-4 md:px-6 max-w-4xl">
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </article>
        <Footer />
      </main>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <Link href="/blog">
            <Button>Back to Blog</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <article className="pt-24 pb-16">
        <div className="container px-4 md:px-6 max-w-4xl">
          <Link href="/blog" className="inline-flex items-center text-primary mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to all posts
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {post.date instanceof Date
                    ? post.date.toLocaleDateString()
                    : typeof post.date === "string"
                      ? new Date(post.date).toLocaleDateString()
                      : post.date?.toDate().toLocaleDateString()}
                </span>
              </div>
              <div>|</div>
              <div>{post.author}</div>
            </div>

            <div className="relative aspect-video w-full overflow-hidden rounded-lg mb-8">
              <Image
                src={post.imageUrl || "/placeholder.svg?height=400&width=800"}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex justify-between items-center mb-8 pb-4 border-b">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex items-center">
                  <ThumbsUp className="mr-1 h-4 w-4" /> Like
                </Button>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Share2 className="mr-1 h-4 w-4" /> Share
                </Button>
              </div>
              <Button variant="outline" size="sm" className="flex items-center">
                <Bookmark className="mr-1 h-4 w-4" /> Save
              </Button>
            </div>

            <div
              className="prose prose-lg max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>

          <div className="border-t pt-8 mt-8">
            <h3 className="text-xl font-bold mb-4">About the Author</h3>
            <div className="flex items-start space-x-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image src="/placeholder.svg?height=64&width=64" alt={post.author} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-bold">{post.author}</h4>
                <p className="text-muted-foreground">
                  Medical Professional & Early Career Researcher specializing in infectious diseases with a focus on
                  pediatric populations.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/blog">
              <Button variant="outline" className="rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}

