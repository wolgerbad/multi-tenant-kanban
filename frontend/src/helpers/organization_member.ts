export async function get_members_of_organization(orgId: number) {
  const res = await fetch(`http://localhost:8000/organization-member/organization/${orgId}`)
  return await res.json()
}
