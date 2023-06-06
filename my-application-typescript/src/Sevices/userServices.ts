import { PrismaClient, User, Patient } from '@prisma/client'

const prisma = new PrismaClient()

export const createUserService = async (user: User) => {
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


export const getX509IdentityService = async (citizenIds:string) => {
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

export const insertX509IdentityService = async (citizenId: string, x509Identity : string) => {
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
        return error;
    }
}

export const deleteX509IdentityService = async (citizenIds:string) => {
    try {
        await prisma.user.delete({
            where: {
                citizenId : citizenIds
            }
        })
        return true;
    } catch (error) {
        return error;
    }
}
