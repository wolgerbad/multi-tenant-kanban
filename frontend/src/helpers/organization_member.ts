import { env } from "@/utils/envSchema"

export async function get_members_of_organization(orgId: number) {
  const res = await fetch(`${env.SERVER_URL}/organization-member/organization/${orgId}`)
  return await res.json()
}
