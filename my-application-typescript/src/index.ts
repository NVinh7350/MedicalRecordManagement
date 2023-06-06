import express, { Request, Express, Response } from "express"
import configViewEngine from "./Config/configViewEngine";
import initAPIRoute from "./Routers/router"
import * as dotenv from "dotenv";
dotenv.config();


const port: number = Number(process.env.PORT || '1111');
const app: Express = express();

configViewEngine(app);
initAPIRoute(app);

app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})