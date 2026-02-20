import { card_repository } from "../repository/card.repository.js";
import { card_comment_repository } from "../repository/card_comment.repository.js";
async function create_card(cardDTO) {
    return await card_repository.create_card(cardDTO);
}
async function switch_card_positions(card_ids) {
    const [dragged_card] = await card_repository.get_card(card_ids.dragged_card);
    const [dropped_card] = await card_repository.get_card(card_ids.dropped_card);
    return await card_repository.switch_card_positions(dragged_card, dropped_card);
}
async function switch_card_column(DTO) {
    const cards = await card_repository.get_cards_by_column_id(DTO.column_id);
    const last_card_position = cards.at(-1)?.position ?? -1;
    return card_repository.switch_card_column({ ...DTO, position: last_card_position + 1 });
}
async function get_card_comments(card_id) {
    const result = await card_comment_repository.get_card_comments(card_id);
    if (!result.length)
        return { ok: false, message: 'No comments found.' };
    return { ok: true, data: result };
}
async function create_card_comment(DTO) {
    return await card_comment_repository.create_card_comment(DTO);
}
async function update_card(card_id, values) {
    return await card_repository.update_card(card_id, values);
}
export const card_service = { create_card, switch_card_positions, switch_card_column, get_card_comments, create_card_comment, update_card };
