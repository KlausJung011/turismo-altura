import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const tours = [
  {
    id: 'uyuni',
    title: 'Salar de Uyuni',
    location: 'Potosí, Bolivia',
    category: 'Aventura',
    duration: '3 días / 2 noches',
    description: 'Horizontes infinitos, lagunas de colores y noches bajo un cielo inolvidable.',
    highlights: ['Salar y atardecer', 'Laguna Colorada', 'Paisajes del altiplano'],
    image: 'https://images.unsplash.com/photo-1641755222059-8086a4f8c850?auto=format&fit=crop&w=1200&q=85',
    imagePosition: 'center 58%',
    featured: true,
  },
  {
    id: 'titicaca',
    title: 'Lago Titicaca',
    location: 'La Paz, Bolivia',
    category: 'Cultura',
    duration: '2 días / 1 noche',
    description: 'Navega por aguas azules y descubre historias vivas en la Isla del Sol.',
    highlights: ['Copacabana', 'Isla del Sol', 'Comunidades locales'],
    image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85',
    imagePosition: 'center 55%',
  },
  {
    id: 'madidi',
    title: 'Parque Madidi',
    location: 'La Paz, Bolivia',
    category: 'Naturaleza',
    duration: '4 días / 3 noches',
    description: 'Senderos, ríos y biodiversidad en el corazón de la Amazonía boliviana.',
    highlights: ['Caminatas guiadas', 'Observación de fauna', 'Navegación fluvial'],
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85',
    imagePosition: 'center',
  },
  {
    id: 'sucre',
    title: 'Sucre colonial',
    location: 'Chuquisaca, Bolivia',
    category: 'Cultura',
    duration: '2 días / 1 noche',
    description: 'Calles blancas, arquitectura histórica y sabores que cuentan historias.',
    highlights: ['Centro histórico', 'Mercados tradicionales', 'Gastronomía local'],
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=85',
    imagePosition: 'center',
  },
  {
    id: 'montanas',
    title: 'Rutas del altiplano',
    location: 'Oruro, Bolivia',
    category: 'Aventura',
    duration: '3 días / 2 noches',
    description: 'Un viaje de aire puro entre montañas, pueblos y paisajes imponentes.',
    highlights: ['Miradores andinos', 'Pueblos del altiplano', 'Fotografía de paisaje'],
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85',
    imagePosition: 'center',
  },
  {
    id: 'valles',
    title: 'Valles de Tarija',
    location: 'Tarija, Bolivia',
    category: 'Naturaleza',
    duration: '2 días / 1 noche',
    description: 'Paseos tranquilos, paisajes verdes y el encanto cálido del sur.',
    highlights: ['Ruta panorámica', 'Pueblos y tradiciones', 'Sabores regionales'],
    image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85',
    imagePosition: 'center',
  },
]

const categories = ['Todos', 'Aventura', 'Naturaleza', 'Cultura']

