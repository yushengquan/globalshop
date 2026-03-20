'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import api from '@/lib/api'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  coverImage: string
  tags: string
  createdAt: string
  viewCount: number
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/blog').then(r => setPosts(r.data.data || [])).finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Blog</h1>
      <p className="text-gray-500 mb-10">Tips, trends, and inspiration for pet lovers & home decorators</p>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group">
              <div className="rounded-2xl overflow-hidden border hover:shadow-lg transition">
                <div className="relative h-48">
                  <Image
                    src={post.coverImage || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600'}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                  />
                </div>
                <div className="p-5">
                  <div className="flex gap-2 mb-2">
                    {(post.tags || '').split(',').slice(0,2).map(t => (
                      <span key={t} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{t.trim()}</span>
                    ))}
                  </div>
                  <h2 className="font-bold text-lg mb-2 group-hover:text-blue-600 transition line-clamp-2">{post.title}</h2>
                  <p className="text-gray-500 text-sm line-clamp-2">{post.excerpt}</p>
                  <p className="text-xs text-gray-400 mt-3">{post.createdAt?.slice(0,10)} · {post.viewCount || 0} views</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
