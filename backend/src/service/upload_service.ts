import { PutObjectCommand } from "@aws-sdk/client-s3";
import { client } from "../sockets/index.js"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import dotenv from "dotenv"

dotenv.config()

async function create_presigned_url(DTO: { file_type: string; file_name: string }) {
    const key = `${DTO.file_name}-${Date.now()}`
    const putCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        ContentType: DTO.file_type
    })

   const signed_url = await getSignedUrl(client, putCommand, { expiresIn: 60 } )
   const final_url = `https://${process.env.AWS_BUCKET_NAME}-bucket.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
   return {signed_url, final_url}
}

export const upload_service = { create_presigned_url }