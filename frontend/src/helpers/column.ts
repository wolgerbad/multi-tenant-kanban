export async function get_columns_by_board_id(boardId: number) {
  const res = await fetch(`http://localhost:8000/column/board/${boardId}`)
  return await res.json()
}

export async function create_column(columnDTO: { title: string, position: number, org_id: number, board_id: number }) {
  const res = await fetch('http://localhost:8000/column/create', {
    method: 'POST',
    body: JSON.stringify(columnDTO),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  })

  return await res.json()
}

export async function switch_column_positions(column_ids: { dragged_column: number; dropped_column: number }) {
  const res = await fetch(`http://localhost:8000/column/switch-positions`, {
    method:'POST',
    body: JSON.stringify(column_ids),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await res.json()
}