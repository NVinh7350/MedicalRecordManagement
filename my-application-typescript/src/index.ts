import express, { Request, Express, Response } from "express"
import configViewEngine from "./Config/configViewEngine";
import initAPIRoute from "./Routers/router"
import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
dotenv.config();


const port: number = Number(process.env.PORT || '1111');
const app: Express = express();

configViewEngine(app);
initAPIRoute(app);

app.listen(port, () => {
    console.log(`server is listening on port ${port}`)
})

// const prisma = new PrismaClient();


// (async () => {
//     try {
//         await prisma.medicalRecord.create({
//             data: {
//                 // MRId: 'mr001',
//                 status: "CREATING",
//                 creator: {
//                     connect: {
//                         citizenId: "035123123035123121"
//                     }
//                 },
//                 owner: {
//                     connect: {
//                         citizenId: "035123123035123127"
//                     }
//                 },
//                 typeMR : "INPATIENT",
                
//                 bed: "010",
//                 specialty: 'N',
//                 treatments: {
//                 create: {
//                     diseaseProgression: "bt",
//                     treatmentTime: new Date(),
//                     medicine: {
//                         create : {
//                             totalDay: 3,
//                             drugDosage: '300mml',
//                             drugFrequency: 2,
//                             specify: 'sau an',
//                             medicineName: 'paracetamon',    
//                         }
//                     }
//                 }
//                 },
//                 comeTime: new Date(),
//                 leaveTime: new Date(),
//                 ReExaminationTime: new Date(),
//                 personalMH: "binh thuong",
//                 familyMH: "binh thuong",
//                 majorReason: "dau dau",
//                 pathogenesis: "hom qua mat ngu",
//                 body: "binh thuong",
//                 organs: "binh thuong",
//                 pulse : 72	,	// Mạch đập 
//                 temperature : 27.5, // Nhiệt độ
//                 maxBP : 120, 	//Maximum blood pressure: Huyết áp tối đa
//                 minBP : 68, 	//Minimum blood pressure: Huyết áp tối thiểu
//                 breathing :72, // Nhịp thở
//                 weight :73.2,
//                 tests: {
//                     create: {
//                         typeTest: "chup ct",
//                         resultTest: "bt"
//                     }
//                 },
//                 summaryMR: "da chup ct, cac thong so bt",
//                 diagnosis: "dau dau do cam cum",
//                 prognosis: "nhe",
//                 directionTreatment: "dung thuoc va theo doi tai benh vien"
//             }
//         })
//     } catch (error) {
//         console.error(error);
//     }
// })()