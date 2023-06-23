import { Image, MedicalRecord, Medicine, PrismaClient, Test, Treatment } from "@prisma/client";
import { grpcConnectionOrg1 } from "../Config/configConnection";
const prisma = new PrismaClient();
const createMRService = async (mr: MedicalRecord , tests: Test[] , treatments : Treatment[]) => {
    try {   
        await prisma.$transaction([
            prisma.medicalRecord.create({
                data: {
                    ...mr
                }
            }),
            ...treatments.map((treatment: any) => (
                prisma.treatment.create({
                    data: {
                        ...treatment,
                        medicines: {
                            createMany: {
                                data:  [ ...treatment.medicines?.map((medicine: Medicine) => ({
                                        ...medicine
                                }))]
                            }
                        }
                    }
                })
            )),
            ...tests.map((test: any) => (
                prisma.test.create({
                    data: {
                        ...test,
                        images: {
                            createMany: {
                                data: [...test.images?.map((image: Image) => ({
                                    ...image
                                }))]
                            }
                        }
                    }
                })
            ))            
            // tests?.map(async (test : any) => {
            //     await prisma.test.create({
            //         data: {
            //             ...test,
            //             images: {
            //                 create : test.images?.map((image: any) => ({
            //                     ...image
            //                 }))
            //             }
    
            //         }
            //     })
            // }),
            // prisma.test.createMany({
            //     data: [...tests.map((test : Test) => ({
            //         ...test
            //     }))]
            // }),
            // prisma.treatment.createMany({
            //     data:[ ...treatments?.map((treatment: Treatment) => ({
            //         ...treatment
            //     }))],
            // }),
            // prisma.image.createMany({
            //     data: [ ...images?.map((image: any) => ({
            //         ...image,
            //     }))]
            // }),
            // prisma.medicine.createMany({
            //     data: [ ...medicines?.map((medicine: any) => ({
            //         ...medicine
            //     }))]
            // })
            // treatments?.map(async (treatment : any) => {
            //     await prisma.treatment.create({
            //         data: {
            //             ...treatment,
            //             medicines : {
            //                 create : treatment.medicines?.map((medicine: any) => ({
            //                     ...medicine
            //                 }))
            //             }
    
            //         }
            //     })
            // })
    ])
    } catch (error) {
        throw error;
    }
}

const updateMRService = async (tests: any[], treatments: any[] ) => {
    try {   
        prisma.$transaction([
            ...treatments.map((treatment: any) => (
                prisma.treatment.create({
                    data: {
                        ...treatment,
                        medicines: {
                            createMany: {
                                data:  [ ...treatment.medicines?.map((medicine: Medicine) => ({
                                        ...medicine
                                }))]
                            }
                        }
                    }
                })
            )),
            ...tests.map((test: any) => (
                prisma.test.create({
                    data: {
                        ...test,
                        images: {
                            createMany: {
                                data: [...test.images?.map((image: Image) => ({
                                    ...image
                                }))]
                            }
                        }
                    }
                })
            ))
        ])
    } catch (error) {
        console.log(error)
        throw error;
    }
}

// const allowEditingService = async (MRId: string,doctorId: string) => {
//     try {
//         const allowEditing = await prisma.medicalRecord.findMany({
//             where: {
//                 AND : {
//                     MRId: MRId,
//                     status: 'CREATING',
//                     doctorId: doctorId
//                 }
//             }
//         }) 
//         if(allowEditing.length >0){
//             return true
//         }
//         return false;
//     } catch (error) {
//         throw error;
//     }
// }

const completedMRService = async (mr: MedicalRecord) => {
    try {
            await prisma.medicalRecord.update({
                data: {
                    status: 'COMPLETED',
                    patientCondition : mr.patientCondition,
                    finishTime: mr.finishTime
                },
                where: {
                    MRId: mr.MRId
                }
            })

    } catch (error) {
        throw error;
    }
}

const getDetailMRService = async (MRId : string) => {
    try {
        const medicalRecord = await prisma.medicalRecord.findUnique({
            where: {
                MRId: MRId
            }
        })

        const tests = await prisma.test.findMany({
            where: {
                MRId: MRId
            },
            select: {
                createTime: true,
                typeTest: true,
                resultTest: true,
                images: {
                    select: {
                        value: true,
                    },
                    orderBy: {
                        imageId: "asc"
                    }
                },
                MRId: true,
            },
            orderBy: {
                testId: "asc"
            }
        })

        const treatments = await prisma.treatment.findMany({
            where: {
                MRId: MRId
            },
            select: {
                diseaseProgression: true,
                treatmentTime: true,
                treatmentOutStart: true,
                treatmentOutEnd: true,
                medicines: {
                    select: {
                        medicineName: true,
                        drugDosage: true,
                        drugFrequency: true,
                        totalDay: true,
                        specify: true
                    },
                    orderBy: {
                        medicineId: 'asc'
                    }
                },
                MRId: true,
            },
            orderBy: {
                treatmentId: 'asc'
            }
        })

        return {
            medicalRecord, 
            tests,
            treatments
        }
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

export const testMR = async () => {
    try {
        await grpcConnectionOrg1;
    } catch (error) {
        throw error;
    }
}

export const medicalRecordServices = {
    createMRService,
    updateMRService,
    completedMRService,
    getDetailMRService
}

