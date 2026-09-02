import { useMemo, useRef, useState } from 'react'
import { ArrowDownToLine, ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, Heart, Menu, Play, Search, SlidersHorizontal, X } from 'lucide-react'
import './App.css'

type Product = { name: string; ref: string; category: string; material: string; dimensions: string; image: string; tone: string; price: string }
const products: Product[] = [
  { name: 'Boules de Noël ', ref: 'Bo-001', category: 'Boules et deco nouvel an', material: '', dimensions: '', image: '/images/cotillons1.jpg', tone: '', price: 'Sur devis' },
  { name: 'Boules de Noël ', ref: 'Bo-002', category: 'Boules et deco nouvel an', material: 'Verre', dimensions: ' packs 12 à 50 pcs', image: '/images/cotillons2.jpg', tone: 'Rouge / bordeaux', price: 'Sur devis' },
  { name: 'Boules de Noël dorées', ref: 'Bo-003', category: 'Boules et deco nouvel an', material: 'Verre', dimensions: '', image: '/images/cottillon3.jpg', tone: 'Or / champagne', price: 'Sur devis ' },
  { name: 'Boules de Noël XXL', ref: 'Bo-004', category: 'Boules et deco nouvel an', material: 'Verre / PVC', dimensions: 'Sur mesure', image: '/images/cotillons4.png', tone: 'Rouge shiny', price: 'Sur devis' },
  { name: 'Sapin premium naturel', ref: 'SA-001', category: 'Sapins', material: 'PVC premium', dimensions: 'H 210 cm', image: '/images/sapin1.jpg', tone: 'Vert naturel', price: 'Sur devis' },
  { name: 'Sapin blanc lumineux', ref: 'SA-002', category: 'Sapins', material: 'Mélange PE', dimensions: 'H 240 cm', image: '/images/sapin2.jpg', tone: 'Blanc / or', price: 'Sur devis' },
  { name: 'Sapin doré impérial', ref: 'SA-003', category: 'Sapins', material: 'PVC', dimensions: 'H 300 cm', image: '/images/sapin3.jpg', tone: 'Or / champagne', price: 'Sur devis' },
  { name: 'Sapin décoré sur mesure', ref: 'SA-004', category: 'Sapins', material: 'PVC / PE', dimensions: 'H 250+ cm', image: '/images/sapin4.jpg', tone: 'Sur mesure', price: 'Sur devis' },
  { name: 'Cotillons de Noël sur mesure', ref: 'PR-001', category: 'cotillons', material: 'Pack sur mesure', dimensions: 'À l’échelle', image: '/images/profess1.jpg', tone: 'Rouge / or', price: 'Sur devis' },
  { name: 'Cotillons de Noël sur mesure', ref: 'PR-002', category: 'cotillons', material: 'Pack sur mesure', dimensions: 'À l’échelle', image: '/images/profess2.jpg', tone: 'Blanc / or', price: 'Sur devis' },
  { name: 'Cotillons de Noël sur mesure', ref: 'PR-003', category: 'cotillons', material: 'Pack sur mesure', dimensions: 'À l’échelle', image: '/images/profess3.jpg', tone: 'Sur mesure', price: 'Sur devis' },
  { name: 'Pack clé en main', ref: 'PR-004', category: 'cotillons', material: 'Forfait complet', dimensions: 'Sur mesure', image: '/images/profess4.jpg', tone: 'Sur mesure', price: 'Sur devis' },
  { name: 'Emballage cadeau', ref: 'EM-001', category: 'Embalage', material: 'Carton / tissu', dimensions: 'Sur mesure', image: '/images/emb1.jpg', tone: 'Rouge / or', price: 'Sur devis' },
  { name: 'Emballage cadeau premium', ref: 'EM-002', category: 'Embalage', material: 'Carton / tissu', dimensions: 'Sur mesure', image: '/images/emb2.jpg', tone: 'Or / blanc', price: 'Sur devis' },
  { name: 'Emballage sur mesure', ref: 'EM-003', category: 'Embalage', material: 'Pack sur mesure', dimensions: 'Sur mesure', image: '/images/emb3.jpg', tone: 'Blanc / argent', price: 'Sur devis' },
  { name: 'Pack emballage complet', ref: 'EM-004', category: 'Embalage', material: 'Pack complet', dimensions: 'Sur mesure', image: '/images/emb4.jpg', tone: 'Sur mesure', price: 'Sur devis' },
  { name: 'Décoration professionnelle 1', ref: 'DE-001', category: 'Décoration professionnel', material: 'Sur mesure', dimensions: 'Sur mesure', image: '/images/dec1.jpg', tone: 'Sur mesure', price: 'Sur devis' },
  { name: 'Décoration professionnelle 2', ref: 'DE-002', category: 'Décoration professionnel', material: 'Sur mesure', dimensions: 'Sur mesure', image: '/images/dec2.jpg', tone: 'Sur mesure', price: 'Sur devis' },
  { name: 'Décoration professionnelle 3', ref: 'DE-003', category: 'Décoration professionnel', material: 'Sur mesure', dimensions: 'Sur mesure', image: '/images/dec3.jpg', tone: 'Sur mesure', price: 'Sur devis' },
  { name: 'Décoration professionnelle 4', ref: 'DE-004', category: 'Décoration professionnel', material: 'Sur mesure', dimensions: 'Sur mesure', image: '/images/dec4.jpg', tone: 'Sur mesure', price: 'Sur devis' },
]
const categories = ['Boules et deco nouvel an', 'Sapins', 'cotillons', 'Embalage', 'Décoration professionnel']
const realisations = ['/images/proj1.jpg', '/images/proj2.jpg', '/images/proj3.jpg', '/images/proj4.jpg']
const catalogTitles: Record<string, string> = { 'Boules et deco nouvel an': 'Catalogue 1', 'Sapins': 'Catalogue 2', 'cotillons': 'Catalogues', 'Embalage': 'Catalogue 5', 'Décoration professionnel': 'Catalogues Décoration' }
const catalogueBaseUrl: string = (import.meta as any).env.VITE_CATALOGUE_BASE_URL || ''
const catalogues: Record<string, { file: string; label: string }[]> = {
  'Boules et deco nouvel an': [{ file: 'catalogue1.pdf', label: 'Télécharger Boules et deco nouvel an  PDF' }],
  'Sapins': [{ file: 'catalogue2.pdf', label: 'Télécharger le PDF' }],
  'cotillons': [
    { file: 'catalogue4.pdf', label: 'Catalogue 4 Cotillons' },
  ],
  'Embalage': [{ file: 'catalogue5.pdf', label: 'Télécharger le PDF' }],
  'Décoration professionnel': [
    { file: 'catalogue3.pdf', label: 'Catalogue 3' },
    { file: 'catalogue6.pdf', label: 'Catalogue 6' },
    { file: 'catalogue7.pdf', label: 'Catalogue 7' },
    { file: 'catalogue8.pdf', label: 'Catalogue 8' },
    { file: 'catalogue9.pdf', label: 'Catalogue 9' },
  ],
}
const catalogPdfUrl = (file: string) => `${catalogueBaseUrl}${file}`

