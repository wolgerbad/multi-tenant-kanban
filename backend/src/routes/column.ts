import { Router } from 'express';
import { column_controller } from '../controller/column.controller.js';

export const router = Router();

router.get('/board/:boardId', column_controller.get_columns_by_board_id);

router.post('/create', column_controller.create_column);
router.post('/switch-positions', column_controller.switch_column_positions);
router.post('/update-title', column_controller.update_column_title);
