import { PrismaClient, User, Patient, Doctor } from '@prisma/client'

const prisma = new PrismaClient()

const createUserService = async (user: User) => {
    try {
        await prisma.user.create({
                data : user
            })
    } catch (error) {
        if(error instanceof Error) {
            throw error;
        }
    }
}


const getX509IdentityService = async (citizenIds:string) => {
    try {
        const result = await prisma.user.findUnique({
            where: {
                citizenId : citizenIds
            }
        })
        if(result?.x509Identity)
            return JSON.parse(result.x509Identity);
        else {
            throw new Error('X509Identity is empty');
        }
    } catch (error) {
        throw error;
    }
}

const insertX509IdentityService = async (citizenId: string, x509Identity : string) => {
    try {
        await prisma.user.update({
            data: {
                x509Identity : x509Identity
            },
            where: {
                citizenId: citizenId
            }
        })
        return true;
    } catch (error) {
        throw error;
    }
}

const deleteX509IdentityService = async (citizenIds:string) => {
    try {
        await prisma.user.delete({
            where: {
                citizenId : citizenIds
            }
        })
        return true;
    } catch (error) {
        throw error;
    }
}

const createPatientService = async (user: User, patient: Patient) => {
    try {
        await prisma.$transaction([
            prisma.user.create({
                data : user,
            }),
            prisma.patient.create({
                data : {
                    citizenId: user.citizenId,
                    HICNumber: patient.HICNumber,
                    guardianAddress: patient.guardianAddress,
                    guardianPhone: patient.guardianPhone,
                    guardianName: patient.guardianName
                }
            })
        ])
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const getPatientListService =async (page: number) => {
    try {
        const result = await prisma.patient.findMany({
            select : {
                citizenId: true,
                guardianAddress: true,
                guardianName: true,
                guardianPhone: true,
                HICNumber: true,
                user : {
                    select : {
                        fullName: true,
                        phoneNumber: true,
                        email: true,
                        address: true,
                        birthDay: true,
                        gender: true,
                        ethnicity: true,
                        role: true
                    }
                }
            }, 
            skip : (page - 1) * 10,
            take : 10
        })
        return result
    } catch (error) {
        throw error;
    }
} 

const getPatientByIdService =async (patientId : string) => {
    try {
        const result = await prisma.patient.findUnique({
            select : {
                citizenId: true,
                guardianAddress: true,
                guardianName: true,
                guardianPhone: true,
                HICNumber: true,
                user : {
                    select : {
                        fullName: true,
                        phoneNumber: true,
                        email: true,
                        address: true,
                        birthDay: true,
                        gender: true,
                        ethnicity: true,
                        role: true
                    }
                }
            }, 
            where : {
                citizenId: patientId
            }
        })
        return result
    } catch (error) {
        throw error;
    }
} 

const updatePatientInfoService = async (user: User, patient: Patient) => {
    try {
        await prisma.$transaction([
            prisma.user.update({
                data: {
                    ...user,
                    role: undefined
                },
                where: {
                    citizenId: user.citizenId
                }
            }),
            prisma.patient.update({
                data : patient,

                where: {
                    citizenId: user.citizenId
                }
            })
        ])
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const createDoctorService = async (user: User, doctor: Doctor) => {
    try {
        await prisma.$transaction([
            prisma.user.create({
                data : user,
            }),
            prisma.doctor.create({
                data : {
                    citizenId: user.citizenId,
                    hospital: doctor.hospital,
                    position: doctor.position,
                    specialty: doctor.specialty
                }
            })
        ])
    } catch (error) {
        console.log(error)
        throw error;
    }
}

const getDoctorListService =async (page: number) => {
    try {
        const result = await prisma.doctor.findMany({
            select : {
                hospital: true,
                citizenId: true,
                position: true,
                specialty: true,
                user : {
                    select : {
                        fullName: true,
                        phoneNumber: true,
                        email: true,
                        address: true,
                        birthDay: true,
                        gender: true,
                        ethnicity: true,
                        role: true
                    }
                }
            }, 
            skip : (page - 1) * 10,
            take : 10
        })
        return result
    } catch (error) {
        return error;
    }
} 

const getDoctorByIdService =async (doctorId: string) => {
    try {
        const result = await prisma.doctor.findUnique({
            select : {
                hospital: true,
                citizenId: true,
                position: true,
                specialty: true,
                user : {
                    select : {
                        fullName: true,
                        phoneNumber: true,
                        email: true,
                        address: true,
                        birthDay: true,
                        gender: true,
                        ethnicity: true,
                        role: true
                    }
                }
            }, 
            where : {
                citizenId: doctorId
            }
        })
        return result
    } catch (error) {
        return error;
    }
} 

const updateDoctorInfoService = async (user: User, doctor: Doctor) => {
    try {
        await prisma.$transaction([
            prisma.user.update({
                data: {
                    ...user,
                    role: undefined
                },
                where: {
                    citizenId: user.citizenId
                }
            }),
            prisma.doctor.update({
                data : doctor,
                where: {
                    citizenId: user.citizenId
                }
            })
        ])
    } catch (error) {
        console.log(error)
        throw error;
    }
}

export const userServices = {
    createDoctorService,
    createPatientService,
    createUserService,
    deleteX509IdentityService,
    getDoctorByIdService,
    getDoctorListService,
    getPatientByIdService,
    getPatientListService,
    getX509IdentityService,
    insertX509IdentityService,
    updateDoctorInfoService,
    updatePatientInfoService,


}