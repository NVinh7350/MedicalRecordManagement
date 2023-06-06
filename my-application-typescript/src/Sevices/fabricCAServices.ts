/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import FabricCAServices from 'fabric-ca-client';
import { Wallets } from 'fabric-network';
import { buildCCPOrg1, buildCCPOrg2 } from '../Utils/fabricCaUtils';
// import { PrismaClient, User, Patient } from '@prisma/client'

// const prisma = new PrismaClient()

// const adminUserId = 'admin';
// const adminUserPasswd = 'adminpw';

/**
 *
 * @param {*} ccp
 */
export const buildCAClient =async (organization:string) => {
    try {
        const caHostName = organization !== 'ORG1' ? 'ca.org1.example.com': 'ca.org2.example.com';
        const mspOrg = organization !== 'ORG1' ? 'Org1MSP' : 'Org2MSP';
        const ccp =  organization !== 'ORG1' ? buildCCPOrg1() : buildCCPOrg2();
        const affiliation = organization !== 'ORG1' ? 'org1.department1' : 'org2.department1';

        const caInfo = ccp.certificateAuthorities[caHostName]; // lookup CA details from config
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        return {
            mspOrg: mspOrg,
            caClient: caClient,
            affiliation: affiliation
        }
    } catch (error) {
        throw error;
    }
}

export const enrollIdentity = async (caClient: FabricCAServices, orgMspId: string, userId: string , userPW: string): Promise<any> => {
    try {
        const enrollment = await caClient.enroll({ enrollmentID: userId, enrollmentSecret: userPW });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
                rootCert: enrollment.rootCertificate
            },
            mspId: orgMspId,
            type: 'X.509',
        };
        return x509Identity;
    } catch (err) { 
        if(err instanceof Error) {
            throw err;
        }
    }
}

export const changeSecret = async (caClient: FabricCAServices,x509Identity: any, orgMspId: string, userId: string , userPW: string, newPW: string) => {
    try {
        const provider = (await Wallets.newInMemoryWallet()).getProviderRegistry().getProvider(x509Identity?.type);
        const user = await provider.getUserContext(x509Identity, userId);
        await caClient.newIdentityService().update(userId,{enrollmentSecret: newPW, affiliation: user.getAffiliation(),enrollmentID: userId}, user );
        const enrollment = await caClient.enroll({ enrollmentID: userId, enrollmentSecret: newPW });
        const newX509Identity = {
        credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
            rootCert: enrollment.rootCertificate
        },
        mspId: orgMspId,
        type: 'X.509',
        };
        return newX509Identity;
    } catch (error) {
        throw error;
    }
}

export const registerIdentity = async (caClient: FabricCAServices, adminX509Identity: any, orgMspId: string,adminId:string,  userId: string, role: string ,affiliation: string) => {
    try {
        const provider = (await Wallets.newInMemoryWallet()).getProviderRegistry().getProvider(adminX509Identity?.type);
        const adminUser = await provider.getUserContext(adminX509Identity, adminId);
        
        const secret = await caClient.register({
            affiliation,
            enrollmentID: userId,
            enrollmentSecret: userId,
            role: 'client',
            maxEnrollments: -1,
            attrs: [
                {
                name: 'hf.Registrar.Roles',
                value: 'client',
                ecert: true
            },
            {
                name: 'userRole',
                value: role,
                ecert: true
            },
            {
                name: 'hf.Revoker',
                value: 'true',
                ecert: true
            },
            {
                name: 'caname',
                value: caClient.getCaName(),
                ecert: true
            },
            ]
        }, adminUser);
        // const enrollment = await caClient.enroll({
        //     enrollmentID: userId,
        //     enrollmentSecret: userId,
        // });
        // const x509Identity = {
        //     credentials: {
        //         certificate: enrollment.certificate,
        //         privateKey: enrollment.key.toBytes(),
        //         rootCert: enrollment.rootCertificate
        //     },
        //     mspId: orgMspId,
        //     type: 'X.509',
        // };
        // return x509Identity;
    } catch (error) {
        console.error(`Failed to register user : ${error}`);
    }
}
// const updateAdmin = async (caClient: FabricCAServices, orgMspId: string, userId: string , userPW: string, newPW: string) => {
//     try {
//         const adminIdentity = await getIdentity(userId);
//         if (!adminIdentity) {
//             console.log('An identity for the admin user no exists in the wallet');
//             return;
//         }
//         const provider = (await Wallets.newInMemoryWallet()).getProviderRegistry().getProvider(adminIdentity?.x509Identity?.type);
//         const adminUser = await provider.getUserContext(adminIdentity?.x509Identity, userId);
//         caClient.newIdentityService().update(userId,{enrollmentSecret: newPW, affiliation: adminUser.getAffiliation(),enrollmentID: userId}, adminUser );
//         const enrollment = await caClient.enroll({ enrollmentID: userId, enrollmentSecret: userPW });
//         const x509Identity = {
//         credentials: {
//             certificate: enrollment.certificate,
//             privateKey: enrollment.key.toBytes(),
//             rootCert: enrollment.rootCertificate
//         },
//         mspId: orgMspId,
//         type: 'X.509',
//         };
//         await insertIdentity(userId, x509Identity);
//     } catch (error) {
//         console.log(error);
//     }
// }

