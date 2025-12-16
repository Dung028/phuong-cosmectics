import { useMemo, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import AccentBadge from '../components/AccentBadge'
import ProductCard from '../components/ProductCard'
import { products } from '../data/mockData'
import { useCart } from '../store/cartContext'

function ProductDetail() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const product = products.find((p) => p.id === id)
  const [added, setAdded] = useState(false)

  const related = useMemo(() => {
    if (!product) return []
    return products
      .filter((p) => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
      .slice(0, 4)
  }, [product])

  if (!product) {
    return <div className="py-20 text-center text-lg">Không tìm thấy sản phẩm.</div>
  }

  const price = product.salePrice ?? product.price
  const hasDiscount = Boolean(product.salePrice)
  const discount = hasDiscount ? Math.round(((product.price - price) / product.price) * 100) : 0

  // SEO Metadata cho Product Detail
  useEffect(() => {
    if (!product) return

    document.title = `${product.name} - ${product.brand} | Phương Cosmectics`

    const metaTags = {
      description: `${product.description} Mua ${product.name} chính hãng ${product.brand} giá ${price.toLocaleString('vi-VN')}₫ tại Phương Cosmectics. ${product.category} chất lượng cao, giao hàng nhanh. Xem chi tiết thành phần, cách dùng và đánh giá từ khách hàng.`,
      keywords: `${product.name}, mua ${product.name.toLowerCase()}, ${product.brand}, ${product.category}, ${product.tags.join(', ')}, mỹ phẩm ${product.category.toLowerCase()}, skincare routine, makeup tutorial, review ${product.name.toLowerCase()}`,
      'og:title': `${product.name} - ${product.brand}`,
      'og:description': product.description,
      'og:image': product.image,
      'og:url': window.location.href,
      'og:type': 'product',
      'product:price:amount': price.toString(),
      'product:price:currency': 'VND',
      'product:availability': product.stock > 0 ? 'in stock' : 'out of stock',
      'product:condition': 'new',
      'product:brand': product.brand,
      'product:category': product.category,
      'product:retailer': 'Phương Cosmectics',
      'product:retailer_item_id': product.id,
      'article:author': product.brand,
      'article:published_time': product.createdAt,
      'article:modified_time': new Date().toISOString(),
      'twitter:card': 'summary_large_image',
      'twitter:title': `${product.name} - ${product.brand}`,
      'twitter:description': product.description,
      'twitter:image': product.image,
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
      const isProperty = key.startsWith('og:') || key.startsWith('product:')
      setMetaTag(key, value, isProperty)
    })

    // Structured Data cho Product
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.image,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      category: product.category,
      sku: product.id,
      offers: {
        '@type': 'Offer',
        price: price,
        priceCurrency: 'VND',
        availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        url: window.location.href,
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.rating,
        reviewCount: Math.floor(product.popularity * 10),
        bestRating: 5,
        worstRating: 1,
      },
      ...(product.detailedIngredients && {
        additionalProperty: product.detailedIngredients.map((ing) => ({
          '@type': 'PropertyValue',
          name: ing.name,
          value: `${ing.concentration} - ${ing.function}`,
        })),
      }),
    }

    // BreadcrumbList Schema
    const breadcrumbData = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Trang chủ',
          item: window.location.origin,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Sản phẩm',
          item: `${window.location.origin}/products`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: product.category,
          item: `${window.location.origin}/products?category=${product.category}`,
        },
        {
          '@type': 'ListItem',
          position: 4,
          name: product.name,
          item: window.location.href,
        },
      ],
    }

    // FAQPage Schema
    const faqData = product.faqs && product.faqs.length > 0 ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: product.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    } : null

    // Xóa structured data cũ
    const oldScripts = document.querySelectorAll('script[type="application/ld+json"]')
    oldScripts.forEach((script) => script.remove())

    // Thêm structured data mới
    const scripts = [
      { data: structuredData, id: 'product-schema' },
      { data: breadcrumbData, id: 'breadcrumb-schema' },
      ...(faqData ? [{ data: faqData, id: 'faq-schema' }] : []),
    ]

    scripts.forEach(({ data, id }) => {
      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.id = id
      script.textContent = JSON.stringify(data)
      document.head.appendChild(script)
    })

    return () => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"]')
      scripts.forEach((script) => script.remove())
    }
  }, [product, price])

  return (
    <div className="space-y-10">
      <div className="grid gap-8 rounded-3xl bg-white/80 p-6 shadow-lg ring-1 ring-rose-100 md:grid-cols-2">
        <div className="space-y-4">
          <img src={product.image} alt={product.name} className="w-full rounded-2xl object-cover shadow-md" />
          <div className="flex gap-2">
            <AccentBadge>{product.category}</AccentBadge>
            <AccentBadge>{product.brand}</AccentBadge>
            {hasDiscount && <AccentBadge>-{discount}%</AccentBadge>}
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-xs uppercase tracking-[0.08em] text-slate-500">{product.brand}</p>
          <h1 className="text-3xl font-bold text-slate-900">{product.name}</h1>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
              ★ {product.rating.toFixed(1)}
            </span>
            <span className="text-sm text-slate-500">{product.popularity}% quan tâm</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-rose-600">{price.toLocaleString('vi-VN')}₫</span>
            {hasDiscount && (
              <span className="text-sm text-slate-400 line-through">
                {product.price.toLocaleString('vi-VN')}₫
              </span>
            )}
          </div>
          <p className="text-slate-700">{product.description}</p>
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            <p className="font-semibold text-slate-900 mb-2">Thành phần chính</p>
            <p>{product.ingredients}</p>
            <p className="mt-3 text-xs text-slate-600">
              Tìm hiểu thêm về{' '}
              <Link to="/blog" className="font-semibold text-rose-600 hover:text-rose-700 underline">
                cách sử dụng {product.category.toLowerCase()} đúng cách
              </Link>{' '}
              hoặc{' '}
              <Link to="/products" className="font-semibold text-rose-600 hover:text-rose-700 underline">
                xem các sản phẩm {product.category.toLowerCase()} khác
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
          <button
            className="w-full rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-rose-200 transition hover:bg-rose-600"
            onClick={() => {
              addToCart(product)
              setAdded(true)
              setTimeout(() => setAdded(false), 1800)
            }}
          >
            {added ? 'Đã thêm' : 'Thêm vào giỏ'}
          </button>
        </div>
      </div>

      {/* Chi tiết sản phẩm */}
      <div className="space-y-6 rounded-3xl bg-white/80 p-6 shadow-lg ring-1 ring-rose-100">
        {/* Thành phần chi tiết */}
        {product.detailedIngredients && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Thành phần chi tiết</h2>
            <div className="space-y-3">
              {product.detailedIngredients.map((ingredient, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">{ingredient.name}</h3>
                    {ingredient.concentration && (
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        {ingredient.concentration}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{ingredient.function}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Cách sử dụng */}
        {product.usageInstructions && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Hướng dẫn sử dụng</h2>
            <div className="space-y-3">
              {product.usageInstructions.map((step, idx) => (
                <div key={idx} className="flex gap-4 rounded-xl bg-rose-50/50 p-4">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-500 text-sm font-bold text-white">
                    {idx + 1}
                  </div>
                  <p className="text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Lịch sử hình thành */}
        {product.history && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Lịch sử hình thành</h2>
            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-6">
              <p className="leading-relaxed text-slate-700">{product.history}</p>
            </div>
          </section>
        )}

        {/* Cách bảo quản */}
        {product.storageInstructions && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Hướng dẫn bảo quản</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {product.storageInstructions.map((instruction, idx) => (
                <div key={idx} className="flex gap-3 rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 text-xs font-semibold text-green-700">
                    ✓
                  </div>
                  <p className="text-sm text-slate-700">{instruction}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Lợi ích */}
        {product.benefits && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Lợi ích sản phẩm</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {product.benefits.map((benefit, idx) => (
                <div key={idx} className="flex gap-3 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 p-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-500 text-xs font-semibold text-white">
                    ✓
                  </div>
                  <p className="text-sm font-medium text-slate-700">{benefit}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Lưu ý */}
        {product.warnings && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Lưu ý quan trọng</h2>
            <div className="space-y-3">
              {product.warnings.map((warning, idx) => (
                <div key={idx} className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 text-xs font-semibold text-white">
                    ⚠
                  </div>
                  <p className="text-sm text-slate-700">{warning}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Câu hỏi thường gặp */}
        {product.faqs && product.faqs.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">Câu hỏi thường gặp</h2>
            <div className="space-y-4">
              {product.faqs.map((faq, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-white p-5">
                  <h3 className="mb-2 font-semibold text-slate-900">Q: {faq.question}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">A: {faq.answer}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {related.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Gợi ý liên quan</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail

