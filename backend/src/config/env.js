export const config = {
  port: Number(process.env.PORT || 4000),
  dbUrl: process.env.DB_URL || process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
  socketCorsOrigin:
    process.env.SOCKET_CORS_ORIGIN ||
    process.env.CORS_ORIGIN ||
    "http://localhost:5173",
};
