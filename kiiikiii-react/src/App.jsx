import { useState, useEffect, useCallback, useRef } from 'react'
import BounceCards from './BounceCards'
import StickerPeel from './react-bits/StickerPeel'

const MEMBERS = [
  { name: 'JISOO', role: 'LEAD VOCAL', emoji: '🐰', color: '#F4A7B9' },
  { name: 'NAYEON', role: 'MAIN DANCER', emoji: '🦊', color: '#A8D8EA' },
  { name: 'RINA', role: 'MAIN RAPPER', emoji: '🐱', color: '#B5EAD7' },
  { name: 'HAERIN', role: 'LEAD DANCER', emoji: '🐹', color: '#C3B1E1' },
  { name: 'MINJI', role: 'VISUAL / MAKNAE', emoji: '🦋', color: '#FFDAB9' },
]

const TRACKS = [
  { title: 'DANCING ALONE', artist: 'KIIIKIII', duration: '03:37', bvid: 'BV1h9tczVEJN' },
  { title: 'DANCING ALONE (90s)', artist: 'KIIIKIII', duration: '03:20', bvid: 'BV16MeAz5EXr' },
  { title: 'DANCING ALONE (4K)', artist: 'KIIIKIII', duration: '03:37', bvid: 'BV1Urtwz3EXB' },
]

export default function App() {
  return (
    <div className="min-h-screen font-sans" style={{ background: '#FFF5F5', color: '#5D4E6D' }}>
      <Nav />
      <Carousel />
      <MusicPlayer />
      <BounceCardsSection />
      <FanScreen />
      <Footer />
      <Particles />
      <Sparkles />
      <style>{styles}</style>
    </div>
  )
}

/* ── NAV ── */
function Nav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, width: '100%', zIndex: 1000,
      background: 'linear-gradient(180deg, rgba(255,245,245,0.95), rgba(255,245,245,0.7) 80%, transparent)',
      padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      backdropFilter: 'blur(12px)'
    }}>
      <span style={{
        fontFamily: 'Orbitron, sans-serif', fontSize: '2.2rem', fontWeight: 900,
        background: 'linear-gradient(90deg, #F4A7B9, #C3B1E1, #B5EAD7)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        letterSpacing: 3
      }}>KiiiKiii</span>
      <div style={{ display: 'flex', gap: 30 }}>
        {['Home', 'Music', 'Cards', 'Ranking'].map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} style={{
            color: '#8B7DA8', textDecoration: 'none', fontSize: '0.9rem',
            letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'Orbitron, sans-serif'
          }}>{l}</a>
        ))}
      </div>
    </nav>
  )
}

/* ── CAROUSEL ── */
function Carousel() {
  return (
    <section id="home" style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url('file:///Users/chelsea/Desktop/photo/IMG_6737.jpeg')",
        backgroundSize: 'cover', backgroundPosition: 'center',
        filter: 'brightness(0.8)'
      }} />
      <div style={{
        position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center',
        height: '100%', paddingLeft: 80
      }}>
        <h1 style={{
          fontFamily: "'Noto Sans SC', 'Orbitron', sans-serif",
          fontSize: '6.5rem', fontWeight: 800,
          color: '#fff', letterSpacing: 2,
          textShadow: '0 2px 20px rgba(0,0,0,0.3), 0 0 40px rgba(0,0,0,0.2)',
          lineHeight: 1
        }}>KiiiKiii</h1>
      </div>
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 200,
        background: 'linear-gradient(transparent, #FFF5F5)', zIndex: 5, pointerEvents: 'none'
      }} />
    </section>
  )
}