function Icon({ name, size = 20, strokeWidth = 1.8 }) {
  const paths = {
    arrow: <><path d="M4 10h16" /><path d="m14 4 6 6-6 6" /></>,
    arrowUp: <><path d="M5 15 15 5" /><path d="M7 5h8v8" /></>,
    pin: <><path d="M18 10c0 5-8 11-8 11S2 15 2 10a8 8 0 1 1 16 0Z" /><circle cx="10" cy="10" r="2.5" /></>,
    clock: <><circle cx="10" cy="10" r="8" /><path d="M10 5v5l3 2" /></>,
    search: <><circle cx="8.5" cy="8.5" r="6.5" /><path d="m13.5 13.5 5 5" /></>,
    close: <><path d="M4 4 16 16M16 4 4 16" /></>,
    menu: <><path d="M3 5h14M3 10h14M3 15h14" /></>,
    check: <><path d="m3 10 4 4L17 4" /></>,
    compass: <><circle cx="10" cy="10" r="8" /><path d="m13 7-2 4-4 2 2-4 4-2Z" /></>,
    shield: <><path d="M10 2 17 5v5c0 4.5-3 7-7 9-4-2-7-4.5-7-9V5l7-3Z" /><path d="m7 10 2 2 4-4" /></>,
    heart: <><path d="M17.2 4.8a4 4 0 0 0-5.7 0L10 6.3 8.5 4.8a4 4 0 0 0-5.7 5.7L10 18l7.2-7.5a4 4 0 0 0 0-5.7Z" /></>,
    star: <path d="m10 2 2.5 5.3 5.8.7-4.2 4.1 1 5.9L10 15.2 4.9 18l1-5.9L1.7 8l5.8-.7L10 2Z" />,
  }
  return <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function App() {
  const [category, setCategory] = useState('Todos')
  const [search, setSearch] = useState('')
  const [selectedTour, setSelectedTour] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [requestOpen, setRequestOpen] = useState(false)
  const [formError, setFormError] = useState('')
  const [downloaded, setDownloaded] = useState(false)

  const filteredTours = useMemo(() => tours.filter((tour) => {
    const matchesCategory = category === 'Todos' || tour.category === category
    const term = search.trim().toLocaleLowerCase('es')
    const matchesSearch = !term || `${tour.title} ${tour.location} ${tour.description}`.toLocaleLowerCase('es').includes(term)
    return matchesCategory && matchesSearch
  }), [category, search])

  useEffect(() => {
    if (!selectedTour && !requestOpen) return undefined
    function onEscape(event) {
      if (event.key === 'Escape') {
        setSelectedTour(null)
        setRequestOpen(false)
      }
    }
    document.addEventListener('keydown', onEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onEscape)
      document.body.style.overflow = ''
    }
  }, [selectedTour, requestOpen])

  function openRequest(tour = null) {
    setSelectedTour(tour)
    setFormError('')
    setDownloaded(false)
    setRequestOpen(true)
    setMenuOpen(false)
  }

  function handleRequest(event) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    const email = String(data.get('email') || '').trim()
    const date = String(data.get('date') || '')
    const travelers = String(data.get('travelers') || '')
    const destination = String(data.get('destination') || '')
    if (!name || !email || !date || !travelers || !destination) {
      setFormError('Completa todos los campos para preparar tu solicitud.')
      return
    }
    const details = [
      'SOLICITUD DE VIAJE — ALTURA',
      '',
      `Nombre: ${name}`,
      `Correo: ${email}`,
      `Destino: ${destination}`,
      `Fecha deseada: ${date}`,
      `Viajeros: ${travelers}`,
      '',
      'Esta solicitud se generó en una demostración. Aún no se ha enviado a ninguna agencia.',
    ].join('\n')
    const url = URL.createObjectURL(new Blob([details], { type: 'text/plain;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'solicitud-viaje-altura.txt'
    document.body.append(link)
    link.click()
    link.remove()
    setTimeout(() => URL.revokeObjectURL(url), 1000)
    setFormError('')
    setDownloaded(true)
  }

  function navigate() { setMenuOpen(false) }

  return <>
    <div className="announcement"><span className="announcement-dot" /> Tu próxima historia empieza en Bolivia <span className="announcement-divider">·</span> Explora sin límites</div>
    <header className="site-header">
      <div className="container nav-inner">
        <a className="logo" href="#inicio" onClick={navigate} aria-label="Altura, ir al inicio"><span className="logo-mark"><span /></span><span><span className="logo-word">altur<span className="logo-a">a</span></span><small>VIAJES QUE INSPIRAN</small></span></a>
        <nav className={menuOpen ? 'nav-links is-open' : 'nav-links'} aria-label="Navegación principal">
          <a href="#destinos" onClick={navigate}>Destinos</a>
          <a href="#nosotros" onClick={navigate}>Nuestra esencia</a>
          <a href="#experiencias" onClick={navigate}>Experiencias</a>
          <a href="#contacto" onClick={navigate}>Contacto</a>
        </nav>
        <button className="nav-cta" type="button" onClick={() => openRequest()}>Planear mi viaje <Icon name="arrowUp" size={17} /></button>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} size={24} /></button>
      </div>
    </header>

    <main>
      <section className="hero" id="inicio">
        <div className="hero-image" role="img" aria-label="Paisaje del Salar de Uyuni en Bolivia" />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <div className="eyebrow light"><span className="eyebrow-line" /> DESCUBRE LO EXTRAORDINARIO</div>
          <h1>Hay lugares que<br /><em>se quedan contigo.</em></h1>
          <p>Desde el horizonte infinito del salar hasta la vida de la selva. Encuentra el viaje que siempre imaginaste.</p>
          <div className="hero-actions"><a className="button button-light" href="#destinos">Explorar destinos <Icon name="arrowUp" size={18} /></a><a className="hero-text-link" href="#nosotros">Conoce Altura <Icon name="arrow" size={17} /></a></div>
        </div>
        <div className="hero-meta"><span>01 / 06</span><span className="meta-line" /><span>SALAR DE UYUNI, BOLIVIA</span></div>
        <div className="hero-side-note">19°27′ S &nbsp; 66°49′ O</div>
      </section>

      <section className="intro-strip" aria-label="Valores de la agencia"><div className="container intro-grid"><div><span className="intro-number">01</span><span>Experiencias auténticas</span></div><div><span className="intro-number">02</span><span>Rutas a tu ritmo</span></div><div><span className="intro-number">03</span><span>Bolivia por descubrir</span></div><div className="intro-explore">EL VIAJE ES TUYO <Icon name="arrowUp" size={17} /></div></div></section>

      <section className="section destinations" id="destinos">
        <div className="container">
          <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> DESTINOS PARA SOÑAR</div><h2>Elige tu próxima <em>historia</em></h2></div><p>Seis maneras de conocer Bolivia. Explora, filtra y descubre qué destino conecta contigo.</p></div>
          <div className="toolbar"><div className="filters" role="group" aria-label="Filtrar destinos por tipo">{categories.map((item) => <button key={item} type="button" className={category === item ? 'filter active' : 'filter'} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}</button>)}</div><label className="search-box"><Icon name="search" size={19} /><span className="sr-only">Buscar destinos</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar destino..." /></label></div>
          {filteredTours.length > 0 ? <div className="tour-grid">{filteredTours.map((tour, index) => <article className="tour-card" key={tour.id}>
            <button className="card-photo" type="button" onClick={() => setSelectedTour(tour)} aria-label={`Ver detalles de ${tour.title}`}><img src={tour.image} alt={`Fotografía ilustrativa del viaje a ${tour.title}`} style={{ objectPosition: tour.imagePosition }} loading={index > 2 ? 'lazy' : 'eager'} /><span className="card-category">{tour.category}</span><span className="card-arrow"><Icon name="arrowUp" size={19} /></span></button>
            <div className="card-body"><div className="card-location"><Icon name="pin" size={15} /> {tour.location}</div><h3>{tour.title}</h3><p>{tour.description}</p><div className="card-bottom"><span><Icon name="clock" size={17} /> {tour.duration}</span><button type="button" onClick={() => setSelectedTour(tour)}>Ver experiencia <Icon name="arrow" size={17} /></button></div></div>
          </article>)}</div> : <div className="empty-state"><Icon name="compass" size={34} /><h3>No encontramos ese destino</h3><p>Prueba con otra búsqueda o cambia la categoría.</p><button type="button" onClick={() => { setCategory('Todos'); setSearch('') }}>Ver todos los destinos</button></div>}
        </div>
      </section>

      <section className="story-section" id="nosotros"><div className="container story-grid"><div className="story-art"><div className="story-image" role="img" aria-label="Paisaje de montaña" /><div className="story-stamp"><span>EXPLORA</span><strong>BOLIVIA</strong><span>CON ALTURA</span></div></div><div className="story-copy"><div className="eyebrow"><span className="eyebrow-line" /> NUESTRA ESENCIA</div><h2>Viajar es sentir<br /><em>más de cerca.</em></h2><p>Creemos en las rutas que dejan espacio para sorprenderse. En mirar con calma, conectar con los lugares y guardar historias que duren mucho después del regreso.</p><div className="story-features"><div><span className="feature-icon"><Icon name="compass" size={23} /></span><div><strong>Rutas con intención</strong><span>Itinerarios pensados para descubrir más de cada lugar.</span></div></div><div><span className="feature-icon"><Icon name="heart" size={23} /></span><div><strong>Experiencias memorables</strong><span>Momentos para compartir, explorar y recordar.</span></div></div></div><a className="inline-link" href="#destinos">Encuentra tu destino <Icon name="arrowUp" size={18} /></a></div></div></section>

      <section className="section experience-section" id="experiencias"><div className="container"><div className="eyebrow"><span className="eyebrow-line" /> CADA VIAJE, UNA FORMA DE SENTIR</div><div className="experience-heading"><h2>Más que lugares,<br /><em>momentos.</em></h2><p>Un viaje puede ser una cima, una conversación o ese instante en que decides quedarte un poco más.</p></div><div className="experience-grid"><div className="experience-item"><span>01 /</span><Icon name="compass" size={34} /><h3>Explora sin prisa</h3><p>Descubre caminos nuevos con tiempo para disfrutarlos.</p></div><div className="experience-item"><span>02 /</span><Icon name="star" size={34} /><h3>Vive lo auténtico</h3><p>Acércate a los paisajes, sabores y tradiciones del país.</p></div><div className="experience-item"><span>03 /</span><Icon name="shield" size={34} /><h3>Planea a tu medida</h3><p>Elige el destino y prepara una solicitud con tus datos.</p></div></div></div></section>

      <section className="contact-banner" id="contacto"><div className="contact-backdrop" /><div className="container contact-content"><div className="eyebrow light"><span className="eyebrow-line" /> EL PRIMER PASO ES EL MÁS EMOCIONANTE</div><h2>Tu próxima aventura<br /><em>empieza aquí.</em></h2><p>Cuéntanos qué viaje imaginas y descarga una solicitud con tus preferencias.</p><button className="button button-light" type="button" onClick={() => openRequest()}>Preparar mi viaje <Icon name="arrowUp" size={18} /></button></div></section>
    </main>

    <footer className="footer"><div className="container footer-top"><div><a className="logo footer-logo" href="#inicio"><span className="logo-mark"><span /></span><span><span className="logo-word">altur<span className="logo-a">a</span></span><small>VIAJES QUE INSPIRAN</small></span></a><p>Una forma distinta de descubrir Bolivia.<br />Viaja, explora y haz tuya cada historia.</p></div><div className="footer-links"><div><strong>Explora</strong><a href="#destinos">Destinos</a><a href="#experiencias">Experiencias</a></div><div><strong>Altura</strong><a href="#nosotros">Nuestra esencia</a><a href="#contacto">Contacto</a></div></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} Altura. Proyecto demostrativo.</span><span>Hecho para descubrir Bolivia <span aria-hidden="true">✦</span></span></div></footer>

    {selectedTour && !requestOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedTour(null) }}><section className="detail-modal" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="modal-close" type="button" onClick={() => setSelectedTour(null)} aria-label="Cerrar detalles"><Icon name="close" size={23} /></button><img src={selectedTour.image} alt={`Fotografía ilustrativa del viaje a ${selectedTour.title}`} /><div className="detail-content"><div className="eyebrow"><span className="eyebrow-line" /> {selectedTour.category.toUpperCase()}</div><h2 id="detail-title">{selectedTour.title}</h2><p>{selectedTour.description}</p><div className="detail-facts"><span><Icon name="pin" size={17} /> {selectedTour.location}</span><span><Icon name="clock" size={17} /> {selectedTour.duration}</span></div><h3>Momentos del recorrido</h3><ul>{selectedTour.highlights.map((highlight) => <li key={highlight}><Icon name="check" size={17} /> {highlight}</li>)}</ul><button className="button button-dark" type="button" onClick={() => openRequest(selectedTour)}>Preparar solicitud <Icon name="arrowUp" size={18} /></button></div></section></div>}

    {requestOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setRequestOpen(false) }}><section className="request-modal" role="dialog" aria-modal="true" aria-labelledby="request-title"><button className="modal-close" type="button" onClick={() => setRequestOpen(false)} aria-label="Cerrar formulario"><Icon name="close" size={23} /></button><div className="eyebrow"><span className="eyebrow-line" /> PLANEA TU VIAJE</div><h2 id="request-title">Hagamos espacio para <em>explorar.</em></h2><p className="request-intro">Completa tus preferencias y descarga una solicitud en texto. Esta demostración no envía datos ni confirma reservas.</p><form onSubmit={handleRequest}><label>Tu nombre<input name="name" placeholder="Nombre y apellido" autoComplete="name" required /></label><label>Tu correo<input name="email" type="email" placeholder="nombre@correo.com" autoComplete="email" required /></label><label>Destino<select name="destination" defaultValue={selectedTour?.title || ''} required><option value="" disabled>Selecciona un destino</option>{tours.map((tour) => <option key={tour.id} value={tour.title}>{tour.title}</option>)}</select></label><div className="form-row"><label>Fecha estimada<input name="date" type="date" min={new Date().toISOString().slice(0, 10)} required /></label><label>Viajeros<input name="travelers" type="number" min="1" max="30" defaultValue="2" required /></label></div>{formError && <p className="form-message error" role="alert">{formError}</p>}{downloaded && <p className="form-message success" role="status">Solicitud descargada. Guárdala para compartirla con una agencia.</p>}<button className="button button-dark submit-button" type="submit">Descargar solicitud <Icon name="arrowUp" size={18} /></button></form></section></div>}
  </>
}

createRoot(document.getElementById('root')).render(<App />)
