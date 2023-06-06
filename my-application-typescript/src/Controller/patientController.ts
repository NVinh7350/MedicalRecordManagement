import {updatePatientInfoService } from "../Sevices/patientServices";
import { Request, Response } from "express";;

export const updatePatientInfo = async (req: Request, res: Response) => {
    try {
        const userInfo = {
            ...req.body.user,
            birthDay : new Date(req.body.user.birthDay)
        };
        const patientInfo = req.body.patient;
        console.log(patientInfo)
        await updatePatientInfoService(userInfo, patientInfo);
        res.send(`success update patient ${req.body.citizenId}`);
    } catch (error) {
        res.send(error);
    }
}