import { PrismaClient, User, Patient, Doctor } from '@prisma/client'
import { error } from 'console';

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
                user : {
                    select : {
                        fullName: true,
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

const getRequestedListService = async (doctorId : string ,page: number) => {
    try{
        const result = await prisma.doctor.findMany({
            select: {
                accessRequestList: {
                    select: {
                        patient: {  
                            select: {
                                citizenId: true,
                                user: {
                                    select: {
                                        fullName: true,
                                        birthDay: true,
                                        address: true,
                                        gender: true
                                    }
                                }
                            }
                        },
                        requestTime: true,
                        status: true,
                        updateTime: true
                    }
                }
            },
            where: {
                citizenId: doctorId
            },
            skip : (page - 1) * 10,
            take : 10
        })
        return result;
    } catch (error) {
        throw error
    }
}

const getAuthorizedAccessListService = async (doctorId : string ,page: number) => {
    try{
        const result = await prisma.doctor.findMany({
            select: {
                accessList: {
                    select: {
                        patient: {
                            select: {
                                citizenId: true,
                                user: {
                                    select: {
                                        fullName: true,
                                        address: true,
                                        birthDay: true,
                                        email: true,
                                    }
                                }
                            }
                        },
                        requestTime: true,
                    }
                }
            },
            where: {
                citizenId: doctorId
            },
            skip : (page - 1) * 10,
            take : 10 
        })
        return result;
    } catch (error) {
        throw error
    }
}

const getPatientByIdService =async (patientId : string, doctorId: string) => {
    try {
        let access = await prisma.patient.findMany({
            where: {
                accessList : {
                    some : {
                        doctorId : doctorId
                    }
                }
            }
        })
        if(access.length > 0) {
            return await prisma.patient.findMany({
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
                        }
                    },
                    MROwned: {
                        select: {
                            MRId: true,
                            comeTime: true,
                            status: true,
                            finishTime: true,
                            creator: {
                                select : {
                                    user: {
                                        select: {
                                            fullName:true
                                        }
                                    },
                                    position: true,
                                    specialty: true,
                                    hospital: true                        
                                }    
                            }
                        }
                    }
                }, 
                where : {
                    citizenId: patientId,
                    accessList: {
                        some: {
                            doctorId : doctorId
                        }
                    }
                }
            })
        } else {
            return await prisma.patient.findUnique({
                select: {
                    citizenId: true,
                    user: {
                        select: {
                            fullName : true,
                            birthDay : true,
                            address : true,
                            gender : true
                        }
                    }
                },
                where: {
                    citizenId : patientId
                }
            })
        }
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

const getRequestDoctorListService = async (patientId : string ,page: number) => {
    try{
        const result = await prisma.patient.findMany({
            select: {
                accessRequestList: {
                    select: {
                        doctor: {
                            select: {
                                citizenId: true,
                                hospital: true,
                                position: true,
                                specialty: true,
                                user: {
                                    select: {
                                        fullName: true,
                                        birthDay: true,
                                        address: true,
                                        email: true,
                                        gender: true,
                                        phoneNumber: true
                                    }
                                }
                            }
                        },
                        requestTime: true,
                        status: true,
                        updateTime: true
                    }
                }
            },
            where: {
                citizenId: patientId
            },
            skip : (page - 1) * 10,
            take : 10
        })
        return result;
    } catch (error) {
        throw error
    }
}

const getAccessibleDoctorListService = async (patientId : string ,page: number) => {
    try{
        const result = await prisma.patient.findMany({
            select: {
                accessList: {
                    select: {
                        doctor: {
                            select: {
                                citizenId: true,
                                hospital: true,
                                position: true,
                                specialty: true,
                                user: {
                                    select: {
                                        fullName: true,
                                        birthDay: true,
                                        address: true,
                                        email: true,
                                        gender: true,
                                        phoneNumber: true
                                    }
                                }
                            }
                        },
                        requestTime: true
                    }
                }
            },
            where: {
                citizenId: patientId
            },
            skip : (page - 1) * 10,
            take : 10
        })
        return result;
    } catch (error) {
        throw error
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

const requestAccessService = async (doctorId: string, patientId: string) => {
    try {
        const check = await checkAccess(doctorId, patientId)
        if(!check) {
            await prisma.accessRequest.create({
                data: {
                    status: 'PENDING',
                    doctorId: doctorId,
                    patientId: patientId
                }
            })
        } else {
            throw new Error(`Ban da co quyen truy cap voi benh nhan ${patientId}`)
        }
    } catch (error) {
        throw error;
    }
}

const refuseRequestService = async (doctorId: string, patientId: string) => {
    try {
        await prisma.accessRequest.delete({
            where: {
                doctorId_patientId: {
                    doctorId: doctorId,
                    patientId: patientId
                }
            }
        })
    } catch (error) {
        throw error;
    }
}

const acceptRequestService = async (doctorId: string, patientId: string) => {
    try {
        await prisma.access.create({
            data: {
                doctorId: doctorId,
                patientId: patientId
            }
        })
        await prisma.accessRequest.delete({
            where: {
                doctorId_patientId: {
                    doctorId: doctorId,
                    patientId: patientId
                }
            }
        })
    } catch (error) {
        throw error;
    }
}

const revokeAccessService = async (doctorId: string, patientId: string) => {
    try {
        const checkCreator = await prisma.medicalRecord.findMany({
            where: {
                AND: {
                    doctorId : doctorId,
                    patientId: patientId,
                    status: 'CREATING'
                }
            }
        })
        if(checkCreator.length >0) {
            throw new Error('Bac si dang tao benh an khong the thu hoi quyen truy cap')
        } else {
            await prisma.access.delete({
                where: {
                    doctorId_patientId: {
                        doctorId: doctorId,
                        patientId: patientId
                    }
                }
            })
        }
    } catch (error) {
        throw error;
    }
}

const checkAccess =async (doctorId: string, patientId: string) => {
    try {
        const check = await prisma.access.findUnique({
            where: {
                doctorId_patientId : {
                    doctorId: doctorId,
                    patientId: patientId
                }
            }
        })
        return check;
    } catch (error) {
        throw error
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
    getAccessibleDoctorListService,
    acceptRequestService,
    revokeAccessService,
    refuseRequestService,
    requestAccessService,
    getRequestDoctorListService,
    getAuthorizedAccessListService,
    getRequestedListService,
    checkAccess
}