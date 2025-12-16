import { Link, useLocation } from 'react-router-dom'
import { useEffect, useState, useMemo } from 'react'
import AccentBadge from '../components/AccentBadge'
import BlogCard from '../components/BlogCard'
import ProductCard from '../components/ProductCard'
import { blogPosts, brands, products, categories } from '../data/mockData'

function Home() {
  const featuredProducts = products.slice(0, 15) // Hiển thị đủ 15 sản phẩm
  const featuredBlogs = blogPosts.slice(0, 3)
  const morningSteps = ['Làm sạch dịu nhẹ', 'Toner cấp ẩm', 'Serum sáng da', 'Kem dưỡng mỏng nhẹ', 'Chống nắng SPF']
  const nightSteps = ['Tẩy trang / double cleanse', 'Toner cân bằng', 'Serum treatment nhẹ', 'Kem dưỡng phục hồi', 'Mặt nạ ngủ (2-3 lần/tuần)']
  const morningPost = blogPosts.find((p) => p.id === 'blog-routine-morning')
  const nightPost = blogPosts.find((p) => p.id === 'blog-routine-night')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState(null)
  const [heroParallax, setHeroParallax] = useState({ x: 50, y: 50 })
  const [hoveredLetter, setHoveredLetter] = useState(null)
  const [letterPopupPos, setLetterPopupPos] = useState({ x: 0, y: 0, rotation: 0 })
  const [activeLetter, setActiveLetter] = useState('S')
  const [hoverProduct, setHoverProduct] = useState(null)
  const [cosmecticsHoveredLetter, setCosmecticsHoveredLetter] = useState(null)
  const [cosmecticsPopupPos, setCosmecticsPopupPos] = useState({ x: 0, y: 0, rotation: 0, above: true })
  const location = useLocation()

  // SEO Metadata cho trang chủ
  useEffect(() => {
    // Cập nhật title
    document.title = 'Phương Cosmectics - Clean Beauty & Lifestyle | Skincare Routine Sáng Tối'

    // Tạo hoặc cập nhật meta tags
    const metaTags = {
      description: 'Phương Cosmectics - Không gian beauty & lifestyle với routine dịu nhẹ, sản phẩm tinh gọn từ L\'Oréal Paris. Clean beauty, tối giản bước, phục hồi hàng rào da. Bộ sưu tập curated cho sáng & tối kèm hướng dẫn chi tiết.',
      keywords: 'Phương Cosmectics, clean beauty, skincare routine, L\'Oréal Paris, routine sáng tối, serum, kem dưỡng, makeup, haircare, beauty lifestyle, skincare Việt Nam, da nhạy cảm, hàng rào da, tối giản skincare',
      author: 'Phương Cosmectics',
      robots: 'index, follow',
      'og:title': 'Phương Cosmectics - Clean Beauty & Lifestyle | Skincare Routine Sáng Tối',
      'og:description': 'Không gian beauty & lifestyle với routine dịu nhẹ, sản phẩm tinh gọn từ L\'Oréal Paris. Clean beauty, tối giản bước, phục hồi hàng rào da.',
      'og:image': 'https://i.pinimg.com/1200x/cb/9b/a4/cb9ba48306608f283a51cc76836b1db1.jpg',
      'og:url': window.location.href,
      'og:type': 'website',
      'og:site_name': 'Phương Cosmectics',
      'og:locale': 'vi_VN',
      'twitter:card': 'summary_large_image',
      'twitter:title': 'Phương Cosmectics - Clean Beauty & Lifestyle',
      'twitter:description': 'Không gian beauty & lifestyle với routine dịu nhẹ, sản phẩm tinh gọn từ L\'Oréal Paris.',
      'twitter:image': 'https://i.pinimg.com/1200x/cb/9b/a4/cb9ba48306608f283a51cc76836b1db1.jpg',
    }

    // Hàm helper để tạo hoặc cập nhật meta tag
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

    // Áp dụng tất cả meta tags
    Object.entries(metaTags).forEach(([key, value]) => {
      const isProperty = key.startsWith('og:') || key.startsWith('twitter:')
      setMetaTag(key, value, isProperty)
    })

    // Thêm canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', window.location.origin + '/')

    // Cập nhật lang attribute
    document.documentElement.setAttribute('lang', 'vi')

    // Thêm Structured Data (JSON-LD) cho SEO
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Phương Cosmectics',
      description: 'Không gian beauty & lifestyle với routine dịu nhẹ, sản phẩm tinh gọn từ L\'Oréal Paris',
      url: window.location.origin,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: window.location.origin + '/products?search={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    }

    // Thêm Organization schema
    const organizationData = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Phương Cosmectics',
      description: 'Clean beauty, tối giản bước, phục hồi hàng rào da. Bộ sưu tập curated cho sáng & tối kèm hướng dẫn chi tiết.',
      url: window.location.origin,
      logo: window.location.origin + '/logo11.png',
      sameAs: [],
    }

    // Xóa structured data cũ nếu có
    const oldScripts = document.querySelectorAll('script[type="application/ld+json"]')
    oldScripts.forEach((script) => script.remove())

    // Thêm structured data mới
    const script1 = document.createElement('script')
    script1.type = 'application/ld+json'
    script1.textContent = JSON.stringify(structuredData)
    document.head.appendChild(script1)

    const script2 = document.createElement('script')
    script2.type = 'application/ld+json'
    script2.textContent = JSON.stringify(organizationData)
    document.head.appendChild(script2)

    // Cleanup function để xóa meta tags khi component unmount (nếu cần)
    return () => {
      // Xóa structured data khi component unmount
      const scripts = document.querySelectorAll('script[type="application/ld+json"]')
      scripts.forEach((script) => script.remove())
    }
  }, [])

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('.reveal-on-scroll'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.2 },
    )
    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const tiltEls = Array.from(document.querySelectorAll('.tilt-card'))
    const handleMove = (e, el) => {
      const rect = el.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8
      el.style.transform = `perspective(800px) rotateX(${-y}deg) rotateY(${x}deg) translateZ(4px)`
    }
    const handleLeave = (el) => {
      el.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)'
    }
    tiltEls.forEach((el) => {
      const move = (e) => handleMove(e, el)
      const leave = () => handleLeave(el)
      el.addEventListener('mousemove', move)
      el.addEventListener('mouseleave', leave)
      el._tiltMove = move
      el._tiltLeave = leave
    })
    return () => {
      tiltEls.forEach((el) => {
        if (el._tiltMove) el.removeEventListener('mousemove', el._tiltMove)
        if (el._tiltLeave) el.removeEventListener('mouseleave', el._tiltLeave)
      })
    }
  }, [])

  const scrollToId = (id) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  useEffect(() => {
    if (location.pathname === '/about') {
      // small timeout to allow layout/styling to settle before scrolling
      setTimeout(() => scrollToId('about-section'), 60)
    }
  }, [location.pathname])

  const handleCtaScroll = (id) => (e) => {
    e.preventDefault()
    scrollToId(id)
  }

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    const trimmed = newsletterEmail.trim()
    const isEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/i.test(trimmed)
    if (!isEmail) {
      setNewsletterStatus({ type: 'error', message: 'Email chưa hợp lệ. Bạn kiểm tra lại nhé.' })
      return
    }
    setNewsletterStatus({ type: 'success', message: 'Đã nhận email. Chúng tôi sẽ gửi bản tin mỗi tuần!' })
    setNewsletterEmail('')
  }

  const handleHeroMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setHeroParallax({ x, y })
  }

  const letters = Array.from(new Set(categories.map((c) => c[0].toUpperCase())))
  const letterCategoryMap = categories.reduce((acc, c) => {
    const k = c[0].toUpperCase()
    if (!acc[k]) acc[k] = []
    acc[k].push(c)
    return acc
  }, {})
  const filteredProducts = products.filter((p) => p.category[0].toUpperCase() === activeLetter)

  // Map chữ cái -> sản phẩm đầu tiên của category đó
  const letterProductMap = letters.reduce((acc, letter) => {
    const categoryName = categories.find((c) => c[0].toUpperCase() === letter)
    if (categoryName) {
      const firstProduct = products.find((p) => p.category === categoryName)
      if (firstProduct) acc[letter] = firstProduct
    }
    return acc
  }, {})

  const handleLetterHover = (letter, e) => {
    setHoveredLetter(letter)
    const rect = e.currentTarget.getBoundingClientRect()
    // Tạo góc nghiêng ngẫu nhiên từ -8 đến 8 độ
    const randomRotation = (Math.random() - 0.5) * 16
    setLetterPopupPos({
        x: rect.left + rect.width / 2,
        y: rect.bottom - 120,
      rotation: randomRotation,
    })
  }

  const handleLetterLeave = () => {
    setHoveredLetter(null)
  }

  // Map chữ cái trong COSMECTICS -> sản phẩm L'Oréal cụ thể
  const cosmecticsLetterProductMap = useMemo(() => {
    const map = {}
    const lorealProducts = products.filter((p) => p.brand === "L'Oréal Paris")
    
    if (lorealProducts.length === 0) return map
    
    // Map cụ thể từng chữ cái với sản phẩm L'Oréal
    // C - Color Riche hoặc Collagen
    map['C'] = lorealProducts.find((p) => p.name.includes('Color Riche')) || 
               lorealProducts.find((p) => p.name.includes('Collagen')) || 
               lorealProducts.find((p) => p.name.includes('Colour')) ||
               lorealProducts[0]
    
    // O - Original hoặc Oil
    map['O'] = lorealProducts.find((p) => p.name.includes('Original')) || 
               lorealProducts.find((p) => p.name.includes('Oil')) ||
               lorealProducts[1] || lorealProducts[0]
    
    // S - Serum hoặc Skincare
    map['S'] = lorealProducts.find((p) => p.name.includes('Serum')) || 
               lorealProducts.find((p) => p.category === 'Skincare') ||
               lorealProducts[2] || lorealProducts[0]
    
    // M - Mascara hoặc Makeup
    map['M'] = lorealProducts.find((p) => p.name.includes('Mascara')) || 
               lorealProducts.find((p) => p.category === 'Makeup') ||
               lorealProducts[6] || lorealProducts[3] || lorealProducts[0]
    
    // E - Elvive hoặc Extraordinary
    map['E'] = lorealProducts.find((p) => p.name.includes('Elvive')) || 
               lorealProducts.find((p) => p.name.includes('Extraordinary')) ||
               lorealProducts[9] || lorealProducts[4] || lorealProducts[0]
    
    // T - True Match hoặc Telescopic
    map['T'] = lorealProducts.find((p) => p.name.includes('True Match')) || 
               lorealProducts.find((p) => p.name.includes('Telescopic')) ||
               lorealProducts[4] || lorealProducts[7] || lorealProducts[0]
    
    // I - Infallible
    map['I'] = lorealProducts.find((p) => p.name.includes('Infallible')) ||
               lorealProducts[5] || lorealProducts[0]
    
    return map
  }, [])

  const handleCosmecticsLetterHover = (letter, e) => {
    if (cosmecticsLetterProductMap[letter]) {
      setCosmecticsHoveredLetter(letter)
      const rect = e.currentTarget.getBoundingClientRect()
      const randomRotation = (Math.random() - 0.5) * 16
      // Prefer showing the popup below the hovered letter (closer to it).
      // If there isn't enough space below, show it above instead.
      const preferredAboveY = rect.bottom + 10
      const belowY = rect.bottom + 2
      const spaceBelow = typeof window !== 'undefined' ? window.innerHeight - rect.bottom : 9999
      // estimate popup height ~180; if not enough space below, use above when possible
      const useAbove = spaceBelow < 180 && preferredAboveY > 30
      const y = useAbove ? Math.max(6, preferredAboveY) : belowY
      setCosmecticsPopupPos({
        x: rect.left + rect.width / 2,
        y,
        rotation: randomRotation,
        above: useAbove,
      })
    }
  }

  const handleCosmecticsLetterLeave = () => {
    setCosmecticsHoveredLetter(null)
  }

  useEffect(() => {
    setHoverProduct(filteredProducts[0] || null)
  }, [activeLetter])

  return (
    <div className="flex flex-col gap-12">
      {/* Full-bleed hero banner */}
      <section
        className="reveal-on-scroll full-bleed relative isolate -mt-24 sm:-mt-28 mb-8 min-h-screen overflow-visible bg-slate-900/60"
        onMouseMove={handleHeroMove}
        onMouseLeave={() => setHeroParallax({ x: 50, y: 50 })}
        style={{
          backgroundImage:
            "linear-gradient(180deg, rgba(18,38,75,0.4), rgba(18,38,75,0.2)), url('https://i.pinimg.com/1200x/cb/9b/a4/cb9ba48306608f283a51cc76836b1db1.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
        }}
      >
        {/* Overlay gradient ở trên để chữ header dễ đọc */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-900/40 via-slate-900/20 to-transparent" />
        <div
          className="pointer-events-none absolute inset-0 opacity-70 blur-3xl transition-transform duration-300"
          style={{
            background:
              'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 35%), radial-gradient(circle at 75% 60%, rgba(125,182,255,0.28), transparent 40%)',
            transform: `translate3d(${(heroParallax.x - 50) / 10}px, ${(heroParallax.y - 50) / 10}px, 0)`,
          }}
        />
        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-24 pb-14 sm:px-10 sm:pt-28 md:px-16 md:pt-32 lg:px-20">
          <div className="space-y-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-100">Phương Cosmetics</p>
              <div className="leading-[1.6] relative pb-4">
                <div
                  className="font-impact uppercase tracking-[0.02em] drop-shadow-[0_10px_35px_rgba(0,0,0,0.35)] text-left text-[24vw] sm:text-[20vw] md:text-[18vw] lg:text-[16vw] -ml-8 sm:-ml-8 md:-ml-16 lg:-ml-20 whitespace-nowrap"
                  style={{ transform: 'translateX(-3vw)' }}
                >
                {'COSMECTICS'.split('').map((letter, idx) => (
                  <span
                    key={`${letter}-${idx}`}
                    className="inline-block cursor-pointer transition-all duration-200 hover:scale-110 hover:text-sky-200"
                    onMouseEnter={(e) => handleCosmecticsLetterHover(letter, e)}
                    onMouseLeave={handleCosmecticsLetterLeave}
                  >
                    {letter}
                    {idx < 'COSMECTICS'.length - 1 && <span className="mx-[0.02em]"> </span>}
                  </span>
                ))}
              </div>
              {/* Popup sản phẩm khi hover chữ cái trong COSMECTICS */}
              {cosmecticsHoveredLetter && cosmecticsLetterProductMap[cosmecticsHoveredLetter] && (
                <div
                  className="pointer-events-none fixed z-50 w-64 rounded-2xl bg-white/95 p-4 shadow-2xl backdrop-blur-md transition-all duration-300 ease-out"
                  style={{
                    left: `${cosmecticsPopupPos.x}px`,
                    top: `${cosmecticsPopupPos.y}px`,
                    transform: cosmecticsPopupPos.above
                      ? `translate(-50%, -75%) rotate(${cosmecticsPopupPos.rotation}deg)`
                      : `translate(-50%, -8%) rotate(${cosmecticsPopupPos.rotation}deg)`,
                    marginTop: '0px',
                    transformOrigin: cosmecticsPopupPos.above ? 'center bottom' : 'center top',
                  }}
                >
                  <div className="mb-3 h-40 w-full rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden">
                    <img
                      src={cosmecticsLetterProductMap[cosmecticsHoveredLetter].image}
                      alt={`${cosmecticsLetterProductMap[cosmecticsHoveredLetter].name} - ${cosmecticsLetterProductMap[cosmecticsHoveredLetter].category} L'Oréal Paris tại Phương Cosmectics`}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {cosmecticsLetterProductMap[cosmecticsHoveredLetter].category}
                  </p>
                  <h3 className="mb-2 line-clamp-2 text-sm font-bold text-slate-900">
                    {cosmecticsLetterProductMap[cosmecticsHoveredLetter].name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {cosmecticsLetterProductMap[cosmecticsHoveredLetter].salePrice ? (
                        <>
                          <span className="text-base font-bold text-rose-500">
                            {cosmecticsLetterProductMap[cosmecticsHoveredLetter].salePrice.toLocaleString('vi-VN')}₫
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            {cosmecticsLetterProductMap[cosmecticsHoveredLetter].price.toLocaleString('vi-VN')}₫
                          </span>
                        </>
                      ) : (
                        <span className="text-base font-bold text-slate-900">
                          {cosmecticsLetterProductMap[cosmecticsHoveredLetter].price.toLocaleString('vi-VN')}₫
                        </span>
                      )}
                    </div>
                    <span className="flex items-center gap-1 text-xs text-amber-500">
                      ⭐ {cosmecticsLetterProductMap[cosmecticsHoveredLetter].rating}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <p className="max-w-2xl text-base text-sky-50/90 sm:text-lg">
              Clean beauty, tối giản bước, phục hồi hàng rào da. Bộ sưu tập curated cho sáng & tối kèm hướng dẫn chi tiết.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleCtaScroll('products-section')}
                className="hover-lift rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5"
              >
                Xem sản phẩm
              </button>
              <button
                onClick={handleCtaScroll('blog-section')}
                className="hover-lift rounded-full border border-white/60 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Xem blog hướng dẫn
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Hero lifestyle */}
      <section className="reveal-on-scroll relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50 via-white to-cyan-50 p-10 shadow-xl ring-1 ring-rose-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(244,114,182,0.14),transparent_35%),radial-gradient(circle_at_90%_10%,rgba(14,165,233,0.14),transparent_35%),radial-gradient(circle_at_40%_90%,rgba(248,196,249,0.14),transparent_32%)]" />
        <div className="absolute right-8 top-8 h-32 w-32 rotate-6 rounded-full bg-white/70 blur-3xl" />
        <div className="relative grid gap-10 md:grid-cols-[1.5fr_1fr]">
          <div className="space-y-6">
            <div>
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-rose-500 ring-1 ring-rose-100 animate-fade-up">
                ✺ Beauty & Lifestyle
              </p>
              <h1 className="font-display text-4xl font-bold leading-tight text-slate-900 sm:text-5xl animate-fade-up">
                Phong cách sống dịu nhẹ, kể chuyện skincare
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-600 animate-fade-up">
                Ánh nắng sớm, ly cà phê, bàn gỗ và routine tinh giản. Sản phẩm chỉ là phần tiếp theo của hành trình sống đẹp.
              </p>
            </div>
      
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleCtaScroll('products-section')}
                className="hover-lift rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-200 transition hover:bg-rose-600"
              >
                Khám phá sản phẩm
              </button>
              <button
                onClick={handleCtaScroll('blog-section')}
                className="hover-lift rounded-xl border border-rose-200 px-5 py-3 text-sm font-semibold text-rose-600 bg-white/70 hover:bg-rose-50 transition"
              >
                Đọc blog
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-white/85 p-6 shadow-lg ring-1 ring-rose-100">
            <img
              src="https://i.pinimg.com/736x/02/dc/c4/02dcc4d1f689fc340df773cd0fceb997.jpg"
              alt="Beauty lifestyle - Phong cách sống dịu nhẹ với skincare routine và mỹ phẩm L'Oréal Paris"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-white/45 via-white/35 to-cyan-50/20" />
            <p className="text-sm font-semibold text-rose-500">Số liệu nhanh</p>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm font-semibold text-slate-800">
              <button
                onClick={() => scrollToId('products-section')}
                className="tilt-card hover-lift rounded-2xl bg-gradient-to-br from-rose-50 to-rose-100 py-4 text-rose-700 shadow-sm animate-float transition hover:-translate-y-0.5"
              >
                {products.length} sản phẩm
              </button>
              <button
                onClick={() => scrollToId('about-section')}
                className="tilt-card hover-lift rounded-2xl bg-gradient-to-br from-cyan-50 to-sky-100 py-4 text-cyan-700 shadow-sm animate-float transition hover:-translate-y-0.5 [animation-delay:0.3s]"
              >
                {brands.length} thương hiệu
              </button>
              <button
                onClick={() => scrollToId('blog-section')}
                className="tilt-card hover-lift rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100 py-4 text-amber-700 shadow-sm animate-float transition hover:-translate-y-0.5 [animation-delay:0.6s]"
              >
                {blogPosts.length} bài viết
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About us */}
      <section
        id="about-section"
        className="reveal-on-scroll grid gap-6 rounded-3xl bg-white/85 p-6 shadow-lg ring-1 ring-rose-100 md:grid-cols-2"
      >
        <div className="space-y-3">
          <p className="text-sm font-semibold text-rose-500">Về chúng tôi</p>
          <h2 className="font-display text-2xl font-bold text-slate-900">Phương Cosmectics</h2>
          <p className="text-slate-700">
            Một không gian beauty & lifestyle kể chuyện sống đẹp: routine dịu nhẹ, sản phẩm tinh gọn,
            blog truyền cảm hứng, và bộ sưu tập curated của L'Oréal Paris. Chúng tôi ưu tiên trải nghiệm
            thực tế, dễ áp dụng, tôn trọng hàng rào da và thời gian của bạn. Khám phá{' '}
            <Link to="/products" className="font-semibold text-rose-600 hover:text-rose-700 underline">
              bộ sưu tập sản phẩm skincare và makeup
            </Link>{' '}
            hoặc đọc{' '}
            <Link to="/blog" className="font-semibold text-rose-600 hover:text-rose-700 underline">
              các bài viết hướng dẫn skincare routine
            </Link>{' '}
            để tìm hiểu thêm.
          </p>
          <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <div className="hover-lift rounded-2xl bg-rose-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-500">Sản phẩm</p>
              <p className="font-semibold text-slate-900">10 món L’Oréal Paris</p>
              <p className="text-xs text-slate-500">Serum, kem dưỡng, nền, son, mascara, haircare</p>
            </div>
            <div className="hover-lift rounded-2xl bg-cyan-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-600">Blog</p>
              <p className="font-semibold text-slate-900">80 bài viết</p>
              <p className="text-xs text-slate-500">Routine sáng/tối, brand story, lifestyle</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Link
              to="/products"
              className="rounded-xl bg-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-rose-200 transition hover:-translate-y-0.5 hover:bg-rose-600"
            >
              Xem sản phẩm
            </Link>
            <Link
              to="/blog"
              className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
            >
              Đọc blog
            </Link>
          </div>
        </div>
        <div className="overflow-hidden rounded-2xl bg-slate-100">
          <img
            src="https://i.pinimg.com/1200x/cc/3d/9e/cc3d9e61abc91165eca40004d07bd33f.jpg"
            alt="Phương Cosmectics - Không gian beauty & lifestyle với sản phẩm skincare và makeup L'Oréal Paris chất lượng cao"
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      </section>

      {/* Story / Brand philosophy */}
      <section
        id="story-section"
        className="reveal-on-scroll grid gap-6 rounded-3xl bg-white/85 p-6 shadow-lg ring-1 ring-rose-100 md:grid-cols-2"
      >
        <div className="space-y-3">
          <p className="text-sm font-semibold text-rose-500">Câu chuyện</p>
          <h2 className="font-display text-2xl font-bold text-slate-900">Brand philosophy</h2>
          <p className="text-slate-700 leading-relaxed">
  <span className="font-semibold block mb-2">
    Brand Philosophy – Triết lý Phương Cosmetics
  </span>

  Clean beauty, tối giản bước, tập trung phục hồi hàng rào bảo vệ da – đó là
  xuất phát điểm của Phương, nhưng chúng tôi muốn đi xa hơn thế.
  <br />
  <br />

  Đối với chúng tôi, skincare không chỉ là “bôi gì lên mặt”, mà là một
  khoảnh khắc nhỏ trong ngày để bạn thở chậm lại, nhìn mình trong gương
  và nhẹ nhàng chăm sóc chính mình. Vì vậy, mỗi sản phẩm được chọn đều
  phải đáp ứng ba tiêu chí:
  <br />
  <br />

  <span className="block">
    <strong>Sạch &amp; dịu nhẹ:</strong> Thành phần rõ ràng, hạn chế tối đa những
    chất dễ gây kích ứng, ưu tiên cảm giác an toàn cho làn da – đặc biệt
    là da nhạy cảm.
  </span>

  <span className="block mt-1">
    <strong>Tối giản nhưng hiệu quả:</strong> Ít bước hơn, nhưng mỗi bước đều
    “có lý do”. Chúng tôi tránh những routine dài lê thê, tập trung vào
    những sản phẩm cốt lõi giúp da khỏe thật sự từ bên trong.
  </span>

  <span className="block mt-1">
    <strong>Tập trung vào hàng rào bảo vệ da:</strong> Một làn da khỏe bắt đầu
    từ skin barrier vững vàng. Tất cả lựa chọn của chúng tôi đều hướng
    đến việc giảm tổn thương, hỗ trợ phục hồi và củng cố lớp màng ẩm
    tự nhiên của da.
  </span>

  <br />

  <span className="block italic">
    Chúng tôi chọn sản phẩm như chọn không khí buổi sáng:
  </span>

  <span className="block font-semibold mt-1">
    Nhẹ – Trong – Và đủ dưỡng chất.
  </span>

  <span className="block mt-1">
    Nhẹ để da không bị “đè nặng” bởi quá nhiều lớp.
    <br />
    Trong – nghĩa là minh bạch, rõ ràng về thành phần, xuất xứ và cách
    hoạt động.
    <br />
    Và đủ dưỡng chất – vừa đủ để da khỏe, không thừa thãi, không phô trương.
  </span>

  <br />

  <span className="block">
    Phương Cosmetics tin rằng:
    <span className="ml-1">✨ Một làn da đẹp không cần phải hoàn hảo, chỉ cần thật sự khỏe và được yêu thương mỗi ngày.</span>
  </span>
</p>

          <div className="flex flex-wrap gap-2 text-sm text-slate-600">
            {['Gentle', 'Hydrating', 'Minimal', 'Sustainable', 'Daily ritual'].map((tag) => (
              <span key={tag} className="rounded-full bg-slate-100 px-3 py-1">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="min-h-64 overflow-hidden rounded-2xl bg-[url('https://images.unsplash.com/photo-1495546968767-f0573cca821e?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
      </section>

      {/* Routine builder */}
      <section id="routine-section" className="reveal-on-scroll space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-rose-500">Routine Builder</p>
            <h2 className="font-display text-2xl font-bold text-slate-900">Sáng & Tối</h2>
            <p className="text-sm text-slate-600">Gợi ý nhanh, dễ áp dụng, ưu tiên dịu nhẹ.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: 'Morning',
              color: 'from-rose-50 to-white',
              steps: morningSteps,
              link: '/blog/blog-routine-morning',
              img:
                morningPost?.cover ||
                'https://images.unsplash.com/photo-1491369767546-6510e1e5b8a7?auto=format&fit=crop&w=900&q=80',
            },
            {
              title: 'Night',
              color: 'from-cyan-50 to-white',
              steps: nightSteps,
              link: '/blog/blog-routine-night',
              img:
                nightPost?.cover ||
                'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80',
            },
          ].map((routine) => (
            <Link
              key={routine.title}
              to={routine.link}
              className={`hover-lift block overflow-hidden rounded-2xl bg-gradient-to-br ${routine.color} shadow-md ring-1 ring-slate-100 transition hover:shadow-lg`}
            >
              <div className="h-40 w-full bg-cover bg-center sm:h-48" style={{ backgroundImage: `url(${routine.img})` }} />
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-900">{routine.title}</h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">5 bước</span>
                </div>
                <ul className="space-y-2 text-sm text-slate-700">
                  {routine.steps.map((step) => (
                    <li key={step} className="flex items-start gap-2">
                      <span className="mt-1 inline-block h-2 w-2 rounded-full bg-rose-400" />
                      {step}
                    </li>
                  ))}
                </ul>
                <div className="mt-4 text-xs font-semibold text-rose-600">Đọc chi tiết →</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section id="products-section" className="reveal-on-scroll space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-rose-500">Featured</p>
            <h2 className="font-display text-2xl font-bold text-slate-900">Curated picks</h2>
            <p className="text-sm text-slate-600">Bộ sưu tập đầy đủ 15 sản phẩm L'Oréal Paris chất lượng.</p>
          </div>
            <Link to="/products" className="hover-lift text-sm font-semibold text-rose-600 hover:text-rose-700">
            Xem tất cả →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Alphabet filter by category initial */}
      <section className="reveal-on-scroll space-y-4 rounded-3xl bg-white/85 p-6 shadow-lg ring-1 ring-rose-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-rose-500">Danh mục theo chữ cái</p>
            <h2 className="font-display text-2xl font-bold text-slate-900">Chọn chữ cái để xem sản phẩm</h2>
            <p className="text-sm text-slate-600">
              Nhấn vào chữ cái đầu của danh mục. Di chuột vào sản phẩm để xem ảnh nhanh.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {letters.map((ch) => (
            <button
              key={ch}
              onClick={() => setActiveLetter(ch)}
              className={`hover-lift rounded-full px-4 py-2 text-sm font-semibold transition ${
                activeLetter === ch
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                  : 'bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-rose-50'
              }`}
            >
              {ch}
              <span className="ml-2 text-xs font-medium text-slate-500">
                {letterCategoryMap[ch]?.join(' / ')}
              </span>
            </button>
          ))}
        </div>

        <div className="relative grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.slice(0, 9).map((product) => (
              <div
                key={product.id}
                className="hover-lift cursor-pointer rounded-2xl border border-slate-100 bg-white p-3 text-sm shadow-sm transition"
                onMouseEnter={() => setHoverProduct(product)}
                onMouseLeave={() => setHoverProduct(null)}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-rose-400">
                  {product.category}
                </p>
                <p className="mt-1 font-semibold text-slate-900 line-clamp-2">{product.name}</p>
                <p className="text-xs text-slate-500">Giá: {(product.salePrice || product.price).toLocaleString()}đ</p>
              </div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                Chưa có sản phẩm cho nhóm này.
              </div>
            )}
          </div>

          <div className="sticky top-24 hidden h-full min-h-[260px] rounded-2xl bg-rose-50/60 p-4 shadow-inner ring-1 ring-rose-100 lg:block">
            {hoverProduct || filteredProducts[0] ? (
              <div className="space-y-3">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-white shadow">
                    <img
                      src={(hoverProduct || filteredProducts[0]).image}
                      alt={`${(hoverProduct || filteredProducts[0]).name} - ${(hoverProduct || filteredProducts[0]).category} L'Oréal Paris mua tại Phương Cosmectics`}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-500">
                    {(hoverProduct || filteredProducts[0]).category}
                  </p>
                  <p className="font-semibold text-slate-900">{(hoverProduct || filteredProducts[0]).name}</p>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {(hoverProduct || filteredProducts[0]).description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
                <p className="text-sm font-semibold">Không có sản phẩm trong nhóm này</p>
                <p className="text-xs">Chọn chữ cái khác để xem sản phẩm.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Journal / Blog */}
      <section id="blog-section" className="reveal-on-scroll space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-rose-500">Journal</p>
            <h2 className="font-display text-2xl font-bold text-slate-900">Bài viết mới</h2>
          </div>
          <Link to="/blog" className="hover-lift text-sm font-semibold text-rose-600 hover:text-rose-700">
            Xem blog →
          </Link>
        </div>
        {/* Layout 2 cột: Featured post bên trái, 2 small posts bên phải */}
        <div className="grid gap-4 md:grid-cols-[1fr_0.8fr]">
          {/* Featured post - Cột trái */}
          <div>
            {featuredBlogs[0] && (
              <BlogCard key={featuredBlogs[0].id} post={featuredBlogs[0]} variant="featured" />
            )}
          </div>
          {/* Small posts - Cột phải */}
          <div className="flex flex-col gap-4">
            {featuredBlogs.slice(1, 3).map((post) => (
              <BlogCard key={post.id} post={post} variant="small" />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section
        id="newsletter-section"
        className="reveal-on-scroll rounded-3xl bg-gradient-to-r from-rose-500 via-rose-400 to-orange-300 p-6 text-white shadow-xl"
      >
        <div className="grid gap-4 md:grid-cols-[1.5fr_1fr] md:items-center">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em]">Newsletter</p>
            <h3 className="text-2xl font-bold">Nhận tips sống đẹp mỗi tuần</h3>
            <p className="text-sm text-rose-50">Routine mẫu, checklist du lịch, curated sản phẩm dịu nhẹ và khuyến mãi sớm.</p>
          </div>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="Email của bạn"
              className="w-full rounded-2xl border-0 px-4 py-3 text-sm text-slate-900 ring-2 ring-white/40 focus:ring-white"
            />
            <button className="hover-lift rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-rose-300 transition">
              Đăng ký
            </button>
          </form>
          {newsletterStatus && (
            <div
              className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                newsletterStatus.type === 'success' ? 'bg-white/20 text-white' : 'bg-white/10 text-rose-50'
              }`}
            >
              {newsletterStatus.message}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home

