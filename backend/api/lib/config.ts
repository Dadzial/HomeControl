import dotenv from 'dotenv';
dotenv.config();

export const config = {
    port: process.env.PORT || 3100,
    databaseUrl: process.env.DATABASE_URL as string,
    JwtSecret: process.env.JWT_SECRET as string,
    socketPort: process.env.SOCKET_PORT || 3000,

     openWeather: {
    apiKey: process.env.OPENWEATHER_API_KEY as string,
    lat: parseFloat(process.env.OPENWEATHER_LAT || "52.2297"),
    lon: parseFloat(process.env.OPENWEATHER_LON || "21.0122"),
    units: (process.env.OPENWEATHER_UNITS || "metric") as "metric" | "imperial",
    lang: process.env.OPENWEATHER_LANG || "pl",
  },
};
