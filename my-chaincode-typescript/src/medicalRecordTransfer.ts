/*
 * SPDX-License-Identifier: Apache-2.0
 */
// Deterministic JSON.stringify()
import {Context, Contract, Info, Returns, Transaction} from "fabric-contract-api";
import stringify from "json-stringify-deterministic";
import sortKeysRecursive from "sort-keys-recursive";
import {MedicalRecord} from "./medicalRecord";

@Info({title: "MedicalRecordTransfer", description: "Smart contract for trading assets"})
export class MedicalRecordTransferContract extends Contract {

    @Transaction()
    public async InitLedger(ctx: Context): Promise<void> {
        const medicalRecords: MedicalRecord[] = [
            {
                "idMedicalRecord": "init medical record",
                "viewDoctorList": ["init medical record"],
                "doctorCreator": "init medical record",
                "owner": "init medical record",
                "medicalRecordHashData": "init medical record",
                "medicalRecordStatus": "COMPLETED",
                "medicalRecordTime": ctx.stub.getTxTimestamp().nanos
            },
        ];

        for (const medicalRecord of medicalRecords) {
            // asset.docType = "asset";
            // example of how to write to world state deterministically
            // use convetion of alphabetic order
            // we insert data in alphabetic order using "json-stringify-deterministic" and "sort-keys-recursive"
            // when retrieving data, in any lang, the order of data will be the same and consequently also the corresonding hash
            await ctx.stub.putState(medicalRecord.idMedicalRecord, Buffer.from(stringify(sortKeysRecursive(medicalRecord))));
            console.info(`medicalRecord ${medicalRecord.idMedicalRecord} initialized`);
        }
    }

    // CreateAsset issues a new asset to the world state with given details.
    @Transaction()
    public async CreateMedicalRecord(ctx: Context, idMedicalRecord: string, owner: string, medicalRecordHashData: string ): Promise<string> {
        const clientIdentity = ctx.clientIdentity.getAttributeValue("userId");
        const clientRole = ctx.clientIdentity.getAttributeValue("userRole");

        if(clientRole !== "DOCTOR") {
            throw new Error(`The creator is not a DOCTOR`);
        }
        
        const exists = await this.AssetExists(ctx, idMedicalRecord);
        if (exists) {
            throw new Error(`The medical record ${idMedicalRecord} already exists`);
        }

        const medicalRecord = {
            idMedicalRecord: idMedicalRecord,
            viewDoctorList: [clientIdentity],
            doctorCreator: clientIdentity,
            owner: owner,
            medicalRecordHashData: medicalRecordHashData,
            medicalRecordStatus: "CREATING"
        };
        // we insert data in alphabetic order using "json-stringify-deterministic" and "sort-keys-recursive"
        await ctx.stub.putState(idMedicalRecord, Buffer.from(stringify(sortKeysRecursive(medicalRecord))));

        return `clientIdentity: ${clientIdentity}, clientRole: ${clientRole}, medicalRecord: ${JSON.stringify(medicalRecord)}
        ,doctorList: ${ typeof medicalRecord.viewDoctorList}
        ${ medicalRecord.viewDoctorList}
        `;
    }

    // ReadAsset returns the asset stored in the world state with given id.
    @Transaction(false)
    public async ReadMedicalRecords(ctx: Context, idMedicalRecord: string): Promise<string> {

        const clientIdentity = ctx.clientIdentity.getAttributeValue("userId");
        const clientRole = ctx.clientIdentity.getAttributeValue("userRole");

        const medicalRecordJSON = await ctx.stub.getState(idMedicalRecord); // get the asset from chaincode state
        if (!medicalRecordJSON || medicalRecordJSON.length === 0) {
            throw new Error(`The medical record ${idMedicalRecord} already exists`);
        }
        const medicalRecordObj = JSON.parse(medicalRecordJSON.toString());

        const checkOwner = medicalRecordObj.owner === clientIdentity;
        
        const checkReadList = medicalRecordObj.viewDoctorList.includes(clientIdentity);

        if(!checkOwner && !checkReadList) {
            throw new Error(`You do not have access the asset ${idMedicalRecord}`);
        }

        // return `clientIdentity: ${clientIdentity}, medicalRecordJSON: ${medicalRecordJSON.toString()}, 
        // medicalRecordJSON: ${medicalRecordJSON}, 
        // medicalRecordObj: ${JSON.stringify(medicalRecordObj)}
        // checkOwner: ${checkOwner}
        // checkReadList: ${checkReadList}
        // `;
        return JSON.stringify(medicalRecordJSON.toString());
    }

