export async function get_user(userId: number) {
  const res = await fetch(`http://localhost:8000/user/${userId}`)
  return await res.json()
}

export async function update_user_name(DTO: { user_id: number, name: string }) {
 const res = await fetch('http://localhost:8000/user/update/name', {
    method: 'POST',
    body: JSON.stringify(DTO),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}