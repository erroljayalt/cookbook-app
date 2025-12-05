import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import styles from './layout.module.css'

export const metadata: Metadata = {
    title: 'Flavorful Forums - Digital Cookbook',
    description: 'A premium digital cookbook for sharing and discovering amazing recipes',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <nav className={styles.navbar}>
                    <div className="container">
                        <div className={styles.navContent}>
                            <Link href="/" className={styles.logo}>
                                <h1 className={styles.logoText}>Flavorful Forums</h1>
                                <p className={styles.logoSubtext}>A Digital Cookbook</p>
                            </Link>
                            <div className={styles.navLinks}>
                                <Link href="/" className={styles.navLink}>Home</Link>
                            </div>
                        </div>
                    </div>
                </nav>
                <main className={styles.main}>
                    {children}
                </main>
                <footer className={styles.footer}>
                    <div className="container">
                        <p>&copy; 2025 Flavorful Forums. All rights reserved.</p>
                    </div>
                </footer>
            </body>
        </html>
    )
}
