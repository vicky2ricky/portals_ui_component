import { Moment } from 'moment';

export class VacationScheduleDetails {
    vacId: string;
    siteRef: string;
    roomRef: string;
    name: string;
    strtDate: Moment;
    endDate: Moment;
    isZoneVAc: boolean;
    isExpired: boolean;
    dispNameStDate: string;
    dispNameEdDate: string;

    constructor(vacId: string, siteRef: string, roomRef: string, name: string,
                strtDate: Moment, endDate: Moment, isZoneVac: boolean = true) {
        this.vacId = vacId;
        this.siteRef = siteRef;
        this.roomRef = roomRef;
        this.name = name;
        this.strtDate = strtDate;
        this.endDate = endDate;
        this.isZoneVAc = isZoneVac;
    }
}
