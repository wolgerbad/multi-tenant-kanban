import type { Board } from '@/types'

export async function get_boards_of_organization(orgId: number) {
  const res = await fetch(`http://localhost:8000/board/organization/${orgId}`)
  return await res.json()
}

export async function get_board_by_id(boardId: number) {
  const res = await fetch(`http://localhost:8000/board/${boardId}`)
  return await res.json() as Board
}
