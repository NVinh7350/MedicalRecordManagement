import { MedicalRecord, Medicine, PrismaClient, Test, Treatment } from "@prisma/client";
const prisma = new PrismaClient();
const createMRService = async (mr: MedicalRecord , tests: any , treatments : any ) => {
    try {   
        await prisma.medicalRecord.create({
            data: {
                ...mr,
                tests: {
                    create: tests
                },
                treatments: {
                    create: treatments?.map((treatment: any) => ({
                        ...treatment,
                        medicine: {
                            create: treatment.medicine.map( (m: any) => ({
                                ...m
                            }))
                        }
                    }))
                }
            }
        })
    } catch (error) {
        throw error;
    }
}

const updateMRService = async (MRId: string,doctorId: string ,tests: any, treatments: any ) => {
    try {   
        const allowEditing =await allowEditingService(MRId, doctorId);
        if(allowEditing){
            tests.forEach(async (test :any) => {
                await prisma.test.create({
                    data: {
                        ...test,
                        MRId : MRId
                    }
                })
            })
            treatments.forEach(async(treatment : any) => {
                await prisma.treatment.create({
                    data: {
                        ...treatment,
                        medicine: {
                            create: 
                                treatment.medicine.map((m: any) => ({
                                    ...m
                                }))
                            },
                        MRId: MRId
                    }
                })
            });
        }
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const allowEditingService = async (MRId: string,doctorId: string) => {
    try {
        const allowEditing = await prisma.medicalRecord.findMany({
            where: {
                AND : {
                    MRId: MRId,
                    status: 'CREATING',
                    doctorId: doctorId
                }
            }
        }) 
        if(allowEditing.length >0){
            return true
        }
        return false;
    } catch (error) {
        throw error;
    }
}

const completedMRService = async (mr: MedicalRecord, doctorId: string) => {
    try {
        const allowEditing =await allowEditingService(mr.MRId, doctorId);
        if(allowEditing) {
            await prisma.medicalRecord.update({
                data: {
                    status: 'COMPLETED',
                    patientCondition : mr.patientCondition,
                    finishTime: new Date()
                },
                where: {
                    MRId: mr.MRId
                }
            })
        }
    } catch (error) {
        throw error;
    }
}

const getDetailMRService = async (MRId : string, citizenId: string) => {
    try {
        
        if(!await checkAccessMRService(MRId, citizenId)) {
            throw new Error(`Ban khong co quyen truy cap benh an ${MRId}`)
        } 
        return await prisma.medicalRecord.findUnique({
            where: {
                MRId: MRId
            },
            select: {
                bed: true,
                body: true,
                breathing: true,
                comeTime: true,
                creator: {
                    select : {
                        hospital: true,
                        citizenId: true,
                        position: true,
                        specialty: true,
                        user : {
                            select : {
                                fullName: true,
                            }
                        }
                    }
                },
                diagnosis: true,
                directionTreatment: true,
                familyMH: true,
                finishTime: true,
                majorReason: true,
                maxBP: true,
                minBP: true,
                organs: true,
                pathogenesis: true,
                patientCondition: true,
                personalMH: true,
                prognosis: true,
                weight: true,
                pulse: true,
                specialty: true,
                status: true,
                summaryMR: true,
                temperature: true,
                tests: true,
                treatments: {
                    select: {
                        medicine: true,
                        diseaseProgression: true
                    }
                },
                typeMR: true

            }
        })
    } catch (error) {
        throw error
    }
}

const checkAccessMRService = async (MRId: string, citizenId: string) => {
    try{
        const checkAccess = await prisma.medicalRecord.findMany({
            where: {
                OR: [{
                    patientId: citizenId
                },
                {
                    owner: {
                        accessList: {
                            some: {
                                doctorId: citizenId
                            }
                        }
                    }
                }
            ]
            }
        })
        if(checkAccess.length > 0) {
            return true;
        }
        return false;
    } catch(error) {
        throw error
    }
}

export const medicalRecordServices = {
    createMRService,
    updateMRService,
    completedMRService,
    getDetailMRService
}

