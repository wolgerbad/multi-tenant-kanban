import { clientEnv } from "@/utils/envSchema"

export async function get_members_of_organization(orgId: number) {
  const res = await fetch(`${clientEnv.NEXT_PUBLIC_SERVER_URL}/organization-member/organization/${orgId}`)
  return await res.json()
}
