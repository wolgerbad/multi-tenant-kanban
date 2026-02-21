import { env } from "@/utils/envSchema"

export async function send_organization_invite(inviteDTO) {
  const res = await fetch(`${env.SERVER_URL}/organization-invite/invite`, {
    method: 'POST',
    body: JSON.stringify(inviteDTO),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  return await res.json()
}

export async function get_organization_invites_of_member(userId: number) {
  const res = await fetch(`${env.SERVER_URL}/organization-invite/user/${userId}`)
  return await res.json()
}

export async function answer_organization_invite(answer: string, inviteId: number) {
  const res = await fetch(`${env.SERVER_URL}/organization-invite/answer`, {
    method: 'POST',
    body: JSON.stringify({ answer, invite_id: inviteId }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return await res.json()
}
