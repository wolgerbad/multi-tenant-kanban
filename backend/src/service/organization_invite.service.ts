import { organization_invite_repository } from '../repository/organization_invite.repository.js';
import { organization_member_repository } from '../repository/organization_member.repository.js';
import { user_repository } from '../repository/user.repository.js';

async function send_organization_invite(inviteDTO: {
  org_id: number;
  sender_id: number;
  email: string;
  role: string;
}) {
  const [user] = await user_repository.get_user_by_email(inviteDTO.email);
  const org_ids =
    await organization_member_repository.get_organization_ids_of_member(
      user.id
    );
  const is_user_in_the_organization = org_ids?.find(
    (org_id) => org_id === inviteDTO.org_id
  );

  if (!user)
    return { ok: false, error: 'User with the given email does not exist.' };
  const inviteExists =
    await organization_invite_repository.get_organization_invite(
      user.id,
      inviteDTO.org_id
    );
  if (inviteExists.length > 0 && inviteExists[0].status === 'pending')
    return {
      ok: false,
      error: 'The user already has pending invitation for given organization.',
    };
  if (is_user_in_the_organization)
    return { ok: false, error: 'The user is already in the organization.' };
  const finalDTO = {
    org_id: +inviteDTO.org_id,
    sender_id: +inviteDTO.sender_id,
    receiver_id: user.id,
    role: inviteDTO.role,
  };
  const [invite] =
    await organization_invite_repository.send_organization_invite(finalDTO);
  const [receiver] =
    await organization_invite_repository.get_receiver_id_by_invite_id(
      invite.id
    );

  return { ok: true, data: receiver.receiver_id };
}

async function get_organization_invites_of_member(userId: number) {
  const result =
    await organization_invite_repository.get_organization_invites_of_member(
      userId
    );
  if (!result.length) return { ok: false, message: 'No pending invites.' };

  return { ok: true, data: result };
}

async function answer_organization_invite(answer: string, invite_id: number) {
  const status =
    answer === 'accept' ? 'accepted' : answer === 'decline' ? 'declined' : '';
  if (!status || !invite_id) return { ok: false, message: 'Invalid status.' };
  const org = await organization_invite_repository.answer_organization_invite(
    status,
    invite_id
  );
  if (org.status === 'accepted')
    await organization_member_repository.create_organization_member(
      org.org_id,
      org.user_id,
      org.role
    );
  return { ok: true };
}

export const organization_invite_service = {
  send_organization_invite,
  get_organization_invites_of_member,
  answer_organization_invite,
};
