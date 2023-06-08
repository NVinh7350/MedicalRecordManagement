import express, { Router, Express, Request, Response } from "express";
import { userController } from "../Controller/userController";
import { medicalRecordController } from "../Controller/medicalRecordController";
const router: Router = express.Router();

const initAPIRoute = (app: Express) => {

    router.post('/Admin/createAdmin', userController.createAdmin);
    router.post('/changePassword', userController.changePassword);
    router.post('/login', userController.login);
    router.post('/Admin/createPatient', userController.createPatient);
    router.post('/Admin/createDoctor', userController.createDoctor); 
    router.get('/getPatientList/:page', userController.getPatientList);
    router.get('/getDoctorList/:page', userController.getDoctorList);
    router.get('/getPatientById', userController.getPatientById);
    router.get('/getDoctorById', userController.getDoctorById);
    router.put('/Patient/updatePatientInfo', userController.updatePatientInfo);

    router.put('/Doctor/updateDoctorInfo', userController.updateDoctorInfo);
    router.post('/Doctor/createMRInpatient', medicalRecordController.createMRInpatient )
    router.get('/Doctor/findMRByDoctorId', medicalRecordController.findMRByDoctorId)

    return app.use('/api/v1/',router);
}

export default initAPIRoute;