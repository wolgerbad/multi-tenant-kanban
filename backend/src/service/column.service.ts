import { card_repository } from "../repository/card.repository.js";
import { column_repository } from "../repository/column.repository.js";

async function get_columns_by_board_id(boardId: number) {
   const columns = await column_repository.get_columns_by_board_id(boardId)
   if(!columns.length) return { ok:false, message: 'No column found for the given board id' }
   const columnIds = columns.map(column => column.id)
   const cards = await card_repository.get_cards_by_column_id(columnIds)
   if(!cards.length) return {ok:false, message: 'No card found with the given column id'}

   return;
}