import e, { Request, Response } from "express";
import { userServices } from "../Sevices/userServices";
import { buildCAClient, changeSecret, enrollIdentity, registerIdentity } from "../Sevices/fabricCAServices";

const createAdmin = async (req: Request, res: Response) => {
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
        await userServices.createUserService(newUser);

        res.send('success');
    } catch (error) {
        if (error instanceof Error) {
            res.send(error.message);
        }
    }
}

const createPatient = async (req: Request, res: Response) => {
    try {
        const adminId = req.body.adminId ;
        const patientId = req.body.user.citizenId;
        const password = req.body.user.password;
        const organization = req.body.organization;
        const caClient = await buildCAClient(organization);

        const adminX509Identity = await userServices.getX509IdentityService(adminId);

        await registerIdentity(caClient?.caClient, adminX509Identity, caClient?.mspOrg,adminId, patientId, 'PATIENT', caClient?.affiliation);
        const newUser = {
            ...req.body.user,
            birthDay: new Date(req.body.user.birthDay),
            role: "PATIENT"
        }
        const patientInfo = req.body.patient;
        await userServices.createPatientService(newUser, patientInfo);

        res.send('success create patient');
    } catch (error) {
        console.log(error)
        res.send(error);
    }
}

const createDoctor = async (req: Request, res: Response) => {
    try {
        
        const adminId = req.body.adminId ;
        const doctorId = req.body.user.citizenId;
        const password = req.body.user.password;
        const organization = req.body.organization;
        const caClient = await buildCAClient(organization);

        const adminX509Identity = await userServices.getX509IdentityService(adminId);

        await registerIdentity(caClient?.caClient, adminX509Identity, caClient?.mspOrg,adminId, doctorId, 'DOCTOR', caClient?.affiliation);
        const newUser = {
            ...req.body.user,
            birthDay: new Date(req.body.user.birthDay),
            role : "DOCTOR"
        }
        const doctorInfo = req.body.doctor;
        await userServices.createDoctorService(newUser, doctorInfo);

        res.send('success create doctor');
    } catch (error) {
        res.send(error);
    }
}

const changePassword =async (req: Request, res: Response) => {
    try {
        const organization = req.body.organization;
        const citizenId = req.body.citizenId;
        const caClient = await buildCAClient(organization);

        const x509Identity = await userServices.getX509IdentityService(citizenId);
        const newX509Identity = await changeSecret(caClient?.caClient, x509Identity, caClient?.mspOrg, citizenId, req.body.password, req.body.newPW);
        await userServices.insertX509IdentityService(citizenId, JSON.stringify(newX509Identity));
        res.send('Success');
    } catch (error) {
        res.send(error);
    }
}

const login = async(req: Request, res: Response) => {
    try {
        const organization = req.body.organization;
        const citizenId = req.body.citizenId;
        const password = req.body.password;
        const caClient = await buildCAClient(organization);
        
        const newX509Identity = await enrollIdentity(caClient?.caClient, caClient?.mspOrg, citizenId, password )
        await userServices.insertX509IdentityService(citizenId, JSON.stringify(newX509Identity));
        res.send(newX509Identity);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getDoctorById = async(req: Request, res: Response) => {
    try {
        const doctorId = req.body.doctorId;
        const resutl = await userServices.getDoctorByIdService(doctorId);
        res.send(resutl);
    } catch (error) {
        res.send(error);
    }
}

const getDoctorList = async(req: Request, res: Response) => {
    try {
        const page = Number(req.params.page);
        const resutl = await userServices.getDoctorListService(page);
        res.send(resutl);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getPatientList = async(req: Request, res: Response) => {
    try {
        const page = Number(req.params.page);
        const resutl = await userServices.getPatientListService(page);
        res.send(resutl);
    } catch (error) {
        res.send(error);
    }
}

const getPatientById = async(req: Request, res: Response) => {
    try {
        const patientId = req.body.patientId;
        const resutl = await userServices.getPatientByIdService(patientId);
        res.send(resutl);
    } catch (error) {
        res.send(error);
    }
}

const updatePatientInfo = async (req: Request, res: Response) => {
    try {
        const userInfo = {
            ...req.body.user,
            birthDay : new Date(req.body.user.birthDay)
        };
        const patientInfo = req.body.patient;
        console.log(patientInfo)
        await userServices.updatePatientInfoService(userInfo, patientInfo);
        res.send(`success update patient ${req.body.citizenId}`);
    } catch (error) {
        res.send(error);
    }
}


const updateDoctorInfo = async (req: Request, res: Response) => {
    try {
        const userInfo = {
            ...req.body.user,
            birthDay : new Date(req.body.user.birthDay)
        };
        const doctorInfo = req.body.doctor;
        await userServices.updateDoctorInfoService(userInfo, doctorInfo);
        res.send(`success update doctor ${req.body.citizenId}`);
    } catch (error) {
        res.send(error);
    }
}

export const userController = {
    createAdmin,
    login,
    changePassword,
    createPatient,
    updatePatientInfo,
    createDoctor,
    updateDoctorInfo,
    getDoctorList,
    getPatientList,
    getPatientById,
    getDoctorById
}