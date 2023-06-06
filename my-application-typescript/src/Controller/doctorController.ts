import {updateDoctorInfoService } from "../Sevices/doctorServices";
import { Request, Response } from "express";;

export const updateDoctorInfo = async (req: Request, res: Response) => {
    try {
        const userInfo = {
            ...req.body.user,
            birthDay : new Date(req.body.user.birthDay)
        };
        const doctorInfo = req.body.doctor;
        await updateDoctorInfoService(userInfo, doctorInfo);
        res.send(`success update doctor ${req.body.citizenId}`);
    } catch (error) {
        res.send(error);
    }
}