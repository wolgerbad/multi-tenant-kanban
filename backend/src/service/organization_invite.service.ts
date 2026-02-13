import { organization_invite_repository } from "../repository/organization_invite.repository.js"
import { user_repository } from "../repository/user.repository.js";

async function send_organization_invite(inviteDTO: {org_id: number; sender_id: number, email: string}) {
   const [user] = await user_repository.get_user_by_email(inviteDTO.email)
   if(!user) return {ok: false, error: 'User with the given email does not exist.'}

   const finalDTO = { org_id: +inviteDTO.org_id, sender_id: +inviteDTO.sender_id, receiver_id: user.id }
    await organization_invite_repository.send_organization_invite(finalDTO)
    return {ok: true}
}

async function get_organization_invites_of_member(userId: number) {
    await organization_invite_repository.get_organization_invites_of_member(userId)
}

export const organization_invite_service = { send_organization_invite, get_organization_invites_of_member }