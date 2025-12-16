import { Link } from 'react-router-dom'

function BlogCard({ post, variant = 'default' }) {
  // Format date: DD/M/YYYY
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`
  }

  // Get category badge color based on category
  const getCategoryBadgeStyle = (category) => {
    const styles = {
      Skincare: 'bg-blue-600 text-white',
      Makeup: 'bg-cyan-500 text-white',
      Haircare: 'bg-purple-500 text-white',
      Bodycare: 'bg-pink-500 text-white',
      Fragrance: 'bg-amber-500 text-white',
      Wellness: 'bg-green-500 text-white',
    }
    return styles[category] || 'bg-sky-50 text-sky-600 ring-1 ring-sky-100'
  }

  const isFeatured = variant === 'featured'
  const isSmall = variant === 'small'

  return (
    <Link
      to={`/blog/${post.id}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl ${
        isFeatured ? '' : ''
      }`}
    >
      {/* Image */}
      <div className={`relative w-full overflow-hidden ${isFeatured ? 'h-80' : isSmall ? 'h-48' : 'h-56'}`}>
        <img 
          src={post.cover} 
          alt={post.title} 
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" 
          loading="lazy" 
        />
      </div>
      
      {/* Content */}
      <div className={`flex flex-1 flex-col ${isFeatured ? 'gap-4 p-6' : isSmall ? 'gap-2 p-4' : 'gap-3 p-5'}`}>
        {/* Category Badge */}
        <div className={`flex items-center ${isSmall ? 'gap-2' : 'gap-3'}`}>
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getCategoryBadgeStyle(post.category)}`}>
            {post.category}
          </span>
          {!isSmall && (
            <span className="text-xs text-slate-500">
              {formatDate(post.date)} • {post.readTime} phút đọc
            </span>
          )}
        </div>
        
        {/* Title */}
        <h3 className={`font-bold leading-tight text-slate-900 line-clamp-2 group-hover:text-rose-600 transition-colors ${
          isFeatured ? 'text-2xl' : isSmall ? 'text-base' : 'text-xl'
        }`}>
          {post.title}
        </h3>
        
        {/* Description - Only show for featured */}
        {isFeatured && (
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
            {post.summary}
          </p>
        )}
        
        {/* Hashtags - Only show for featured */}
        {isFeatured && (
          <div className="mt-auto flex flex-wrap gap-2 pt-2">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-slate-500"
              >
              #{tag}
            </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

export default BlogCard

