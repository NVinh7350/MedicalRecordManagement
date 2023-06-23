import { Request, Response } from "express"
import { medicalRecordServices } from "../Sevices/medicalRecordService"
import { v4 as uuidv4 } from 'uuid';
import { userServices } from "../Sevices/userServices";
import { ledgerService } from "../Sevices/ledgerServices";
import crypto from "crypto";
import * as grpc from '@grpc/grpc-js';
import { caClientOrg1, caClientOrg2, grpcConnectionOrg1, grpcConnectionOrg2 } from "../Config/configConnection";
import sortKeysRecursive from "sort-keys-recursive";
import { Image, MedicalRecord, Medicine, Test, Treatment } from "@prisma/client";

const createMR = async (req: Request, res: Response) => {
    try {
        const organization = req.body.organization;
        const MRId : string = uuidv4();
        const MRJson = req.body.medicalRecord;
        const grpcConnection = organization =="ORG1" ? await grpcConnectionOrg1 : await grpcConnectionOrg2;

        let tests: Test[] = [];
        if(Array.isArray(req.body.tests)){
            tests = req.body.tests?.map((test :any) => {
                const images = test?.images?.map((image: Image ) => {
                    return {
                        value :image.value ? image.value : null,
                    }
                })
                return {
                    createTime : test.createTime ? test.createTime : new Date(),
                    typeTest : test.typeTest ? test.typeTest : null,
                    resultTest : test.resultTest ? test.resultTest : null,
                    images: Array.isArray(images) ? images : [],
                    MRId: MRId,
                }
            })
        }
        let treatments: Treatment[] = [];
        if(Array.isArray(req.body.treatments)){
            treatments = req.body.treatments?.map((treatment : any) =>{
                const medicines = treatment.medicines?.map((medicine : Medicine) => {
                    return {
                        medicineName : medicine.medicineName ? medicine.medicineName : null,
                        drugDosage : medicine.drugDosage ? medicine.drugDosage : null,
                        drugFrequency : medicine.drugFrequency ? medicine.drugFrequency : null,
                        totalDay : medicine.totalDay ? medicine.totalDay : null,
                        specify : medicine.specify ? medicine.specify : null,
                    }
                })
                return {
                    diseaseProgression : treatment.diseaseProgression,
                    treatmentTime : treatment.treatmentTime ? treatment.treatmentTime : new Date(),
                    treatmentOutStart : treatment.treatmentOutStart ? treatment.treatmentOutStart : null,
                    treatmentOutEnd : treatment.treatmentOutEnd ? treatment.treatmentOutEnd : null,
                    medicines: Array.isArray(medicines) ? medicines : [],
                    MRId: MRId,
                }
            })
        }
        const medicalRecord : any = {
            MRId: MRId,
            status: MRJson.status,
            doctorId: MRJson.doctorId,
            patientId: MRJson.patientId,
            typeMR: MRJson.typeMR,
            specialty: MRJson.specialty ? MRJson.specialty : null,
            bed : MRJson.bed ? MRJson.bed : null,
            comeTime: MRJson.comeTime ? MRJson.comeTime : new Date() ,
            personalMH: MRJson.personalMH,
            familyMH: MRJson.familyMH,
            majorReason: MRJson.majorReason,
            pathogenesis: MRJson.pathogenesis,
            body: MRJson.body,
            organs: MRJson.organs,
            pulse: MRJson.pulse,
            temperature: MRJson.temperature,
            maxBP: MRJson.maxBP,
            minBP: MRJson.minBP,
            breathing: MRJson.breathing,
            weight: MRJson.weight,
            summaryMR: MRJson.summaryMR,
            diagnosis: MRJson.diagnosis,
            prognosis: MRJson.prognosis,
            directionTreatment: MRJson.directionTreatment,
            patientCondition: MRJson.patientCondition ? MRJson.patientCondition : null,
            finishTime: MRJson.finishTime ? MRJson.finishTime : null ,
        }

        const hashData = crypto.createHash('sha256').update(JSON.stringify(
            {
                medicalRecord,
                tests,
                treatments
            })).digest('hex');
        await ledgerService.createMRLedgerService(grpcConnection, medicalRecord.doctorId, medicalRecord.patientId, MRId, hashData );
        await medicalRecordServices.createMRService(medicalRecord, tests, treatments);
        res.status(200).json({
            medicalRecord,
            tests,
            treatments
        });
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

const updateMR = async (req: Request, res: Response) => {
    try {

        const MRId = req.body.MRId;
        const doctorId = req.body.doctorId;
        const patientId = req.body.patientId;
        const organization = req.body.organization;
        
        const grpcConnection = organization =="ORG1" ? await grpcConnectionOrg1 : await grpcConnectionOrg2;
        
        const resultLedger = await ledgerService.readMRLedgerService(grpcConnection, doctorId, MRId, patientId);
        const resultMySQL = await medicalRecordServices.getDetailMRService(MRId);
        
        const MRHashLedger = resultLedger.medicalRecordHashData;
        const MRHashSQL    = crypto.createHash('sha256').update(JSON.stringify(resultMySQL)).digest('hex'); 

        if(MRHashLedger !== MRHashSQL){
            throw new Error(`medical record ${MRId} không khớp với sổ cái blockchain`);
        }

        let tests: any[] = [];
        if(Array.isArray(req.body.tests)){
            tests = req.body.tests?.map((test :any) => {
                const images = test?.images?.map((image: Image ) => {
                    return {
                        value :image.value ? image.value : null,
                    }
                })
                return {
                    createTime : test.createTime ? test.createTime : new Date(),
                    typeTest : test.typeTest ? test.typeTest : null,
                    resultTest : test.resultTest ? test.resultTest : null,
                    images: Array.isArray(images) ? images : [],
                    MRId: MRId,
                }
            })
        }
        let treatments: any[] = [];
        if(Array.isArray(req.body.treatments)){
            treatments = req.body.treatments?.map((treatment : any) =>{
                const medicines = treatment.medicines?.map((medicine : Medicine) => {
                    return {
                        medicineName : medicine.medicineName ? medicine.medicineName : null,
                        drugDosage : medicine.drugDosage ? medicine.drugDosage : null,
                        drugFrequency : medicine.drugFrequency ? medicine.drugFrequency : null,
                        totalDay : medicine.totalDay ? medicine.totalDay : null,
                        specify : medicine.specify ? medicine.specify : null,
                    }
                })
                return {
                    diseaseProgression : treatment.diseaseProgression,
                    treatmentTime : treatment.treatmentTime ? treatment.treatmentTime : new Date(),
                    treatmentOutStart : treatment.treatmentOutStart ? treatment.treatmentOutStart : null,
                    treatmentOutEnd : treatment.treatmentOutEnd ? treatment.treatmentOutEnd : null,
                    medicines: Array.isArray(medicines) ? medicines : [],
                    MRId: MRId,
                }
            })
        }
        resultMySQL.tests.push(...tests);
        resultMySQL.treatments.push(...treatments);
        
        const updateMRHash = crypto.createHash('sha256').update(JSON.stringify(resultMySQL)).digest('hex'); 
        await ledgerService.updateMRLedgerService(grpcConnection, doctorId, patientId, MRId, updateMRHash);
        await medicalRecordServices.updateMRService(tests, treatments);
        res.status(200).json(
            {
                updateMRHash
            }
        );
        
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

const completedMR = async (req: Request, res: Response) => {
    try{
    const MRId = req.body.MRId;
    const doctorId = req.body.doctorId;
    const patientId = req.body.patientId;
    const organization = req.body.organization;
    const patientCondition = req.body.patientCondition;
    
    const grpcConnection = organization =="ORG1" ? await grpcConnectionOrg1 : await grpcConnectionOrg2;
    
    const resultLedger = await ledgerService.readMRLedgerService(grpcConnection, doctorId, MRId, patientId);
    let resultMySQL = await medicalRecordServices.getDetailMRService(MRId);
    
    const MRHashLedger = resultLedger.medicalRecordHashData;
    const MRHashSQL    = crypto.createHash('sha256').update(JSON.stringify(resultMySQL)).digest('hex'); 
    
    if(MRHashLedger !== MRHashSQL){
        throw new Error(`medical record ${MRId} không khớp với sổ cái blockchain`);
    }
    if(!resultMySQL.medicalRecord){
        throw new Error(`medical record ${MRId} khong ton tai`);
    }
    resultMySQL.medicalRecord.finishTime = new Date();
    resultMySQL.medicalRecord.patientCondition = patientCondition;
    resultMySQL.medicalRecord.status = "COMPLETED";

    const updateMRHash = crypto.createHash('sha256').update(JSON.stringify(resultMySQL)).digest('hex'); 
    
    await ledgerService.finishMRLedgerService(grpcConnection, doctorId, patientId, MRId, updateMRHash);
    await medicalRecordServices.completedMRService(resultMySQL.medicalRecord);
    const rs2 = await medicalRecordServices.getDetailMRService(MRId)
    const updateMRHash2 = crypto.createHash('sha256').update(JSON.stringify(rs2)).digest('hex'); 

    res.status(200).json(
        {resultMySQL, updateMRHash, updateMRHash2, rs2}
    );
        
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}

const getDetailMR = async (req: Request, res: Response) => {
    try {
        const MRId = req.body.MRId;
        const citizenId = req.body.citizenId;
        const organization = req.body.organization;
        const patientId = req.body.patientId;
        const grpcConnection = organization =="ORG1" ? await grpcConnectionOrg1 : await grpcConnectionOrg2;
        const resultLedger = await ledgerService.readMRLedgerService(grpcConnection, citizenId, MRId, patientId);
        let resultMySQL = await medicalRecordServices.getDetailMRService(MRId);
        
        const MRHashLedger = resultLedger.medicalRecordHashData;
        const MRHashSQL    = crypto.createHash('sha256').update(JSON.stringify(resultMySQL)).digest('hex'); 
        console.log(MRHashLedger === MRHashSQL);
        if(MRHashLedger !== MRHashSQL){
            throw new Error(`medical record ${MRId} không khớp với sổ cái blockchain`);
        }
        res.status(200).json({
            resultMySQL
        })
    } catch (error) {
        console.log(error)
        res.status(500).json(error);
    }
}



export const medicalRecordController = {
    createMR,
    updateMR,
    getDetailMR,
    completedMR
}