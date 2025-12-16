import { useMemo, useState } from 'react'
import BlogCard from '../components/BlogCard'
import { blogPosts, tags } from '../data/mockData'

const blogCategories = ['all', 'Lifestyle', 'Skincare', 'Makeup', 'Haircare', 'Wellness']

function Blog() {
  const [blogCategory, setBlogCategory] = useState('all')
  const [blogSearch, setBlogSearch] = useState('')
  const [blogTag, setBlogTag] = useState('all')

  const filteredBlogs = useMemo(() => {
    const keyword = blogSearch.toLowerCase().trim()
    return blogPosts
      .filter((post) =>
        keyword
          ? post.title.toLowerCase().includes(keyword) || post.summary.toLowerCase().includes(keyword)
          : true,
      )
      .filter((post) => (blogCategory === 'all' ? true : post.category === blogCategory))
      .filter((post) => (blogTag === 'all' ? true : post.tags.includes(blogTag)))
  }, [blogCategory, blogSearch, blogTag])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-rose-500">Lifestyle Blog</p>
          <h1 className="text-3xl font-bold text-slate-900">Bộ sưu tập 3 bài viết</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={blogCategory}
            onChange={(e) => setBlogCategory(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
          >
            {blogCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'Tất cả chủ đề' : cat}
              </option>
            ))}
          </select>
          <select
            value={blogTag}
            onChange={(e) => setBlogTag(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
          >
            <option value="all">Tất cả tag</option>
            {tags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4 rounded-2xl bg-slate-50/80 p-4 md:grid-cols-3">
        <div className="space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <p className="text-sm font-semibold text-slate-900">Tìm kiếm</p>
          <input
            value={blogSearch}
            onChange={(e) => setBlogSearch(e.target.value)}
            placeholder="Gõ từ khóa lifestyle, skincare..."
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
          />
          <p className="text-xs text-slate-500">
            Bộ dữ liệu 80 bài: skincare routine, trang điểm, life balance, food, sleep, du lịch, haircare.
          </p>
        </div>
        <div className="md:col-span-2">
          <div className="mb-3 text-sm text-slate-600">{filteredBlogs.length} bài viết phù hợp</div>
          <div className="grid gap-4 sm:grid-cols-2">
            {filteredBlogs.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Blog

