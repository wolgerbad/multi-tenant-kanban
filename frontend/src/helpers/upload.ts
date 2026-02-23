import { clientEnv } from "@/utils/envSchema";

export async function create_image_url(image: File) {
    const res = await fetch(`${clientEnv.NEXT_PUBLIC_SERVER_URL}/upload/image/create-url`, {
      method: 'POST',
      body: JSON.stringify({file_type: image.type, file_name: image.name}),
      headers: {
          'Content-Type': 'application/json'
        }
      })
      return await res.json() as { ok: true; data: { signed_url: string; final_url: string } } | { ok:false; error: string }
}

export async function upload_image_to_bucket(signed_url: string, image: File) {
   return await fetch(signed_url, {
        method: 'PUT',
        headers: {
          'Content-Type': image.type
        },
        body: image
      })
}