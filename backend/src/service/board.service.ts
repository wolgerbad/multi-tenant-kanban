import { board_repository } from "../repository/board.repository.js";

async function get_boards_of_organization(orgId: number) {
   const result = await board_repository.get_boards_of_organization(orgId)
   if(!result.length) return {ok: false, message: 'No board found on the given organization'}

   return {ok: true, data: result}
}

async function get_board_by_id(boardId: number) {
  const [result] = await board_repository.get_board_by_id(boardId)
  if(!result) return {ok: false, message: 'No board found with the given id'}
  return {ok: true, data: result}
}

async function create_board(DTO: { board_title: string; organization_id: number }) {
 return await board_repository.create_board(DTO.organization_id, DTO.board_title)
}

export const board_service = { get_boards_of_organization, get_board_by_id, create_board }