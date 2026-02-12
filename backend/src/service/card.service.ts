import { Card } from "../db/schema.js";
import { card_repository } from "../repository/card.repository.js";

async function create_card(cardDTO: Card) {
    return await card_repository.create_card(cardDTO)
}

export const card_service = { create_card }