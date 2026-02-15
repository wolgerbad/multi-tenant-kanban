export async function get_organizations_of_member(userId: number) {
  const res = await fetch(`http://localhost:8000/organization/${userId}`)
  return await res.json()
}

export async function create_new_organization(DTO: { organization_title: string; organization_image: string | null; user_id: number }) {
 const res = await fetch('http://localhost:8000/organization/create', {
    method: 'POST',
    body: JSON.stringify(DTO),
    headers: {
      'Content-Type': 'application/json'
    }
  })

  return await res.json()
}