const categoryVideos: Record<string, string> = {
  'Boules et deco nouvel an': '/Video1.mp4',
  'Sapins': '/video3.mp4',
  'cotillons': '/vidieo2.mp4',
  'Embalage': '/video4.mp4',
  'Décoration professionnel': '/Video5.mp4',
}

function CategoryVideo({ src, label }: { src: string; label: string }) {
  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  if (!src || failed) return <div className="video-placeholder">Vidéo à venir — {label}</div>
  const handlePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (playing) { v.pause(); setPlaying(false) }
    else { v.play().then(() => setPlaying(true)).catch(() => {}) }
  }
  return <div className="video-wrapper">
    <video ref={videoRef} src={src} controls={false} loop muted playsInline preload="metadata" onClick={handlePlay} onError={() => setFailed(true)} />
    <button className={`video-play-btn${playing ? ' hidden' : ''}`} onClick={handlePlay} aria-label="Lecture"><Play size={26} fill="currentColor" /></button>
  </div>
}

function App() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Boules et deco nouvel an')
  const [filterOpen, setFilterOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [saved, setSaved] = useState<string[]>([])
  const [realisationIndex, setRealisationIndex] = useState(-1)

  const currentRealisation = realisationIndex === -1 ? '/images/inspiration.jpg' : realisations[realisationIndex]
  const realisationLabel = realisationIndex === -1 ? 'Projet — Tanger' : `Réalisation ${realisationIndex + 1} / ${realisations.length}`
  const showNextRealisation = () => setRealisationIndex((i) => (i + 1) % realisations.length)
  const showPrevRealisation = () => setRealisationIndex((i) => i === -1 ? realisations.length - 1 : (i - 1 + realisations.length) % realisations.length)
  const scrollToInspirations = () => document.getElementById('inspirations')?.scrollIntoView({ behavior: 'smooth' })

  const filtered = useMemo(() => products.filter((p) => p.category === activeCategory && `${p.name} ${p.material} ${p.ref}`.toLowerCase().includes(query.toLowerCase())), [query, activeCategory])
  const toggleSaved = (ref: string) => setSaved((current) => current.includes(ref) ? current.filter((x) => x !== ref) : [...current, ref])
  const openCatalog = (cat: string) => { setActiveCategory(cat); document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' }) }

  return <main>
    <header className="topbar">
      <a className="brand" href="#accueil"><img src="/images/logo.png" alt="SAYZON" /><span className="brand-name">SAYZON <span>Design-Decor</span></span></a>
      <nav className={menuOpen ? 'open' : ''}>
        <a href="#catalogue" className={`nav-tag nav-red${activeCategory === 'Boules et deco nouvel an' ? ' active-nav' : ''}`} onClick={() => openCatalog('Boules et deco nouvel an')}>Boules et deco nouvel an</a>
        <a href="#catalogue" className={`nav-tag nav-green${activeCategory === 'Sapins' ? ' active-nav' : ''}`} onClick={() => openCatalog('Sapins')}>Sapins</a>
        <a href="#catalogue" className={`nav-tag nav-gold${activeCategory === 'cotillons' ? ' active-nav' : ''}`} onClick={() => openCatalog('cotillons')}>cotillons</a>
        <a href="#catalogue" className={`nav-tag nav-blue${activeCategory === 'Embalage' ? ' active-nav' : ''}`} onClick={() => openCatalog('Embalage')}>Embalage</a>
        <a href="#catalogue" className={`nav-tag nav-purple${activeCategory === 'Décoration professionnel' ? ' active-nav' : ''}`} onClick={() => openCatalog('Décoration professionnel')}>Décoration professionnel</a>
        <a href="#contact" className="nav-tag nav-dark">Contact</a>
      </nav>
      <div className="header-actions">
        <button className="language">FR <ChevronDown size={13}/></button>
        <button className="menu" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"><Menu size={23}/></button>
        <a href="#catalogue" onClick={() => openCatalog('Boules et deco nouvel an')} className="catalogue-link">Voir le catalogue <ArrowRight size={15}/></a>
      </div>
    </header>
    <section className="hero" id="accueil"><img src="/images/hero-lobby.jpg" alt="Sapin décoré"/><div className="hero-shade"/><div className="hero-copy"><p className="eyebrow light">Collection 2026 — Hôtellerie</p><h1>Tendances déco Noël 2026 : les styles, couleurs et sapins qui vont faire sensation</h1><p className="hero-text">Des objets singuliers et durables pour imaginer des lieux d’hospitalité à votre image.</p><a href="#catalogue" onClick={() => openCatalog('Boules et deco nouvel an')} className="button-light">Explorer la collection <ArrowRight size={16}/></a></div><div className="hero-index"><span>01</span><div/><span>04</span></div></section>
    <section className="intro" id="services"><p className="eyebrow">Notre parti pris</p><h2>Une décoration qui donne<br/>une âme aux lieux.</h2><div className="intro-bottom"><p className="intro-columns">À vos envies sur le thème que vous voulez présenter cette année :<br/>- Sapins décorés traditionnels doré, rouge<br/>- Sapins décorés dans les tons rosé, nacré, + une autre couleur de votre choix<br/>- Thème automnal avec des couleurs variées comme marron, brun, vert<br/>- Thème glace argenté, blanc, transparent<br/>- Thème bleu avec une palette de plusieurs tons.<br/><br/>Accompagnés de branches, guirlandes et figurines, qui s'intègrent dans le thème choisi.<br/><br/>Vous pouvez choisir vous-même tous les articles, ou comme l'année précédente,<br/>optez pour le pack pour le sapin de 8 mètres (ce qui représente environ 800 à 1200<br/>pièces, tout confondu, selon la taille des articles).<br/><br/>Nous avons également des objets de grande taille comme des cerfs en cuivre doré,<br/>paons pour vos lobbys, paqutes cadeaux au pieds du sapin...</p><a href="#inspirations" className="text-link" onClick={(e) => { e.preventDefault(); showNextRealisation(); scrollToInspirations() }}>Découvrir notre savoir-faire <ArrowRight size={15}/></a></div></section>
    <section className="catalogue" id="catalogue">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Le catalogue</p>
          <h2>{catalogTitles[activeCategory]}</h2>
        </div>
        <div className="download-group">{catalogues[activeCategory].map((cat) => <a key={cat.file} className="download" href={catalogPdfUrl(cat.file)} download={cat.file}><ArrowDownToLine size={17}/> {cat.label}</a>)}</div>
      </div>
      <div className="browse">
        <div className="categories">{categories.map((c) => <button key={c} className={activeCategory === c ? 'active' : ''} onClick={() => setActiveCategory(c)}>{c}</button>)}</div>
        <div className="search-row"><label><Search size={18}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Rechercher une référence, une matière…"/></label><button className={filterOpen ? 'filter active-filter' : 'filter'} onClick={() => setFilterOpen(!filterOpen)}><SlidersHorizontal size={17}/> Filtres</button></div>
      </div>
      {filterOpen && <div className="filter-panel"><span>Matériaux</span><button>Bois</button><button>Céramique</button><button>Minéral</button><button>Textile</button><span className="filter-note"><Check size={15}/> Disponible sous 4 à 6 semaines</span></div>}
      <div className="category-video">
        <p className="eyebrow">En vidéo</p>
        <CategoryVideo src={categoryVideos[activeCategory]} label={activeCategory} />
      </div>
      <div className="products">{filtered.map((p) => <article className="product" key={p.ref}><div className="product-image"><img src={p.image} alt={p.name}/><button aria-label="Ajouter aux favoris" onClick={() => toggleSaved(p.ref)} className={saved.includes(p.ref) ? 'hearted' : ''}><Heart size={18} fill={saved.includes(p.ref) ? 'currentColor' : 'none'}/></button><span>{p.tone}</span></div><div className="product-meta"><div><p className="reference">{p.ref} · {p.category}</p><h3>{p.name}</h3></div><p className="price">{p.price}</p></div><p className="spec">{p.material} <b>—</b> {p.dimensions}</p></article>)}</div>
      {filtered.length === 0 && <div className="empty"><X size={19}/><p>Aucune pièce ne correspond à votre recherche.</p></div>}
      <button className="all-products" onClick={() => { setActiveCategory('Boules et deco nouvel an'); setQuery('') }}>Voir tous les catalogues <ArrowRight size={16}/></button>
    </section>
    <section className="inspiration" id="inspirations"><div className="inspiration-image"><img src={currentRealisation} alt={realisationLabel}/><span>{realisationLabel}</span><button className="gallery-arrow gallery-arrow-left" onClick={showPrevRealisation} aria-label="Précédent"><ChevronLeft size={26}/></button><button className="gallery-arrow gallery-arrow-right" onClick={showNextRealisation} aria-label="Suivant"><ChevronRight size={26}/></button><div className="gallery-counter">{realisationIndex === -1 ? '0' : realisationIndex + 1} / {realisations.length}</div></div><div className="inspiration-copy"><p className="eyebrow">Inspirations</p><h2>Imaginer<br/><i>l’exception.</i></h2><p>Pour sublimer votre sapin cette année, nous avons énormément de choix de thèmes de décorations. Les couleurs des boules, branches et figurines sont particulièrement variables cette année.</p><a className="text-link" href="#inspirations" onClick={(e) => { e.preventDefault(); showNextRealisation() }}>Voir les réalisations <ArrowRight size={15}/></a><div className="quote">“ Une atmosphère juste, c’est avant tout une émotion qui reste. ”<small>— Direction artistique Atelier Hôtels</small></div></div></section>
    <section className="contact" id="contact"><p className="eyebrow light">Un projet en tête ?</p><h2>Parlons de vos <i>espaces.</i></h2><a href="mailto:sayzon2025@gmail.com" className="button-light">Nous contacter <ArrowRight size={16}/></a></section>
    <footer><a className="brand" href="#accueil"><img src="/images/logo.png" alt="Sayzon Design -Decor" /></a><p>Objets et mobilier pour l’hospitalité contemporaine.</p><span>© 2025 Sayzon Design-Decor</span></footer>
  </main>
}

export default App
