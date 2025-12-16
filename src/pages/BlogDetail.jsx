import { useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import AccentBadge from '../components/AccentBadge'
import BlogCard from '../components/BlogCard'
import { blogPosts } from '../data/mockData'

function BlogDetail() {
  const { id } = useParams()
  const post = blogPosts.find((p) => p.id === id)

  const related = useMemo(() => {
    if (!post) return []
    return blogPosts
      .filter((p) => p.id !== post.id && (p.category === post.category || p.tags.some((t) => post.tags.includes(t))))
      .slice(0, 4)
  }, [post])

  if (!post) {
    return <div className="py-20 text-center text-lg">Không tìm thấy bài viết.</div>
  }

  const body = Array.isArray(post.body) ? post.body : []
  const tips = Array.isArray(post.tips) ? post.tips : []

  // SEO Metadata cho Blog Detail
  useEffect(() => {
    if (!post) return

    document.title = `${post.title} | Phương Cosmectics Blog`

    const metaTags = {
      description: `${post.summary} Đọc bài viết chi tiết về ${post.category.toLowerCase()} tại Phương Cosmectics. Hướng dẫn skincare routine, makeup tips và beauty lifestyle.`,
      keywords: `${post.title}, ${post.category}, ${post.tags.join(', ')}, skincare routine, makeup tutorial, beauty tips, hướng dẫn làm đẹp`,
      'og:title': post.title,
      'og:description': post.summary,
      'og:image': post.cover,
      'og:url': window.location.href,
      'og:type': 'article',
      'article:author': post.author,
      'article:published_time': post.date,
      'article:section': post.category,
      'article:tag': post.tags.join(', '),
      'twitter:card': 'summary_large_image',
      'twitter:title': post.title,
      'twitter:description': post.summary,
      'twitter:image': post.cover,
    }

    const setMetaTag = (name, content, property = false) => {
      const attribute = property ? 'property' : 'name'
      let meta = document.querySelector(`meta[${attribute}="${name}"]`)
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute(attribute, name)
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', content)
    }

    Object.entries(metaTags).forEach(([key, value]) => {
      const isProperty = key.startsWith('og:') || key.startsWith('article:') || key.startsWith('twitter:')
      setMetaTag(key, value, isProperty)
    })

    // Article Schema
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.summary,
      image: post.cover,
      author: {
        '@type': 'Person',
        name: post.author,
      },
      datePublished: post.date,
      dateModified: post.date,
      articleSection: post.category,
      keywords: post.tags.join(', '),
      wordCount: post.summary.length + (body.length > 0 ? body.join(' ').length : 0),
      timeRequired: `PT${post.readTime}M`,
    }

    // Xóa structured data cũ
    const oldScripts = document.querySelectorAll('script[type="application/ld+json"]')
    oldScripts.forEach((script) => script.remove())

    // Thêm structured data mới
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(articleSchema)
    document.head.appendChild(script)

    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]')
      scripts.forEach((script) => script.remove())
    }
  }, [post, body])

  return (
    <div className="space-y-10">
      <article className="space-y-4 rounded-3xl bg-white/80 p-6 shadow-lg ring-1 ring-rose-100">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <AccentBadge>{post.category}</AccentBadge>
          <span>{new Date(post.date).toLocaleDateString('vi-VN')}</span>
          <span>• {post.readTime} phút đọc</span>
          <span className="font-semibold text-slate-800">Tác giả: {post.author}</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">{post.title}</h1>
        <img 
          src={post.cover} 
          alt={`${post.title} - Hình ảnh minh họa về ${post.category.toLowerCase()} và skincare routine tại Phương Cosmectics`} 
          className="w-full rounded-2xl object-cover"
          loading="lazy"
        />
        <p className="text-lg text-slate-700">{post.summary}</p>
        <div className="rounded-xl bg-blue-50 p-4 text-sm text-slate-700">
          <p className="mb-2">
            <strong>Nội dung liên quan:</strong> Tìm hiểu thêm về{' '}
            <Link to="/products" className="font-semibold text-rose-600 hover:text-rose-700 underline">
              sản phẩm {post.category.toLowerCase()} L'Oréal Paris
            </Link>{' '}
            hoặc{' '}
            <Link to="/blog" className="font-semibold text-rose-600 hover:text-rose-700 underline">
              đọc thêm các bài viết về {post.category.toLowerCase()}
            </Link>
            . Tham khảo thông tin chính thức từ{' '}
            <a 
              href="https://www.loreal-paris.com.vn" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-rose-600 hover:text-rose-700 underline"
            >
              L'Oréal Paris Việt Nam
            </a>{' '}
            để biết thêm chi tiết về sản phẩm.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
            >
              #{tag}
            </span>
          ))}
        </div>
        <div className="space-y-3 text-slate-700">
          {body.length > 0 ? (
            body.map((para, idx) => (
              <p key={idx} className="leading-relaxed">{para}</p>
            ))
          ) : (
            <>
              <p>
                Nội dung chi tiết (mock): lên routine ngắn gọn, tập trung làm sạch - dưỡng ẩm - chống
                nắng, xen kẽ treatment nhẹ, ưu tiên sản phẩm dịu nhẹ và giãn cách ngày dùng.
              </p>
              <p>
                Lifestyle: ngủ đủ, uống nước, vận động nhẹ 20-30 phút mỗi ngày, hạn chế đường và dầu
                chiên, ưu tiên thực phẩm tươi và giàu chất xơ. Dành thời gian thư giãn, tránh stress
                kéo dài.
              </p>
            </>
          )}
          {tips.length > 0 && (
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="mb-2 text-sm font-semibold text-slate-800">Ghi chú nhanh</p>
              <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
                {tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Bài viết liên quan</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <BlogCard key={item.id} post={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogDetail

