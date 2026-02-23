import type { Card } from '@/types'
import { clientEnv } from '@/utils/envSchema';

export async function create_card(cardDTO: Card) {
  const res = await fetch(`${clientEnv.NEXT_PUBLIC_SERVER_URL}/card/create`, {
    method: 'POST',
    body: JSON.stringify(cardDTO),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  return res.json()
}

export async function switch_card_positions(card_ids: { dragged_card: number; dropped_card: number }) {
  const res = await fetch(`${clientEnv.NEXT_PUBLIC_SERVER_URL}/card/switch-positions`, {
    method: 'POST',
    body: JSON.stringify(card_ids),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}


export async function switch_card_column(DTO: { card_id: number; column_id: number }) {
 const res = await fetch(`${clientEnv.NEXT_PUBLIC_SERVER_URL}/card/switch-column`, {
    method: 'POST',
    body: JSON.stringify(DTO),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function update_card(DTO) {
 const res = await fetch(`${clientEnv.NEXT_PUBLIC_SERVER_URL}/card/update`, {
    method: 'POST',
    body: JSON.stringify(DTO),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}