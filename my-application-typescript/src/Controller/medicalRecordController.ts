import { Request, Response } from "express"
import { medicalRecordServices } from "../Sevices/medicalRecordService"
import { v4 as uuidv4 } from 'uuid';
import { MedicalRecord, Prisma } from "@prisma/client";
const createMRInpatient = async (req: Request, res: Response) => {
    try {
        const MRId = uuidv4();
        const medicalRecord = {
            ...req.body.medicalRecord,
            status: "CREATING",
            typeMR: "INPATIENT",
            MRId: MRId
        };

        const tests = req.body.medicalRecord.tests;
        const treatments = req.body.medicalRecord.treatments;

        
        await medicalRecordServices.createMRService(medicalRecord, tests, treatments);
        res.status(200).json("Success creaete inpatientMR");
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

const findMRByDoctorId = async (req: Request, res: Response) => {
    try {
        const doctorId = req.body.doctorId;
        const result = await medicalRecordServices.findMRByDoctorIdService(doctorId)
        res.status(200).json(result);
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}
export const medicalRecordController = {
    createMRInpatient,
    findMRByDoctorId
}