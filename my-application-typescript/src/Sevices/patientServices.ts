import { PrismaClient, User, Patient } from '@prisma/client'

const prisma = new PrismaClient()

export const createPatientService = async (user: User, patient: Patient) => {
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
        throw error;
    }
}

export const getPatientListService =async (page: number) => {
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

export const updatePatientInfoService = async (user: User, patient: Patient) => {
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

