export async function get_columns_by_board_id(boardId: number) {
   const res = await fetch(`http://localhost:8000/column/board/${boardId}`)
   return await res.json()
}

export async function create_column(columnDTO: {title: string; position: number; org_id: number; board_id: number}) {
return await fetch("http://localhost:8000/column/create", {
   method: "POST",
   body: JSON.stringify(columnDTO),
   headers: {
      "Content-Type": "application/json"
   },
   credentials: "include"
})
}