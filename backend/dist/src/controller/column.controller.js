import { column_service } from "../service/column.service.js";
async function get_columns_by_board_id(req, res, next) {
    const boardId = Number(req.params.boardId);
    try {
        const result = await column_service.get_columns_by_board_id(boardId);
        if (!result.ok)
            throw new Error(result.message);
        res.json(result.data);
    }
    catch (error) {
        res.status(500).json([]);
    }
}
async function create_column(req, res, next) {
    const columnDTO = req.body;
    try {
        await column_service.create_column(columnDTO);
        res.json({ ok: true });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function switch_column_positions(req, res, next) {
    const columns = { ...req.body };
    try {
        await column_service.switch_column_positions(columns);
        res.json({ ok: true });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function update_column_title(req, res, next) {
    const DTO = req.body;
    try {
        await column_service.update_column_title(DTO);
        res.json({ ok: true });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}
export const column_controller = { get_columns_by_board_id, create_column, switch_column_positions, update_column_title };
