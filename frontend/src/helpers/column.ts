export async function get_columns_by_board_id(boardId: number) {
   const res = await fetch(`http://localhost:8000/column/board/${boardId}`)
}