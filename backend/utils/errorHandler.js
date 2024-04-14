/**
 * Error Handler
 * @param res
 * @param error
 */
module.exports = (res, error) => {
    res.status(500).json({
        success: false,
        message: `Error del servidor: ${error?.message}`,
        error: error
    })
}
