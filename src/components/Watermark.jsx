const SYMBOLS = Array.from({ length: 180 }, (_, i) =>
  i % 3 === 0 ? '🔥' : '♥'
)

export default function Watermark({ isDark }) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
      style={{ opacity: 0.045 }}
    >
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1.8rem',
          padding: '1.2rem',
          fontSize: '1.6rem',
          lineHeight: 1,
          color: isDark ? '#ffffff' : '#000000',
        }}
      >
        {SYMBOLS.map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>
    </div>
  )
}
