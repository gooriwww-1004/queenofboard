'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/board', label: '📋 게시판' },
  { href: '/chat', label: '💬 채팅' },
  { href: '/ai-chat', label: '🤖 AI 채팅' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 h-screen bg-white border-r flex flex-col shrink-0">
      <div className="px-6 py-5 border-b">
        <h1 className="text-lg font-bold text-blue-600">🌐 Millennium</h1>
        <p className="text-xs text-gray-400">Session Platform</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition
                ${isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t">
        <p className="text-xs text-gray-400 text-center">Millennium Session © 2026</p>
      </div>
    </aside>
  )
}
