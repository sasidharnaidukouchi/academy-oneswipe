export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content="gOM1aKdM6SuhizicYTZTsV8kzw9v-11sXa4S9CTP6Oo"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
