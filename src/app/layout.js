import './globals.css'

export const metadata = {
  title: 'Geospatial Data Visualization',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
