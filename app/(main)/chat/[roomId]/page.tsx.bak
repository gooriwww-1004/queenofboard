'use client'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams, useRouter } from 'next/navigation'

type Message = {
  id: string
  room_id: string
  user_name: string
  content: string
  created_at: string
}

export default function ChatRoomPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const [messages, setMessages] = useState<Message[]>([])
  const [content, setContent] = useState('')
  const [userName, setUserName] = useState('익명')
  const bottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    fetchMessages()

    const channel = supabase
      .channel(`room-${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => {
        setMessages((prev) => [...prev, payload.new as Message])
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [roomId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function fetchMessages() {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
    if (data) setMessages(data)
  }

  async function sendMessage() {
    if (!content.trim()) return
    await supabase.from('messages').insert({
      room_id: roomId,
      user_name: userName,
      content: content.trim(),
    })
    setContent('')
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center gap-3 p-4 bg-white border-b shadow-sm">
        <button onClick={() => router.push('/chat')} className="text-gray-500 hover:text-black">←</button>
        <h2 className="font-bold text-lg">채팅방</h2>
        <input
          className="ml-auto border rounded px-2 py-1 text-sm w-28"
          placeholder="닉네임"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.user_name === userName ? 'items-end' : 'items-start'}`}>
            <span className="text-xs text-gray-400 mb-1">{msg.user_name}</span>
            <div className={`px-4 py-2 rounded-2xl max-w-xs text-sm ${
              msg.user_name === userName
                ? 'bg-blue-600 text-white'
                : 'bg-white border text-gray-800'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white border-t flex gap-2">
        <input
          className="flex-1 border rounded-full px-4 py-2 text-sm"
          placeholder="메시지 입력..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm hover:bg-blue-700"
        >
          전송
        </button>
      </div>
    </div>
  )
}
