// Route group layout for /beweather — does NOT render Fluxo Rural's
// Navbar/Footer/FloatingWhatsApp. The landing has its own chrome.
// Inherits fonts + GA from the root layout automatically.
export default function BeweatherGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
