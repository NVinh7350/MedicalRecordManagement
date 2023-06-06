/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import FabricCAServices from 'fabric-ca-client';
import { IdentityProviderRegistry, Wallet, Wallets } from 'fabric-network';
import { getIdentity, insertIdentity } from './App';

const adminUserId = 'admin';
const adminUserPasswd = 'adminpw';

/**
 *
 * @param {*} ccp
 */
const buildCAClient = (ccp: Record<string, any>, caHostName: string): FabricCAServices => {
    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities[caHostName]; // lookup CA details from config
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const caClient = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

    console.log(`Built a CA Client named ${caInfo.caName}`);
    return caClient;
};

const enrollAdmin = async (caClient: FabricCAServices, orgMspId: string, userId: string , userPW: string): Promise<void> => {
    try {
        // Check to see if we've already enrolled the admin user.
        // const identity = await wallet.get(adminUserId);
        const identity = await getIdentity(userId);
        if (identity) {
            // console.log(identityDB.x509Identity);
            // console.log(identity)
            // console.log(JSON.stringify(identity) === JSON.stringify(identityDB.x509Identity));
            console.log('An identity for the admin user already exists in the wallet');
            return;
        }
        

        // Enroll the admin user, and import the new identity into the wallet.
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
        // await wallet.put(userId, x509Identity).then((data) => console.log('NEW')).catch(err => console.log(err));
        await insertIdentity(userId, x509Identity);
        console.log('Successfully enrolled admin user and imported it into the wallet');
    } catch (error) {
        console.error(`Failed to enroll admin user : ${error}`);
    }
};

const registerAndEnrollUser = async (caClient: FabricCAServices, orgMspId: string, userId: string, affiliation: string): Promise<void> => {
    try {
        // Check to see if we've already enrolled the user
        // const userIdentity = await wallet.get(userId);
        const userIdentity = await getIdentity(userId);
        if (userIdentity) {
            // console.log(userIdentityDB);
            // console.log(JSON.stringify(userIdentity) === JSON.stringify(userIdentityDB.x509Identity));
            console.log(`An identity for the user ${userId} already exists in the wallet`);
            return;
        }

        // Must use an admin to register a new user
        // const adminIdentity = await wallet.get(adminUserId);
        const adminIdentity = await getIdentity(adminUserId);
        if (!adminIdentity) {
            // console.log(adminIdentityDB);
            // console.log(JSON.stringify(adminIdentity) === JSON.stringify(adminIdentityDB.x509Identity));
            console.log('An identity for the admin user does not exist in the wallet');
            console.log('Enroll the admin user before retrying');
            return;
        }

        // build a user object for authenticating with the CA
        // const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        // const adminUser = await provider.getUserContext(adminIdentity, adminUserId);
        const provider = (await Wallets.newInMemoryWallet()).getProviderRegistry().getProvider(adminIdentity?.x509Identity?.type);
        const adminUser = await provider.getUserContext(adminIdentity?.x509Identity, adminUserId);
        // Register the user, enroll the user, and import the new identity into the wallet.
        // if affiliation is specified by client, the affiliation value must be configured in CA
        
        const secret = await caClient.register({
            affiliation,
            enrollmentID: userId,
            role: 'client',
            attrs: [{
                name: 'userId',
                value: userId,
                ecert: true
            },{
                name: 'userRole',
                value: 'DOCTOR',
                ecert: true
            }
            ]
        }, adminUser);
        const enrollment = await caClient.enroll({
            enrollmentID: userId,
            enrollmentSecret: secret,
        });
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
                rootCert: enrollment.rootCertificate
            },
            mspId: orgMspId,
            type: 'X.509',
        };
        // await wallet.put(userId, x509Identity);
        await insertIdentity(userId, x509Identity);
        console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
    } catch (error) {
        console.error(`Failed to register user : ${error}`);
    }
};

export {
    buildCAClient,
    enrollAdmin,
    registerAndEnrollUser,
};
