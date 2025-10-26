import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3100,
    databaseUrl: process.env.DATABASE_URL as string,
    JwtSecret: process.env.JWT_SECRET as string,
    socketPort: process.env.SOCKET_PORT || 3000
};