// const enrollAdmin = async (caClient: FabricCAServices, orgMspId: string, userId: string , userPW: string): Promise<void> => {
//     try {
//         // Check to see if we've already enrolled the admin user.
//         // const identity = await wallet.get(adminUserId);
//         const identity = await getIdentity(userId);
//         if (identity) {
//             // console.log(identityDB.x509Identity);
//             // console.log(identity)
//             // console.log(JSON.stringify(identity) === JSON.stringify(identityDB.x509Identity));
//             console.log('An identity for the admin user already exists in the wallet');
//             // return;
//         }
        

//         // Enroll the admin user, and import the new identity into the wallet.
//         const enrollment = await caClient.enroll({ enrollmentID: userId, enrollmentSecret: userPW });
//         const x509Identity = {
//             credentials: {
//                 certificate: enrollment.certificate,
//                 privateKey: enrollment.key.toBytes(),
//                 rootCert: enrollment.rootCertificate
//             },
//             mspId: orgMspId,
//             type: 'X.509',
//         };
//         // await wallet.put(userId, x509Identity).then((data) => console.log('NEW')).catch(err => console.log(err));
//         await insertIdentity(userId, x509Identity);
//         console.log('Successfully enrolled admin user and imported it into the wallet');
//     } catch (error) {
//         console.error(`Failed to enroll admin user : ${error}`);
//     }
// };


// const registerAndEnrollUser = async (caClient: FabricCAServices, adminX509Identity: any, orgMspId: string, userId: string, role: string ,affiliation: string): Promise<void> => {
//     try {
//         // Check to see if we've already enrolled the user
//         // const userIdentity = await wallet.get(userId);
//         const userIdentity = await getIdentity(userId);
//         if (userIdentity) {
//             // console.log(userIdentityDB);
//             // console.log(JSON.stringify(userIdentity) === JSON.stringify(userIdentityDB.x509Identity));
//             console.log(`An identity for the user ${userId} already exists in the wallet`);
//             return;
//         }

//         // Must use an admin to register a new user
//         // const adminIdentity = await wallet.get(adminUserId);
//         const adminIdentity = await getIdentity(adminUserId);
//         if (!adminIdentity) {
//             // console.log(adminIdentityDB);
//             // console.log(JSON.stringify(adminIdentity) === JSON.stringify(adminIdentityDB.x509Identity));
//             console.log('An identity for the admin user does not exist in the wallet');
//             console.log('Enroll the admin user before retrying');
//             return;
//         }

//         // build a user object for authenticating with the CA
//         // const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
//         // const adminUser = await provider.getUserContext(adminIdentity, adminUserId);
//         const provider = (await Wallets.newInMemoryWallet()).getProviderRegistry().getProvider(adminIdentity?.x509Identity?.type);
//         const adminUser = await provider.getUserContext(adminIdentity?.x509Identity, adminUserId);
//         // Register the user, enroll the user, and import the new identity into the wallet.
//         // if affiliation is specified by client, the affiliation value must be configured in CA
        
//         const secret = await caClient.register({
//             affiliation,
//             enrollmentID: userId,
//             role: 'client',
//             enrollmentSecret: userPW,
//             maxEnrollments: -1,
//             attrs: [
//                 {
//                 name: 'hf.Registrar.Roles',
//                 value: 'client',
//                 ecert: true
//             },
//             {
//                 name: 'userRole',
//                 value: 'DOCTOR',
//                 ecert: true
//             },
//             {
//                 name: 'hf.Revoker',
//                 value: 'true',
//                 ecert: true
//             },
//             {
//                 name: 'caname',
//                 value: caClient.getCaName(),
//                 ecert: true
//             },
//             ]
//         }, adminUser);
//         const enrollment = await caClient.enroll({
//             enrollmentID: userId,
//             enrollmentSecret: userPW,
//         });
//         const x509Identity = {
//             credentials: {
//                 certificate: enrollment.certificate,
//                 privateKey: enrollment.key.toBytes(),
//                 rootCert: enrollment.rootCertificate
//             },
//             mspId: orgMspId,
//             type: 'X.509',
//         };
//         // await wallet.put(userId, x509Identity);
//         await insertIdentity(userId, x509Identity);
//         console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
//     } catch (error) {
//         console.error(`Failed to register user : ${error}`);
//     }
// };


// export {
//     buildCAClient,
//     enrollAdmin,
//     registerAndEnrollUser,
//     updateAdmin
// };
