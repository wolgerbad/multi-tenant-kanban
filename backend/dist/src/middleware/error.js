export async function error_handler(err, req, res, next) {
    if (err.status) {
        return res.status(err.status).json({ message: err.message, code: err.code });
    }
    res.status(500).json({ message: err.message, code: err.code });
}