/* ── MUSIC PLAYER ── */
function MusicPlayer() {
  const [track, setTrack] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [elapsed, setElapsed] = useState('00:00')
  const [muted, setMuted] = useState(false)
  const iframeRef = useRef(null)
  const intervalRef = useRef(null)
  const elapsedRef = useRef(0)

  function postBili(msg) {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(JSON.stringify(msg), '*')
    }
  }

  useEffect(() => {
    const handler = e => {
      try {
        const d = JSON.parse(e.data)
        if (d.type === 'player') {
          if (d.event === 'play') { setPlaying(true); startProgress() }
          if (d.event === 'pause') { setPlaying(false); clearInterval(intervalRef.current) }
          if (d.event === 'ended') { setPlaying(false); setProgress(100); clearInterval(intervalRef.current) }
        }
      } catch (_) {}
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  function startProgress() {
    clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      elapsedRef.current += 0.1
      const pct = Math.min((elapsedRef.current / 217) * 100, 100)
      setProgress(pct)
      const m = Math.floor(elapsedRef.current / 60)
      const s = Math.floor(elapsedRef.current % 60)
      setElapsed(`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`)
    }, 100)
  }

  function togglePlay() {
    if (playing) {
      postBili({ type: 'player', action: 'pause' })
    } else {
      postBili({ type: 'player', action: 'play' })
      setTimeout(() => { if (!playing) { setPlaying(true); startProgress() } }, 1500)
    }
  }

  function changeTrack(i) {
    clearInterval(intervalRef.current)
    elapsedRef.current = 0
    setProgress(0)
    setElapsed('00:00')
    setPlaying(false)
    setTrack(i)
  }

  return (
    <section id="music" style={{ padding: '80px 40px', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2.5rem', fontWeight: 900, letterSpacing: 6,
        background: 'linear-gradient(90deg, #F4A7B9, #C3B1E1, #B5EAD7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        ♪ MUSIC PLAYER ♪
      </h2>
      <p style={{ color: '#8B7DA8', letterSpacing: 4, fontSize: '0.9rem', marginBottom: 50, fontFamily: 'Orbitron, sans-serif' }}>
        Click to play DANCING ALONE
      </p>

      <div style={{
        maxWidth: 550, margin: '0 auto', background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(25px)',
        border: '1px solid rgba(195,177,225,0.4)', borderRadius: 20, padding: 35,
        boxShadow: '0 8px 40px rgba(195,177,225,0.15)'
      }}>
        <div style={{ background: 'rgba(255,255,255,0.85)', borderRadius: 15, padding: 25 }}>
          <div style={{
            width: 200, height: 200, margin: '0 auto 25px', borderRadius: '50%',
            overflow: 'hidden', border: '3px solid #F4A7B9',
            boxShadow: '0 0 30px rgba(244,167,185,0.3), 0 0 60px rgba(195,177,225,0.2)',
            animation: playing ? 'spinDisc 8s linear infinite' : 'none'
          }}>
            <img src="file:///Users/chelsea/Desktop/IMG_6751.jpeg"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Album" />
          </div>
          <div style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.4rem', fontWeight: 700, color: '#8B7DA8' }}>
            {TRACKS[track].title}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#8B7DA8', marginBottom: 20 }}>{TRACKS[track].artist}</div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8B7DA8', marginBottom: 8 }}>
            <span>{elapsed}</span><span>{TRACKS[track].duration}</span>
          </div>
          <div style={{ width: '100%', height: 5, background: 'rgba(195,177,225,0.25)', borderRadius: 3, marginBottom: 20, cursor: 'pointer' }}>
            <div style={{
              height: '100%', width: `${progress}%`,
              background: 'linear-gradient(90deg, #F4A7B9, #C3B1E1, #B5EAD7)',
              borderRadius: 3, transition: 'width 0.1s linear'
            }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 25 }}>
            <button onClick={() => changeTrack((track - 1 + TRACKS.length) % TRACKS.length)}
              style={ctrlBtnStyle}>⏮</button>
            <button onClick={togglePlay}
              style={{
                width: 65, height: 65, borderRadius: '50%', border: 'none', cursor: 'pointer',
                fontSize: '1.8rem', color: '#fff',
                background: 'linear-gradient(135deg, #F4A7B9, #C3B1E1)',
                boxShadow: '0 0 25px rgba(244,167,185,0.4)'
              }}>{playing ? '⏸' : '▶'}</button>
            <button onClick={() => changeTrack((track + 1) % TRACKS.length)}
              style={ctrlBtnStyle}>⏭</button>
            <button onClick={() => { setMuted(!muted); postBili({ type: 'player', action: 'mute', value: !muted }) }}
              style={ctrlBtnStyle}>{muted ? '🔇' : '🔊'}</button>
          </div>
        </div>
      </div>

      <iframe key={track} ref={iframeRef}
        src={`https://player.bilibili.com/player.html?bvid=${TRACKS[track].bvid}&page=1&autoplay=0&danmaku=0`}
        style={{ display: 'none', width: 0, height: 0, border: 'none' }} allow="autoplay" />
    </section>
  )
}

/* ── BOUNCE CARDS ── */
function BounceCardsSection() {
  const images = [
    'file:///Users/chelsea/Desktop/photo/IMG_6752.jpeg',
    'file:///Users/chelsea/Desktop/photo/IMG_6753.jpeg',
    'file:///Users/chelsea/Desktop/photo/IMG_6754.jpeg',
    'file:///Users/chelsea/Desktop/photo/IMG_6755.jpeg',
    'file:///Users/chelsea/Desktop/photo/IMG_6756.jpeg',
  ]

  const transformStyles = [
    'rotate(5deg) translate(-150px)',
    'rotate(0deg) translate(-70px)',
    'rotate(-5deg)',
    'rotate(5deg) translate(70px)',
    'rotate(-5deg) translate(150px)',
  ]

  return (
    <section id="cards" style={{ padding: '80px 40px 120px', textAlign: 'center' }}>
      <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '2.5rem', fontWeight: 900, letterSpacing: 6,
        background: 'linear-gradient(90deg, #F4A7B9, #C3B1E1, #B5EAD7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        ✦ MEMBERS ✦
      </h2>
      <p style={{ color: '#8B7DA8', letterSpacing: 4, fontSize: '0.9rem', marginBottom: 50, fontFamily: 'Orbitron, sans-serif' }}>
        Hover the cards!
      </p>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <BounceCards
          className="custom-bounceCards"
          images={images}
          containerWidth={500}
          containerHeight={250}
          animationDelay={1}
          animationStagger={0.08}
          easeType="elastic.out(1, 0.5)"
          transformStyles={transformStyles}
          enableHover={true}
        />
      </div>
    </section>
  )
}

/* ── STICKER DATA ── */
const cuteEmojis = ['💖', '💕', '💗', '✨', '💝', '🌟', '💘', '❤️', '🐰', '🦊', '🐱', '🐹', '🦋', '🌸', '🍀', '💎', '🎀', '🌈', '⭐', '🍒', '🫧', '🍭']

function emojiToSvg(emoji) {
  const codePoints = [...emoji].map(c => c.codePointAt(0).toString(16)).join('-')
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="24" fill="#FFF5F5"/><text x="64" y="90" text-anchor="middle" font-size="72">${emoji}</text></svg>`)}`
}

/* ── FAN SCREEN WITH STICKERS ── */
function FanScreen() {
  const fanImages = [
    'file:///Users/chelsea/Desktop/photo/IMG_6738.jpeg',
    'file:///Users/chelsea/Desktop/photo/IMG_6741.jpeg',
    'file:///Users/chelsea/Desktop/photo/IMG_6736.jpeg',
    'file:///Users/chelsea/Desktop/photo/IMG_6757.jpeg',
    'file:///Users/chelsea/Desktop/photo/IMG_6742.jpeg',
    'file:///Users/chelsea/Desktop/photo/IMG_6735.jpeg',
  ]

  const [currentImg, setCurrentImg] = useState(0)
  const [stickers, setStickers] = useState([])
  const screenRef = useRef(null)
  const stickerIdRef = useRef(0)

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentImg(c => (c + 1) % fanImages.length)
    }, 3000)
    return () => clearInterval(id)
  }, [fanImages.length])

  const addSticker = (emoji) => {
    const id = stickerIdRef.current++
    const screenEl = screenRef.current
    if (!screenEl) return
    const rect = screenEl.getBoundingClientRect()
    const x = Math.random() * (rect.width * 0.6) + rect.width * 0.1
    const y = Math.random() * (rect.height * 0.4) + rect.height * 0.15
    const rotation = (Math.random() - 0.5) * 60
    setStickers(prev => [...prev, {
      id, emoji, imageSrc: emojiToSvg(emoji), x, y, rotation
    }])
  }

  const removeSticker = (id) => {
    setStickers(prev => prev.filter(s => s.id !== id))
  }

  return (
    <section id="ranking" style={{ padding: '80px 40px 120px' }}>
      <h2 style={{ textAlign: 'center', fontFamily: 'Orbitron, sans-serif', fontSize: '2.5rem', fontWeight: 900, letterSpacing: 6,
        background: 'linear-gradient(90deg, #F4A7B9, #C3B1E1, #B5EAD7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        ✦ STICKER SCREEN ✦
      </h2>
      <p style={{ textAlign: 'center', color: '#8B7DA8', letterSpacing: 4, fontSize: '0.9rem', marginBottom: 25, fontFamily: 'Orbitron, sans-serif' }}>
        Paste cute stickers on the screen!
      </p>

      {/* Sticker Palette */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 25, flexWrap: 'wrap',
        padding: 15, background: 'rgba(255,255,255,0.65)', borderRadius: 16,
        border: '1px solid rgba(195,177,225,0.4)', backdropFilter: 'blur(10px)',
        maxWidth: 750, margin: '0 auto 25px'
      }}>
        {cuteEmojis.map((emoji, i) => (
          <button
            key={i}
            onClick={() => addSticker(emoji)}
            style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'rgba(255,255,255,0.8)',
              border: '2px solid rgba(244,167,185,0.4)',
              cursor: 'pointer', fontSize: '1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.2)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(244,167,185,0.3)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = ''
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)'
            }}
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Screen */}
      <div style={{
        maxWidth: 750, margin: '0 auto',
        border: '3px solid rgba(195,177,225,0.5)', borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(195,177,225,0.2), inset 0 0 30px rgba(195,177,225,0.1)',
        background: '#0a0a1a'
      }}>
        <div ref={screenRef} style={{
          position: 'relative', width: '100%', paddingTop: '56.25%',
          overflow: 'hidden', background: '#111'
        }}>
          {/* Rotating images */}
          {fanImages.map((src, i) => (
            <img key={i} src={src} alt=""
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%', objectFit: 'cover',
                opacity: i === currentImg ? 1 : 0,
                transition: 'opacity 0.8s ease',
                pointerEvents: 'none'
              }}
            />
          ))}

          {/* StickerPeels */}
          {stickers.map((sticker) => (
            <StickerPeel
              key={sticker.id}
              stickerId={sticker.id}
              imageSrc={sticker.imageSrc}
              width={90}
              rotate={sticker.rotation}
              peelBackHoverPct={20}
              peelBackActivePct={30}
              shadowIntensity={0.5}
              lightingIntensity={0.06}
              initialPosition={{ x: sticker.x, y: sticker.y }}
              onRemove={removeSticker}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── FOOTER ── */
function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: 40, borderTop: '1px solid rgba(195,177,225,0.25)' }}>
      <p style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.5rem', letterSpacing: 5,
        background: 'linear-gradient(90deg, #F4A7B9, #C3B1E1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        KIIIKIII
      </p>
      <p style={{ color: '#8B7DA8', fontSize: '0.75rem', letterSpacing: 2, marginTop: 8 }}>© 2026 KIIIKIII OFFICIAL FAN PAGE</p>
    </footer>
  )
}

