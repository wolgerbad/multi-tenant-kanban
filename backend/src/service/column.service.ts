import { Column } from "../db/schema.js";
import { card_repository } from "../repository/card.repository.js";
import { column_repository } from "../repository/column.repository.js";

async function get_columns_by_board_id(boardId: number) {
   const columns = await column_repository.get_columns_by_board_id(boardId)
   if(!columns.length) return { ok:false, message: 'No column found for the given board id' }
   console.log("columns", columns)
   return {ok: true, data: columns}
}

async function create_column(columnDTO: Column) {
  return await column_repository.create_column(columnDTO)
}

export const column_service = { get_columns_by_board_id, create_column }