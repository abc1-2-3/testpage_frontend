'use client'

import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image"

export default function AuthButton() {
  const { data: session, status } = useSession()

  if (status === "loading") return null

  if (session) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "8px 14px",
        background: "rgba(20,10,5,0.75)",
        border: "1px solid rgba(180,140,60,0.4)",
        borderRadius: "8px",
        backdropFilter: "blur(6px)",
      }}>
        {session.user?.image && (
          <Image
            src={session.user.image}
            alt={session.user.name ?? ""}
            width={28}
            height={28}
            style={{ borderRadius: "50%", border: "1px solid rgba(180,140,60,0.6)" }}
          />
        )}
        <span style={{ color: "#d4a853", fontSize: "0.85rem" }}>
          {session.user?.name}
        </span>
        <a
          href="/donations"
          style={{ color: "#a0b0c0", fontSize: "0.8rem", textDecoration: "none" }}
        >
          贊助紀錄
        </a>
        <button
          onClick={() => signOut()}
          style={{
            background: "none",
            border: "1px solid rgba(180,140,60,0.4)",
            borderRadius: "4px",
            color: "#8a7a6a",
            fontSize: "0.8rem",
            padding: "2px 8px",
            cursor: "pointer",
          }}
        >
          登出
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => signIn("google")}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        background: "rgba(20,10,5,0.75)",
        border: "1px solid rgba(180,140,60,0.5)",
        borderRadius: "8px",
        color: "#d4a853",
        fontSize: "0.9rem",
        cursor: "pointer",
        backdropFilter: "blur(6px)",
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24">
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
      </svg>
      使用 Google 登入
    </button>
  )
}
