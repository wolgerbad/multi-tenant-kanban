import { Card } from "@/types";

export async function create_card(cardDTO: Card) {
   const res = await fetch('http://localhost:8000/card/create', {
        method: 'POST',
        body: JSON.stringify(cardDTO),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
    })

    return res.json()
}