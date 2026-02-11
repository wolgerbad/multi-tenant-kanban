export async function get_boards_of_organization(orgId: number) {
   const res = await fetch(`http://localhost:8000/board/organization/${orgId}`)
   return await res.json()
}