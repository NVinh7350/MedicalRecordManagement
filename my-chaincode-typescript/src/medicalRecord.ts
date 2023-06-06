/*
  SPDX-License-Identifier: Apache-2.0
*/

import {Object, Property} from 'fabric-contract-api';
import { Timestamp } from 'fabric-shim';


@Object()
export class MedicalRecord {
    @Property()
    public idMedicalRecord: string;

    @Property()
    public owner: string;

    @Property()
    public doctorCreator: string;

    @Property()
    public viewDoctorList: string[];

    @Property()
    public medicalRecordHashData: string;

    @Property()
    public medicalRecordStatus: string;

    @Property()
    public medicalRecordTime: number;
}