    // UpdateAsset updates an existing asset in the world state with provided parameters.
    @Transaction()
    public async UpdateMedicalRecord(ctx: Context, idMedicalRecord: string, newMedicalRecordHashData: string): Promise<string> {
        const clientIdentity = ctx.clientIdentity.getAttributeValue("userId");
        
        const medicalRecordJSON = await ctx.stub.getState(idMedicalRecord); // get the asset from chaincode state
        if (!medicalRecordJSON || medicalRecordJSON.length === 0) {
            throw new Error(`The medical record ${idMedicalRecord} already exists`);
        }
        const medicalRecordObj = JSON.parse(medicalRecordJSON.toString());

        if(medicalRecordObj.medicalRecordStatus === "COMPLETED"|| medicalRecordObj.doctorCreator !== clientIdentity) {
            throw new Error(`The medical record ${idMedicalRecord} cannot be updated at the moment`);
        }

        // overwriting original asset with new asset
        const updateMedicalRecord = {
            ...medicalRecordObj,
            medicalRecordHashData: newMedicalRecordHashData,
        };
        // we insert data in alphabetic order using "json-stringify-deterministic" and "sort-keys-recursive"
        await ctx.stub.putState(idMedicalRecord, Buffer.from(stringify(sortKeysRecursive(updateMedicalRecord))));
        return `clientIdentity: ${clientIdentity}, medicalRecordJSON: ${medicalRecordJSON.toString()}, 
        medicalRecordObj: ${JSON.stringify(medicalRecordObj)}
        `;
    }

