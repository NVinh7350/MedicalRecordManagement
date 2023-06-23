import express, { Request, Express, Response } from "express"
import configViewEngine from "./Config/configViewEngine";
import initAPIRoute from "./Routers/router"
import * as dotenv from "dotenv";
import { ledgerService } from "./Sevices/ledgerServices";
import { buildCAClient } from "./Sevices/fabricCAServices";
import { PrismaClient } from "@prisma/client";
dotenv.config();


const port: number = Number(process.env.PORT || '1111');
const app: Express = express();
app.use(function (req: Request , res: Response, next) {
    
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization, Params');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    console.log(req.method)
    if(req.method == 'OPTIONS'){
        console.log('optiuons')
        res.end();
    }

    // Pass to next layer of middleware
    next();
});


configViewEngine(app);
initAPIRoute(app);



app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})
