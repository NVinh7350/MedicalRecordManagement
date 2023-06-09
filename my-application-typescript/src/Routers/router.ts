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
    router.get('/getDoctorById', userController.getDoctorById);
    router.put('/Patient/updatePatientInfo', userController.updatePatientInfo);
    router.put('/Doctor/updateDoctorInfo', userController.updateDoctorInfo);
    router.get('/getPatientList/:page', userController.getPatientList);
    router.get('/getDoctorList/:page', userController.getDoctorList);
    router.get('/Doctor/getPatientById', userController.getPatientById);
    
    // Bác sĩ yêu cầu, bệnh nhân và bác sĩ xem danh sách yêu cầu
    router.post('/Doctor/requestAccess', userController.requestAccess);
    router.get('/Patient/getRequestDoctorList/:page', userController.getRequestDoctorList);
    router.get('/Doctor/getRequestedList/:page', userController.getRequestedList);

    // Bệnh nhân chấp nhận yêu cầu, bệnh nhân và bác sĩ xem danh sách truy cập
    router.post('/Patient/acceptRequest', userController.acceptRequest);
    router.get('/Patient/getAccessibleDoctorList/:page', userController.getAccessibleDoctorList);
    router.get('/Doctor/getAuthorizedAccessList/:page', userController.getAuthorizedAccessList);

    // Bệnh nhân từ chối, bác sĩ hủy yêu cầu
    router.post('/Patient/refuseRequest', userController.refuseRequest);
    router.post('/Doctor/cancelRequest', userController.refuseRequest);

    // Bệnh nhân Thu hồi quyền truy cập 
    router.post('/Patient/revokeRequest', userController.revokeRequest);
    
    // Thêm mới bệnh án
    router.post('/Doctor/createMR', medicalRecordController.createMR);
    router.post('/Doctor/updateMR', medicalRecordController.updateMR);
    router.get('/getDetailMR', medicalRecordController.getDetailMR);

    return app.use('/api/v1/',router);
}

export default initAPIRoute;