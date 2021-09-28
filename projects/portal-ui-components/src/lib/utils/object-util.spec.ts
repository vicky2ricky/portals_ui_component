import { ObjectUtil } from './object-util';

describe('ObjectUtil: To test object manipulation functions', () => {

    it('should create an instance', () => {
        expect(new ObjectUtil()).toBeTruthy();
    });

    it('deepCopy: should create and return deep copy of the original object', () => {
        const originalObject: any = {};
        originalObject.id = 'test';
        originalObject.type = 'something';
        const copyObject = ObjectUtil.deepCopy(originalObject);

        expect(copyObject).toEqual(originalObject);
    });

    it('deepCopy: should handle null objects', () => {
        const copyObject = ObjectUtil.deepCopy(null);

        expect(copyObject).toEqual(null);
    });

    it('deepCopy: should return null as copy in case of exception', () => {
        const originalObject: any = {};
        originalObject.a = { b: originalObject };
        const copyObject = ObjectUtil.deepCopy(originalObject);

        expect(copyObject).toEqual(null);
    });

    it('getFromPath: should return sub part of the parent object', () => {
        const enums: any[] = [
            {
                enumType: 'priorityLevel',
                enumItems: {
                    system: {
                        level: '14'
                    },
                    building: {
                        level: '16'
                    },
                    zone: {
                        level: '10'
                    },
                    module: {
                        level: '8'
                    }
                }
            }];
        const result = ObjectUtil.getFromPath(enums[0], ['enumItems']);

        expect(result.building).toEqual({ level: '16' });
        expect(result.system).toEqual({ level: '14' });
        expect(result.zone).toEqual({ level: '10' });
        expect(result.module).toEqual({ level: '8' });
    });

    it('getFromPath: should handle null as source', () => {
        const result = ObjectUtil.getFromPath(null, ['enumItems']);

        expect(result).toEqual(null);
    });

    it('getFromPath: should handle child.child in parts argument', () => {
        const enums: any[] = [
            {
                enumType: 'priorityLevel',
                enumItems: {
                    system: {
                        level: '14'
                    },
                    building: {
                        level: '16'
                    },
                    zone: {
                        level: '10'
                    },
                    module: {
                        level: '8'
                    }
                }
            }];

        const result = ObjectUtil.getFromPath(enums[0], 'enumItems.system');

        expect(result).toEqual({ level: '14' });
    });

    it('insertKey: should add param at specified pos', () => {
        const origDataSet = {
            el1: ['val1', 'val2'],
            el2: ['val3', 'val4']
        };

        let newDataSet: any = {};

        newDataSet = ObjectUtil.insertKey('elN', ['val5', 'val6'], origDataSet, 0);

        expect(newDataSet.elN).toEqual(['val5', 'val6']);
    });

    it('removeKey: should remove the specified key from parent', () => {
        const origDataSet = {
            el1: ['val1', 'val2'],
            el2: ['val3', 'val4']
        };

        const newDataSet = ObjectUtil.removeKey('el1', origDataSet);

        expect(newDataSet.el1).toEqual(undefined);
    });

    it('removeKey: should not remove anything from parent if specified key not found in parent', () => {
        const origDataSet = {
            el1: ['val1', 'val2'],
            el2: ['val3', 'val4']
        };

        const newDataSet = ObjectUtil.removeKey('elN', origDataSet);

        expect(newDataSet.el1).toEqual(['val1', 'val2']);
        expect(newDataSet.el2).toEqual(['val3', 'val4']);
    });

    it('deepClone: should create and return deep copy of the original object', () => {
        const originalObject: any = {};
        originalObject.id = 'test';
        originalObject.type = 'something';
        const copyObject = ObjectUtil.deepClone(originalObject);

        expect(copyObject).toEqual(originalObject);
    });

    it('deepClone: should handle null objects', () => {
        const copyObject = ObjectUtil.deepClone(null);

        expect(copyObject).toEqual(null);
    });
});
