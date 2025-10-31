import Controller from "../interfaces/controller.interface";
import { NextFunction, Request, Response, Router } from "express";
import axios from "axios";
import { config } from "../config";

type WindInfo = {
  speed: number;
  units: "m/s" | "mph";
  deg: number;
  direction: string;
};

type WeatherPayload = {
  location: {
    name?: string;
    lat: number;
    lon: number;
  };
  weather: {
    description: string;
    iconUrl: string;
  };
  temperature: {
    value: number;
    units: "°C" | "°F";
  };
  wind: WindInfo;
  timestamp: string;
};

const CACHE_TTL_MS = 2 * 60 * 1000;
let lastResult: WeatherPayload | null = null;
let lastFetchedAt = 0;

function degToCompass(deg: number): string {
  const dirs = [
    "N","NNE","NE","ENE","E","ESE","SE","SSE",
    "S","SSW","SW","WSW","W","WNW","NW","NNW"
  ];

  const idx = Math.floor(((deg + 11.25) % 360) / 22.5);
  return dirs[idx];
}

class WeatherController implements Controller {
  public path = "/api/weather";
  public router = Router();

  private readonly apiKey: string;
  private readonly lat: number;
  private readonly lon: number;
  private readonly units: "metric" | "imperial";
  private readonly lang: string;

  constructor() {
    console.log("[WeatherController] zarejestrowano endpoint /api/weather");

    const { apiKey, lat, lon, units, lang } = config.openWeather;
    this.apiKey = apiKey;
    this.lat = lat;
    this.lon = lon;
    this.units = units;
    this.lang = lang;

    if (!this.apiKey) {
      console.warn("[weather] OPENWEATHER_API_KEY nie ustawiony w .env");
    }

    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.getCurrentWeather);
  }

  private getCurrentWeather = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      if (!this.apiKey) {
        return res.status(500).json({ message: "Brak OPENWEATHER_API_KEY w konfiguracji (.env)" });
      }

      const now = Date.now();
      if (lastResult && now - lastFetchedAt < CACHE_TTL_MS) {
        return res.status(200).json(lastResult);
      }

      const url = "https://api.openweathermap.org/data/2.5/weather";
      const { data } = await axios.get(url, {
        params: {
          lat: this.lat,
          lon: this.lon,
          appid: this.apiKey,
          units: this.units,
          lang: this.lang,
        },
        timeout: 5000,
      });

      const description: string = data?.weather?.[0]?.description ?? "brak danych";
      const icon: string = data?.weather?.[0]?.icon ?? "01d";
      const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

      const tempVal: number = data?.main?.temp ?? 0;
      const windSpeed: number = data?.wind?.speed ?? 0;
      const windDeg: number = data?.wind?.deg ?? 0;
      const direction = degToCompass(windDeg);

      const payload: WeatherPayload = {
        location: {
          name: data?.name,
          lat: this.lat,
          lon: this.lon,
        },
        weather: {
          description,
          iconUrl,
        },
        temperature: {
          value: Number(tempVal.toFixed(1)),
          units: this.units === "metric" ? "°C" : "°F",
        },
        wind: {
          speed: Number(windSpeed.toFixed(1)),
          units: this.units === "metric" ? "m/s" : "mph",
          deg: windDeg,
          direction,
        },
        timestamp: new Date().toISOString(),
      };

      lastResult = payload;
      lastFetchedAt = now;

      return res.status(200).json(payload);
    } catch (err) {
      return next(err);
    }
  };
}

export default WeatherController;
