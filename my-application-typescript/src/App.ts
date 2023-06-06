// /*
//  * Copyright IBM Corp. All Rights Reserved.
//  *
//  * SPDX-License-Identifier: Apache-2.0
//  */

// import { Wallet, Wallets } from 'fabric-network';
// import * as fs from 'fs';
// import * as path from 'path';
// import sql, { ConnectionError } from 'mssql';
// import pool from './DB/connectDB';
// import {  X509Identity } from './Model/X509Identity';
// const buildCCPOrg1 = (): Record<string, any> => {
//     // load the common connection configuration file
//     const ccpPath = path.resolve(__dirname, '..', '..', '..', '..','fabric-samples' ,'test-network',
//         'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
//     const fileExists = fs.existsSync(ccpPath);
//     if (!fileExists) {
//         throw new Error(`no such file or directory: ${ccpPath}`);
//     }
//     const contents = fs.readFileSync(ccpPath, 'utf8');

//     // build a JSON object from the file contents
//     const ccp = JSON.parse(contents);

//     console.log(`Loaded the network configuration located at ${ccpPath}`);
//     return ccp;
// };

// const buildCCPOrg2 = (): Record<string, any> => {
//     // load the common connection configuration file
//     const ccpPath = path.resolve(__dirname, '..', '..', '..', '..', 'fabric-samples', 'test-network',
//         'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
//     const fileExists = fs.existsSync(ccpPath);
//     if (!fileExists) {
//         throw new Error(`no such file or directory: ${ccpPath}`);
//     }
//     const contents = fs.readFileSync(ccpPath, 'utf8');

//     // build a JSON object from the file contents
//     const ccp = JSON.parse(contents);

//     console.log(`Loaded the network configuration located at ${ccpPath}`);
//     return ccp;
// };

// const buildWallet = async (walletPath: string): Promise<Wallet> => {
//     // Create a new  wallet : Note that wallet is for managing identities.
//     let wallet: Wallet;
//     if (walletPath) {

//         // remove any pre-existing wallet from prior runs
//         // fs.rmSync(walletPath, { recursive: true, force: true });

//         wallet = await Wallets.newFileSystemWallet(walletPath);
//         console.log(`Built a file system wallet at ${walletPath}`);
//     } else {
//         wallet = await Wallets.newInMemoryWallet();
        
//         console.log('Built an in memory wallet');
//     }

//     return wallet;
// };

// const prettyJSONString = (inputString: string): string => {
//     if (inputString) {
//          return JSON.stringify(JSON.parse(inputString), null, 2);
//     } else {
//          return inputString;
//     }
// };

// const getIdentity = async (userID: string) => {
//     try {
//         const connection = await pool.connect();
//         const userWallet = (await connection.request().query(`SELECT * FROM X509IDENTITY WHERE userId = '${userID}'`)).recordset[0];    
//         if(!userWallet) {
//             return null;
//         }
//         return {
//             ...userWallet,
//             x509Identity: JSON.parse(userWallet.x509Identity)
            
//         };
//     } catch (error) {
//         return error;
//     } finally {
//         pool.close();
//     }
// }

// const insertIdentity = async (userId : string, x509Identity: Object) => {
//     try {
//         const connection = await pool.connect();
//         await connection.request()
//             .input('userId', sql.VarChar(50),userId)
//             .input('x509Identity', sql.VarChar(8000),JSON.stringify(x509Identity))
//             .query(`INSERT INTO X509IDENTITY VALUES (@userId, @x509Identity)`);
//         return true;
//     } catch (error) {
//         await updateIdentity(userId, x509Identity);
//         return null;
//     } finally {
//         pool.close();
//     }
// }

// const updateIdentity = async (userId : string, x509Identity: Object) => {
//     try {
//         const connections = await pool.connect();
//         await connections.request()
//             .input('userId', sql.VarChar(50),userId)
//             .input('x509Identity', sql.VarChar(8000),JSON.stringify(x509Identity))
//             .query(`UPDATE X509IDENTITY SET x509Identity = @x509Identity WHERE userId = @userId`);
//         return true;
//     } catch (error) {
//         return error;
//     } finally {
//         pool.close();
//     }
// }

// const deleteIdentity = async (userID: string) => {
//     try {
//         const connection = await pool.connect();
//         const userWallet = await connection.request().query(`DELETE FROM X509IDENTITY WHERE userId = '${userID}'`);      
//         return true;  
//     } catch (error) {
//         return error;
//     } finally {
//         pool.close();
//     }
// }

// const deleteAllIdentity =async () => {
//     try {
//         const connection = await pool.connect();
//         const userWallet = await connection.request().query(`DELETE FROM X509IDENTITY`);      
//         return true;  
//     } catch (error) {
//         return error;
//     } finally {
//         pool.close();
//     }
// }

// export {
//     buildCCPOrg1,
//     buildCCPOrg2,
//     buildWallet,
//     prettyJSONString,
//     insertIdentity,
//     updateIdentity,
//     getIdentity,
//     deleteIdentity,
//     deleteAllIdentity
// };
