export default function StudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <style>{`#sanity { height: calc(100vh - 80px) !important; max-height: calc(100dvh - 80px) !important; }`}</style>
      <div style={{ position: 'fixed', top: '80px', left: 0, right: 0, bottom: 0, overflow: 'hidden' }}>
        {children}
      </div>
    </>
  )
}
