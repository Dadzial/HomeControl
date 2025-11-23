import App from './app';
import UserController from './controllers/user.controller';
import LightController from "./controllers/light.controller";
import WeatherController from "./controllers/weather.controller";
import ClimateController from "./controllers/climate.controller";
import EnergyController from "./controllers/energy.controller";
import GazController from "./controllers/gaz.controller";
import AlarmController from "./controllers/alarm.controller";

const app = new App();

app.app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

const io = app.getIo();
const controllers = [
    new AlarmController(),
    new GazController(),
    new EnergyController(),
    new ClimateController(io),
    new LightController(io),
    new UserController(),
    new WeatherController()
];

controllers.forEach(controller => {
    app.app.use("/", controller.router);
});

app.listen();
