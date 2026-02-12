export async function get_user(userId: number) {
    const res = await fetch(`http://localhost:8000/user/${userId}`)
    return await res.json()
}