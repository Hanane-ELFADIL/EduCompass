import jwt from 'jsonwebtoken'

/**
 * Optional authentication middleware.
 * - If a valid `Authorization: Bearer <token>` header is present, sets `req.user`
 *   to the decoded JWT payload.
 * - If the header is absent, malformed, or the token is invalid/expired, sets
 *   `req.user` to `null`.
 * - Always calls `next()` — never sends a 401 or 403 response.
 */
const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null
      return next()
    }

    const token = authHeader.slice(7) // strip "Bearer "

    if (!token) {
      req.user = null
      return next()
    }

    const secret = process.env.JWT_SECRET || 'secret'
    req.user = jwt.verify(token, secret)
  } catch {
    // Token is invalid, expired, or otherwise unverifiable — treat as guest
    req.user = null
  }

  next()
}

export default optionalAuth
