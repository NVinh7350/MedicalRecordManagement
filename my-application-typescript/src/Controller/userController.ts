import { createPatientService, getPatientListService } from "../Sevices/patientServices";
import e, { Request, Response } from "express";
import { getX509IdentityService, insertX509IdentityService } from "../Sevices/userServices";
import { buildCAClient, changeSecret, enrollIdentity } from "../Sevices/fabricCAServices";
import { getDoctorListService } from "../Sevices/doctorServices";


export const changePassword =async (req: Request, res: Response) => {
    try {
        const organization = req.body.organization;
        const citizenId = req.body.citizenId;
        const caClient = await buildCAClient(organization);

        const x509Identity = await getX509IdentityService(citizenId);
        const newX509Identity = await changeSecret(caClient?.caClient, x509Identity, caClient?.mspOrg, citizenId, req.body.password, req.body.newPW);
        await insertX509IdentityService(citizenId, JSON.stringify(newX509Identity));
        res.send('Success');
    } catch (error) {
        res.send(error);
    }
}

export const login = async(req: Request, res: Response) => {
    try {
        const organization = req.body.organization;
        const citizenId = req.body.citizenId;
        const password = req.body.password;
        const caClient = await buildCAClient(organization);
        
        const newX509Identity = await enrollIdentity(caClient?.caClient, caClient?.mspOrg, citizenId, password )
        await insertX509IdentityService(citizenId, JSON.stringify(newX509Identity));
        res.send(newX509Identity);
    } catch (error) {
        res.send(error);
    }
}

export const getDoctorList = async(req: Request, res: Response) => {
    try {
        const page = Number(req.params.page);
        const resutl = await getDoctorListService(page);
        res.send(resutl);
    } catch (error) {
        res.send(error);
    }
}

export const getPatientList = async(req: Request, res: Response) => {
    try {
        const page = Number(req.params.page);
        const resutl = await getPatientListService(page);
        res.send(resutl);
    } catch (error) {
        res.send(error);
    }
}