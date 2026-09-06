export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h1>Welcome to AeonFlez</h1>
      <p>Your Next.js application is running successfully.</p>
      <div style={{ marginTop: '2rem' }}>
        <h2>Getting Started</h2>
        <ul>
          <li>Edit <code>src/app/page.tsx</code> to customize this page</li>
          <li>Run <code>npm run dev</code> to see live changes</li>
          <li>Check the <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">Next.js Documentation</a></li>
        </ul>
      </div>
    </main>
  );
}
