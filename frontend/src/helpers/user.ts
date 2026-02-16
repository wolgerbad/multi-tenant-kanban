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

export async function update_user_image(user_id: number, final_url: string) {
 const res = await fetch('http://localhost:8000/user/update/image', {
    method: 'POST',
    body: JSON.stringify({ user_id, image: final_url }),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}