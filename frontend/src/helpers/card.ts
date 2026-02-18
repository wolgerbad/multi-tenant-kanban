import type { Card } from '@/types'

export async function create_card(cardDTO: Card) {
  const res = await fetch('http://localhost:8000/card/create', {
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
  const res = await fetch(`http://localhost:8000/card/switch-positions`, {
    method: 'POST',
    body: JSON.stringify(card_ids),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}


export async function switch_card_column(DTO: { card_id: number; column_id: number }) {
 const res = await fetch('http://localhost:8000/card/switch-column', {
    method: 'POST',
    body: JSON.stringify(DTO),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}

export async function update_card(DTO) {
 const res = await fetch('http://localhost:8000/card/update', {
    method: 'POST',
    body: JSON.stringify(DTO),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}