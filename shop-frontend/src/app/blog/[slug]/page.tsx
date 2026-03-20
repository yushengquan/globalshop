'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import api from '@/lib/api'

export default function BlogDetailPage() {
  const { slug } = useParams()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      api.get(`/blog/${slug}`).then(r => setPost(r.data.data)).finally(() => setLoading(false))
    }
  }, [slug])

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center text-gray-400">Loading...</div>
  )

  if (!post) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <p className="text-gray-400 mb-4">Post not found.</p>
      <Link href="/blog" className="text-blue-600 hover:underline">← Back to Blog</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/blog" className="text-blue-600 text-sm hover:underline">← Back to Blog</Link>

      <h1 className="text-3xl font-bold mt-6 mb-4">{post.title}</h1>

      <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
        <span>{post.createdAt?.slice(0, 10)}</span>
        <span>{post.viewCount || 0} views</span>
        <div className="flex gap-2">
          {(post.tags || '').split(',').filter(Boolean).map((t: string) => (
            <span key={t} className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs">{t.trim()}</span>
          ))}
        </div>
      </div>

      {post.coverImage && (
        <div className="relative h-72 rounded-2xl overflow-hidden mb-8">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
        </div>
      )}

      <div
        className="prose prose-gray max-w-none text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-12 pt-8 border-t">
        <Link href="/blog" className="text-blue-600 hover:underline text-sm">← More Articles</Link>
      </div>
    </div>
  )
}
