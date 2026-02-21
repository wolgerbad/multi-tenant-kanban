import { Router } from 'express';
import { board_controller } from '../controller/board.controller.js';

export const router = Router();

router.get('/organization/:orgId', board_controller.get_boards_of_organization);
router.get('/:boardId', board_controller.get_board_by_id);
router.post('/create', board_controller.create_board);
