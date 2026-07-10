import '../index.css'
import { appName } from './roleConfig'
import { MockDataProvider } from '../context/MockDataContext'
import { ThemeProvider } from '../context/ThemeContext'

export const metadata = {
  title: appName,
  description: 'Full-stack airline operations portal with JWT authentication.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <MockDataProvider>{children}</MockDataProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
