import { Request, Response } from "express"
import { medicalRecordServices } from "../Sevices/medicalRecordService"
import { v4 as uuidv4 } from 'uuid';
import { MedicalRecord, Prisma } from "@prisma/client";
import { userServices } from "../Sevices/userServices";
const createMR = async (req: Request, res: Response) => {
    try {
        const medicalRecord = req.body.medicalRecord;
        const tests = Array.isArray( req.body.medicalRecord.tests ) ?  req.body.medicalRecord.tests: [];
        const treatments = Array.isArray(req.body.medicalRecord.treatments) ? req.body.medicalRecord.treatments : [];
        const check = await userServices.checkAccess(medicalRecord.doctorId, medicalRecord.patientId);
        if(check) {
            await medicalRecordServices.createMRService(medicalRecord, tests, treatments);
            res.status(200).json("Success create medical record");
        } else {
            res.status(500).json("Ban khong co quyen truy cap");
        }
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

const updateMR = async (req: Request, res: Response) => {
    try {

        const MRId = req.body.MRId;
        const doctorId = req.body.doctorId;
        const tests = Array.isArray( req.body.tests ) ?  req.body.tests: [];
        const treatments = Array.isArray(req.body.treatments) ? req.body.treatments : [];
        await medicalRecordServices.updateMRService(MRId, doctorId , tests, treatments);
        res.status(200).json("Success create medical record");
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

const getDetailMR = async (req: Request, res: Response) => {
    try {
        const MRId = req.body.MRId;
        const citizenId = req.body.citizenId;
        const detailMR = await medicalRecordServices.getDetailMRService(MRId, citizenId);
        res.status(200).json(detailMR)
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}


export const medicalRecordController = {
    createMR,
    updateMR,
    getDetailMR
}