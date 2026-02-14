import { Card } from "../db/schema.js";
import { card_repository } from "../repository/card.repository.js";

async function create_card(cardDTO: Card) {
    return await card_repository.create_card(cardDTO)
}

async function switch_card_positions(card_ids: { dragged_card: number; dropped_card: number }) {
    const [dragged_card] = await card_repository.get_card(card_ids.dragged_card)
    const [dropped_card] = await card_repository.get_card(card_ids.dropped_card)

    return await card_repository.switch_card_positions(dragged_card, dropped_card)
}

async function switch_card_column(DTO: { card_id: number; column_id: number; }) {
    const cards = await card_repository.get_cards_by_column_id(DTO.column_id)
    const last_card_position = cards.at(-1)?.position
    return card_repository.switch_card_column({...DTO, position: last_card_position ? last_card_position + 1 : 0})
}

export const card_service = { create_card, switch_card_positions, switch_card_column }