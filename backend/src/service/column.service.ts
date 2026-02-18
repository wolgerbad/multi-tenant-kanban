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

async function switch_column_positions(columns: { dragged_column: number; dropped_column: number }) {
  const [dragged_column] = await column_repository.get_column(columns.dragged_column)
  const [dropped_column] = await column_repository.get_column(columns.dropped_column)
  return await column_repository.switch_column_positions({dragged_column, dropped_column})
}

async function update_column_title(DTO: { column_id: number; title: string }) {
 return await column_repository.update_column_title(DTO.column_id, DTO.title)
}

export const column_service = { get_columns_by_board_id, create_column, switch_column_positions, update_column_title }