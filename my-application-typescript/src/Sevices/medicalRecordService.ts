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
                        diseaseProgression : treatment.diseaseProgression,
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

const findMRByDoctorIdService = async (doctorId : string ) => {
    try {
        
        const result = await prisma.medicalRecord.findMany({
            where: {
                OR: [
                    {AND:{
                        doctorId: doctorId,
                        status: "CREATING"
                    }},
                    {AccessRequests: {
                        some: {
                            doctorId: doctorId,
                        }
                    }}
                ]
                
            },
            select: {
                treatments: true,
                tests: true,
                AccessRequests: true,
                status: true
            }
        })
        return result;
    } catch (error) {
        throw error;
    }
}

export const medicalRecordServices = {
    createMRService,
    findMRByDoctorIdService,
}

