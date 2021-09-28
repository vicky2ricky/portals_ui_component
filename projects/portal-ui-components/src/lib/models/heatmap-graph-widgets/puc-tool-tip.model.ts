/**
 * @description For structuring of widget tooltip
 */
export class PucToolTipModel {
    visibility: boolean;
    enumName: string;

    isTypeEnum: boolean;
    enumValue: string;

    hasAlterName: boolean;
    alterName: string;

    valuesCopyKey:string;

    constructor(visibility: boolean, enumName: string = '', isTypeEnum: boolean = false,
                enumValue: string = '', hasAlterName: boolean = false, alterName: string = '',valuesCopyKey:string = undefined) {
        this.visibility = visibility;
        this.enumName = enumName;
        this.isTypeEnum = isTypeEnum;
        this.enumValue = enumValue;
        this.hasAlterName = hasAlterName;
        this.alterName = alterName;
        this.valuesCopyKey = valuesCopyKey;
    }
}
