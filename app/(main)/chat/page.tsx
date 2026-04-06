'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

type Room = {
  id: string
  name: string
  created_at: string
}

export default function ChatPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [newRoom, setNewRoom] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchRooms()
  }, [])

  async function fetchRooms() {
    const { data } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setRooms(data)
  }

  async function createRoom() {
    if (!newRoom.trim()) return
    const { data } = await supabase
      .from('rooms')
      .insert({ name: newRoom.trim() })
      .select()
      .single()
    if (data) {
      setNewRoom('')
      router.push(`/chat/${data.id}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">💬 채팅방 목록</h1>

      <div className="flex gap-2 mb-6">
        <input
          className="border rounded px-3 py-2 flex-1"
          placeholder="채팅방 이름 입력..."
          value={newRoom}
          onChange={(e) => setNewRoom(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && createRoom()}
        />
        <button
          onClick={createRoom}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          만들기
        </button>
      </div>

      <div className="space-y-2">
        {rooms.length === 0 && (
          <p className="text-gray-400">채팅방이 없어요. 먼저 만들어보세요!</p>
        )}
        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => router.push(`/chat/${room.id}`)}
            className="bg-white border rounded-lg p-4 cursor-pointer hover:shadow-md transition"
          >
            <p className="font-semibold">#{room.name}</p>
            <p className="text-sm text-gray-400">
              {new Date(room.created_at).toLocaleString('ko-KR')}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
