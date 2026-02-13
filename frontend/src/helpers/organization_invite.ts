export async function send_organization_invite(inviteDTO) {
   const res = await fetch('http://localhost:8000/organization-invite/invite', {
        method: 'POST',
        body: JSON.stringify(inviteDTO),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    return await res.json()
}

export async function get_organization_invites_of_member(userId: number) {
   const res = await fetch(`http://localhost:8000/organization-invite/user/${userId}`)
   return await res.json()
}