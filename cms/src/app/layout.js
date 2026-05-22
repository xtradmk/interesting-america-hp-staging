import './globals.css'

export const metadata = {
  title: 'Interesting America CMS',
  description: 'Payload CMS backend for Interesting America staging',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
