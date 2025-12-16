import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { brands, categories, products, tags } from '../data/mockData'

const priceRanges = [
  { value: 'all', label: 'Tất cả giá' },
  { value: 'under25', label: 'Dưới 500k' },
  { value: 'mid', label: '500k - 1.000k' },
  { value: 'over50', label: 'Trên 1.000k' },
]

const sortOptions = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'popular', label: 'Bán chạy' },
  { value: 'rating', label: 'Đánh giá cao' },
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
]

function Products() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [brand, setBrand] = useState('all')
  const [tag, setTag] = useState('all')
  const [priceRange, setPriceRange] = useState('all')
  const [sort, setSort] = useState('newest')
  const [showFiltersMobile, setShowFiltersMobile] = useState(false)

  // đọc category từ query ?category=...
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat && categories.includes(cat)) {
      setCategory(cat)
    } else {
      setCategory('all')
    }
  }, [searchParams])

  const filteredProducts = useMemo(() => {
    const priceFilter = (p) => {
      const value = p.salePrice ?? p.price
      if (priceRange === 'under25') return value < 500_000
      if (priceRange === 'mid') return value >= 500_000 && value <= 1_000_000
      if (priceRange === 'over50') return value > 1_000_000
      return true
    }

    const keyword = search.toLowerCase().trim()
    const result = products
      .filter((p) =>
        keyword
          ? p.name.toLowerCase().includes(keyword) ||
            p.brand.toLowerCase().includes(keyword) ||
            p.tags.some((t) => t.toLowerCase().includes(keyword))
          : true,
      )
      .filter((p) => (category === 'all' ? true : p.category === category))
      .filter((p) => (brand === 'all' ? true : p.brand === brand))
      .filter((p) => (tag === 'all' ? true : p.tags.includes(tag)))
      .filter(priceFilter)
      .slice()

    const sorter = {
      newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      popular: (a, b) => b.popularity - a.popularity,
      rating: (a, b) => b.rating - a.rating,
      'price-asc': (a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price),
      'price-desc': (a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price),
    }[sort]

    return result.sort(sorter)
  }, [brand, category, priceRange, search, sort, tag])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-rose-500">Sản phẩm</p>
          <h1 className="text-3xl font-bold text-slate-900">Danh sách + bộ lọc</h1>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
          >
            {priceRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between md:hidden">
        <button
          type="button"
          onClick={() => setShowFiltersMobile((s) => !s)}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-rose-400 focus:outline-none"
        >
          Bộ lọc
        </button>
        <div className="text-sm text-slate-600">{filteredProducts.length} sản phẩm</div>
      </div>

      <div className="grid gap-4 rounded-2xl bg-slate-50/80 p-4 md:grid-cols-4">
        <div className="space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100 md:order-1 order-2 hidden md:block">
          <p className="text-sm font-semibold text-slate-900">Bộ lọc</p>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên, brand, tag..."
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
          />
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500">Danh mục</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
            >
              <option value="all">Tất cả</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500">Thương hiệu</label>
            <select
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
            >
              <option value="all">Tất cả</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500">Tag</label>
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
            >
              <option value="all">Tất cả</option>
              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="md:col-span-3 md:order-2 order-1">
          {/* Mobile collapsible filters */}
          {showFiltersMobile && (
            <div className="mb-4 block md:hidden space-y-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm theo tên, brand, tag..."
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
              />
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-500">Danh mục</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-rose-400 focus:outline-none"
                >
                  <option value="all">Tất cả</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowFiltersMobile(false)} className="flex-1 rounded-xl bg-white/90 border px-3 py-2 text-sm">Đóng</button>
                <button onClick={() => setShowFiltersMobile(false)} className="flex-1 rounded-xl bg-rose-500 text-white px-3 py-2 text-sm">Áp dụng</button>
              </div>
            </div>
          )}
          <div className="mb-4 flex items-center justify-between text-sm text-slate-600">
            <span>{filteredProducts.length} sản phẩm phù hợp</span>
            <span>Dữ liệu mock {products.length} sản phẩm để test UI</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products

