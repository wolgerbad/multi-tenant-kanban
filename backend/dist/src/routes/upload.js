import { Router } from "express";
import { upload_controller } from "../controller/upload_controller.js";
export const router = Router();
router.post('/image/create-url', upload_controller.create_presigned_url);
