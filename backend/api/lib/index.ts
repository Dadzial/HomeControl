import App from './app';
import UserController from './controllers/user.controller';
import LightController from "./controllers/light.controller";

const app = new App([]);
const io = app.getIo();

app.app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-auth-token');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

const controllers = [
    new LightController(io),
    new UserController(),
];

controllers.forEach((controller) => {
    app.app.use("/", controller.router);
});

app.listen();