// Placeholder shell for M0. Replaced by the tab layout in M4/M5.
export default function App() {
  return (
    <main
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: 16,
        textAlign: 'center',
      }}
    >
      <picture>
        <source srcSet="/brand/elephant-dark.png" media="(prefers-color-scheme: dark)" />
        <img src="/brand/elephant-light.png" alt="" width={180} height={153} />
      </picture>
      <h1 style={{ margin: 0, fontSize: 28 }}>
        <span style={{ color: 'var(--teal)' }}>Sophi</span>
        <span style={{ color: 'var(--text2)' }}>Track</span>
      </h1>
      <p style={{ margin: 0, color: 'var(--text2)' }}>Setting up · v{__APP_VERSION__}</p>
    </main>
  )
}
