import { createPatientService } from "../Sevices/patientServices";
import { Request, Response } from "express";
import { buildCCPOrg1, buildCCPOrg2 } from "../Utils/fabricCaUtils";
import { buildCAClient, enrollIdentity, registerIdentity } from "../Sevices/fabricCAServices"
import { createUserService, getX509IdentityService } from "../Sevices/userServices";
import { createDoctorService } from "../Sevices/doctorServices";

export const createAdmin = async (req: Request, res: Response) => {
    try {
        const citizenId = req.body.user.citizenId;
        const password = req.body.user.password;
        const organization = req.body.organization;
        const caClient = await buildCAClient(organization);

        const newX509Identity = await enrollIdentity(caClient?.caClient, caClient?.mspOrg, citizenId, password);
        const newUser = {
            ...req.body.user,
            birthDay: new Date(req.body.user.birthDay),
            x509Identity: JSON.stringify(newX509Identity)
        }
        await createUserService(newUser);

        res.send('success');
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
}

export const createPatient = async (req: Request, res: Response) => {
    try {
        const adminId = req.body.adminId ;
        const patientId = req.body.user.citizenId;
        const password = req.body.user.password;
        const organization = req.body.organization;
        const caClient = await buildCAClient(organization);

        const adminX509Identity = await getX509IdentityService(adminId);

        await registerIdentity(caClient?.caClient, adminX509Identity, caClient?.mspOrg,adminId, patientId, 'PATIENT', caClient?.affiliation);
        const newUser = {
            ...req.body.user,
            birthDay: new Date(req.body.user.birthDay),
            role: "PATIENT"
        }
        const patientInfo = req.body.patient;
        await createPatientService(newUser, patientInfo);

        res.send('success create patient');
    } catch (error) {
        res.send(error);
    }
}

export const createDoctor = async (req: Request, res: Response) => {
    try {
        
        const adminId = req.body.adminId ;
        const doctorId = req.body.user.citizenId;
        const password = req.body.user.password;
        const organization = req.body.organization;
        const caClient = await buildCAClient(organization);

        const adminX509Identity = await getX509IdentityService(adminId);

        await registerIdentity(caClient?.caClient, adminX509Identity, caClient?.mspOrg,adminId, doctorId, 'DOCTOR', caClient?.affiliation);
        const newUser = {
            ...req.body.user,
            birthDay: new Date(req.body.user.birthDay),
            role : "DOCTOR"
        }
        const doctorInfo = req.body.doctor;
        await createDoctorService(newUser, doctorInfo);

        res.send('success create doctor');
    } catch (error) {
        res.send(error);
    }
}
