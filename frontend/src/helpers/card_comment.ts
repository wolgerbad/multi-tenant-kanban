export async function get_card_comments(card_id: number) {
   const res = await fetch(`http://localhost:8000/card/comments/${card_id}`)

   return await res.json()
}

export async function create_card_comment(DTO: { sender_id: number; card_id: number; org_id: number; comment: string }) {
   const res = await fetch('http://localhost:8000/card/comment/create', {
        method: 'POST', 
        body: JSON.stringify(DTO),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return await res.json()
}