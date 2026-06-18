export default function Loading() {
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#f0f4ff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: '#6366f1', animation: 'dotBounce 1.2s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
      ))}
      <style>{`@keyframes dotBounce{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}`}</style>
    </div>
  )
}
