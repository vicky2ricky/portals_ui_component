/**
 * @description To strucutre CM board mappings
 */
export class PucCMBoardPortsMappings {
    ref: string;
    isEnabled = false;
    param: string;

    constructor(ref: string, enabled: boolean, param: string) {
        this.ref = ref;
        this.isEnabled = enabled;
        this.param = param;
    }
}