/* ── PARTICLES BG ── */
function Particles() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      pointerEvents: 'none', zIndex: 0, overflow: 'hidden'
    }}>
      {Array.from({ length: 40 }, (_, i) => {
        const colors = ['#F4A7B9', '#A8D8EA', '#B5EAD7', '#C3B1E1', '#FFF1C1', '#FFDAB9']
        return (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%',
            left: `${Math.random() * 100}%`,
            width: Math.random() * 4 + 2, height: Math.random() * 4 + 2,
            background: colors[Math.floor(Math.random() * colors.length)],
            boxShadow: `0 0 ${Math.random() * 6 + 3}px currentColor`,
            animation: `particleDrift ${Math.random() * 12 + 8}s linear ${Math.random() * 12}s infinite`,
            opacity: 0.5
          }} />
        )
      })}
    </div>
  )
}

/* ── SPARKLES ── */
function Sparkles() {
  // Simplified sparkles via a canvas component doesn't work well inline;
  // the existing HTML version covers this via CSS particles above.
  return null
}

/* ── HELPERS ── */
const ctrlBtnStyle = {
  background: 'none', border: 'none', color: '#8B7DA8', cursor: 'pointer',
  fontSize: '1.1rem', width: 40, height: 40, borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center'
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Noto+Sans+SC:wght@300;400;700;900&display=swap');
  @keyframes spinDisc { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }
  @keyframes particleDrift {
    0% { transform: translateY(0) rotate(0deg); opacity: 0 }
    10% { opacity: 0.6 }
    90% { opacity: 0.6 }
    100% { transform: translateY(-110vh) rotate(720deg); opacity: 0 }
  }
`
