export async function get_organizations_of_member(userId: number) {
 const res =  await fetch(`http://localhost:8000/organization/${userId}`)
 return await res.json()
}