import express, { Router, Express, Request, Response } from "express";
import { createAdmin, createDoctor, createPatient } from "../Controller/adminController";
import { changePassword, getDoctorList, getPatientList, login } from "../Controller/userController";
import { updatePatientInfo } from "../Controller/patientController";
import { updateDoctorInfo } from "../Controller/doctorController";
const router: Router = express.Router();

const initAPIRoute = (app: Express) => {

    // router.post('/createPatient', createPatient );
    // router.post('createAdmin', createAdmin);
    // router.get('/getPatientByID', getPatientByID);
    // router.get('/login',autheticationUser);
    router.post('/Admin/createAdmin', createAdmin);
    router.post('/changePassword', changePassword);
    router.post('/login', login);
    router.post('/Admin/createPatient', createPatient);
    router.post('/Admin/createDoctor', createDoctor); 
    router.get('/getPatientList/:page', getPatientList);
    router.get('/getDoctorList/:page', getDoctorList);

    router.put('/Patient/updatePatientInfo', updatePatientInfo);

    router.put('/Doctor/updateDoctorInfo', updateDoctorInfo);
    return app.use('/api/v1/', router);
}

export default initAPIRoute;