// Update the blog page to fetch data from the CMS
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Calendar, ArrowLeft, ArrowRight } from "lucide-react"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { getBlogPosts, type BlogPostData } from "@/lib/firebase-service"

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPostData[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 6

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const data = await getBlogPosts()
        // Only show published posts
        const publishedPosts = data.filter((post) => post.published)
        setBlogPosts(publishedPosts)
      } catch (error) {
        console.error("Error fetching blog posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage
  const indexOfFirstPost = indexOfLastPost - postsPerPage
  const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost)
  const totalPages = Math.ceil(blogPosts.length / postsPerPage)

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="pt-24 pb-16">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Medical Blog</h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Insights, research updates, and medical perspectives from Dr. Saugat Bhandari
              </p>
              <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
            </div>
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Medical Blog</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Insights, research updates, and medical perspectives from Dr. Saugat Bhandari
            </p>
            <div className="w-24 h-1 bg-primary mx-auto mt-4"></div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {currentPosts.map((post) => (
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

          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }).map((_, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className={
                      currentPage === index + 1 ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""
                    }
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/">
              <Button variant="outline" className="rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

