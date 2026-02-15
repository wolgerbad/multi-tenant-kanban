"use server"

import { revalidatePath } from "next/cache"
import { create_board as createBoardAPI } from "@/helpers/board"

export async function createBoard(formData: FormData, organization_id: number) {
  const board_title = formData.get('board_title') as string
  if (!board_title?.length) {
    return { ok: false, error: 'Board title is required' }
  }

  const result = await createBoardAPI({ board_title, organization_id })
  
  if (result.ok) {
    // Revalidate the path to ensure fresh data on next render
    revalidatePath(`/organizations/${organization_id}`)
    return { ok: true }
  }
  
  return { ok: false, error: result.error || 'Failed to create board' }
}

