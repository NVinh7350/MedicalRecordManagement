
import { PrismaClient, User, Patient, Doctor } from '@prisma/client'

const prisma = new PrismaClient()

export const createDoctorService = async (user: User, doctor: Doctor) => {
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

export const getDoctorListService =async (page: number) => {
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

export const updateDoctorInfoService = async (user: User, doctor: Doctor) => {
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
