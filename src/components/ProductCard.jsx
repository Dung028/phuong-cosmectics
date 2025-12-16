import { Link } from 'react-router-dom'
import AccentBadge from './AccentBadge'

function ProductCard({ product }) {
  const price = product.salePrice ?? product.price
  const hasDiscount = Boolean(product.salePrice)
  const discount = hasDiscount ? Math.round(((product.price - price) / product.price) * 100) : 0

  return (
    <Link
      to={`/products/${product.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-md shadow-rose-50/40 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="h-44 sm:h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          loading="lazy"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {hasDiscount && <AccentBadge>-{discount}%</AccentBadge>}
          <AccentBadge>{product.category}</AccentBadge>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.08em] text-slate-500">{product.brand}</p>
            <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
          </div>
          <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
            ★ {product.rating.toFixed(1)}
          </span>
        </div>
        <p className="text-sm text-slate-600 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-rose-600">
              {price.toLocaleString('vi-VN')}₫
            </span>
            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through">
                {product.price.toLocaleString('vi-VN')}₫
              </span>
            )}
          </div>
          <span
            className={`text-xs font-medium ${
              product.stock > 0 ? 'text-emerald-600' : 'text-slate-400'
            }`}
          >
            {product.stock > 0 ? 'Còn hàng' : 'Tạm hết'}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto text-right text-xs font-semibold text-rose-500 opacity-0 transition group-hover:opacity-100">
          Xem chi tiết →
        </div>
      </div>
    </Link>
  )
}

export default ProductCard

