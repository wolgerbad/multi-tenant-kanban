import type { Board } from '@/types'
import { clientEnv } from '@/utils/envSchema'

export async function get_boards_of_organization(orgId: number) {
  const res = await fetch(`${clientEnv.NEXT_PUBLIC_SERVER_URL}/board/organization/${orgId}`)
  return await res.json()
}

export async function get_board_by_id(boardId: number) {
  const res = await fetch(`${clientEnv.NEXT_PUBLIC_SERVER_URL}/board/${boardId}`)
  return await res.json() as Board
}

export async function create_board(DTO: { board_title: string; organization_id: number }) {
  const res = await fetch(`${clientEnv.NEXT_PUBLIC_SERVER_URL}/board/create`, {
    method: 'POST',
    body: JSON.stringify(DTO),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}