    // DeleteAsset deletes an given asset from the world state.
    @Transaction()
    public async DeleteAsset(ctx: Context, id: string): Promise<void> {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return ctx.stub.deleteState(id);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    @Transaction(false)
    @Returns("boolean")
    public async AssetExists(ctx: Context, id: string): Promise<boolean> {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

    // TransferAsset updates the owner field of asset with given id in the world state, and returns the old owner.
    @Transaction()
    public async finishMedicalRecord(ctx: Context, idMedicalRecord: string): Promise<string> {
        const clientIdentity = ctx.clientIdentity.getAttributeValue("userId");
        
        const medicalRecordJSON = await ctx.stub.getState(idMedicalRecord); // get the asset from chaincode state
        if (!medicalRecordJSON || medicalRecordJSON.length === 0) {
            throw new Error(`The medical record ${idMedicalRecord} already exists`);
        }
        const medicalRecordObj = JSON.parse(medicalRecordJSON.toString());

        if(medicalRecordObj.medicalRecordStatus === "COMPLETED"|| medicalRecordObj.doctorCreator !== clientIdentity) {
            throw new Error(`The medical record ${idMedicalRecord} cannot be finished at the moment`);
        }

        const updateMedicalRecord = {
            ...medicalRecordObj,
            medicalRecordStatus: "COMPLETED"
        };
        // we insert data in alphabetic order using "json-stringify-deterministic" and "sort-keys-recursive"
        await ctx.stub.putState(idMedicalRecord, Buffer.from(stringify(sortKeysRecursive(updateMedicalRecord))));
        return `clientIdentity: ${clientIdentity}, medicalRecordJSON: ${medicalRecordJSON.toString()}, 
        medicalRecordJSON: ${medicalRecordJSON}, 
        medicalRecordObj: ${JSON.stringify(medicalRecordObj)}
        medicalRecordObj.medicalRecordStatus: ${medicalRecordObj.medicalRecordStatus}
        medicalRecordObj.doctorCreator: ${medicalRecordObj.doctorCreator}
        updateMedicalRecord: ${updateMedicalRecord}
        `;
    }

    // TransferAsset updates the owner field of asset with given id in the world state, and returns the old owner.
    @Transaction()
    public async GrantAccess(ctx: Context, idMedicalRecord: string, doctorId: string): Promise<string> {
        const clientIdentity = ctx.clientIdentity.getAttributeValue("userId");
        
        const medicalRecordJSON = await ctx.stub.getState(idMedicalRecord); // get the asset from chaincode state
        if (!medicalRecordJSON || medicalRecordJSON.length === 0) {
            throw new Error(`The medical record ${idMedicalRecord} already exists`);
        }
        const medicalRecordObj = JSON.parse(medicalRecordJSON.toString());
        
        if(medicalRecordObj.owner !== clientIdentity) {
            throw new Error(`You do not have access the asset ${idMedicalRecord}`);
        }
        let newViewDoctorList = medicalRecordObj.viewDoctorList;
        if(medicalRecordObj.viewDoctorList.includes(doctorId)) {
           throw new Error(`This doctor is on the list of allowed medical records`); 
        }
        medicalRecordObj.viewDoctorList.push(doctorId);
        const updateMedicalRecord = {
            ...medicalRecordObj,
            viewDoctorList: newViewDoctorList,
        };
        // we insert data in alphabetic order using "json-stringify-deterministic" and "sort-keys-recursive"
        await ctx.stub.putState(idMedicalRecord, Buffer.from(stringify(sortKeysRecursive(updateMedicalRecord))));
        return `clientIdentity: ${clientIdentity}, medicalRecordJSON: ${medicalRecordJSON.toString()}, 
        medicalRecordJSON: ${medicalRecordJSON}, 
        medicalRecordObj: ${JSON.stringify(medicalRecordObj)}
        medicalRecordObj.medicalRecordStatus: ${medicalRecordObj.medicalRecordStatus}
        medicalRecordObj.viewDoctorList.includes(doctorId): ${medicalRecordObj.viewDoctorList.includes(doctorId)}
        newViewDoctorList: ${newViewDoctorList}
        updateMedicalRecord: ${updateMedicalRecord}
        `;
    }

    @Transaction()
    public async RevokeAccess(ctx: Context, idMedicalRecord: string, doctorId: string): Promise<string> {
        const clientIdentity = ctx.clientIdentity.getAttributeValue("userId");
        
        const medicalRecordJSON = await ctx.stub.getState(idMedicalRecord); // get the asset from chaincode state
        if (!medicalRecordJSON || medicalRecordJSON.length === 0) {
            throw new Error(`The medical record ${idMedicalRecord} already exists`);
        }
        const medicalRecordObj = JSON.parse(medicalRecordJSON.toString());
        
        if(medicalRecordObj.owner !== clientIdentity) {
            throw new Error(`You do not have access the asset ${idMedicalRecord}`);
        }

        if(medicalRecordObj.medicalRecordStatus === "CREATING" && medicalRecordObj.doctorCreator === doctorId){
            throw new Error(`You cannot revoke the medical record access of the doctor
             who initiated the case when the medical record is incomplete`)
        }

        if(!medicalRecordObj.viewDoctorList.includes(doctorId)){
            throw new Error(`This doctor is not currently on the list of authorized medical records`)
        }

        let newViewDoctorList = medicalRecordObj.viewDoctorList.filter(item => item !== doctorId);
        
        const updateMedicalRecord = {
            ...medicalRecordObj,
            viewDoctorList: newViewDoctorList,
        };
        // we insert data in alphabetic order using "json-stringify-deterministic" and "sort-keys-recursive"
        await ctx.stub.putState(idMedicalRecord, Buffer.from(stringify(sortKeysRecursive(updateMedicalRecord))));

        return `clientIdentity: ${clientIdentity}, medicalRecordJSON: ${medicalRecordJSON.toString()}, 
        medicalRecordJSON: ${medicalRecordJSON}, 
        medicalRecordObj: ${JSON.stringify(medicalRecordObj)}
        medicalRecordObj.medicalRecordStatus: ${medicalRecordObj.medicalRecordStatus}
        medicalRecordObj.viewDoctorList.includes(doctorId): ${medicalRecordObj.viewDoctorList.includes(doctorId)}
        newViewDoctorList: ${newViewDoctorList}
        updateMedicalRecord: ${updateMedicalRecord}
        `;
    }

    @Transaction(false)
    public async ReadMedicalRecord(ctx: Context, idMedicalRecord: string): Promise<string> {


        const medicalRecordJSON = await ctx.stub.getState(idMedicalRecord); // get the asset from chaincode state
        if (!medicalRecordJSON || medicalRecordJSON.length === 0) {
            throw new Error(`The medical record ${idMedicalRecord} already exists`);
        }
        // const medicalRecordObj = JSON.parse(medicalRecordJSON.toString());

        // return `clientIdentity: ${clientIdentity}, medicalRecordJSON: ${medicalRecordJSON.toString()}, 
        // medicalRecordJSON: ${medicalRecordJSON}, 
        // medicalRecordObj: ${JSON.stringify(medicalRecordObj)}
        // checkOwner: ${checkOwner}
        // checkReadList: ${checkReadList}
        // `;
        return JSON.stringify(medicalRecordJSON.toString());
    }

    // GetAllAssets returns all assets found in the world state.
    // @Transaction(false)
    // @Returns("string")
    // public async GetAllAssets(ctx: Context): Promise<string> {
    //     const allResults = [];
    //     // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
    //     const iterator = await ctx.stub.getStateByRange("", "");
    //     let result = await iterator.next();
    //     while (!result.done) {
    //         const strValue = Buffer.from(result.value.value.toString()).toString("utf8");
    //         let record;
    //         try {
    //             record = JSON.parse(strValue);
    //         } catch (err) {
    //             console.log(err);
    //             record = strValue;
    //         }
    //         allResults.push(record);
    //         result = await iterator.next();
    //     }
    //     return JSON.stringify(allResults);
    // }

}
