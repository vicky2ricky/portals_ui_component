/*
* This class contains some commonly used object manipulation apis
*/
export class ObjectUtil {
    /**
     * @description Creates and returns a deep copy of the object , returns null incase of exception
     * @param data The input object to be deep copied
     * @returns The deep copy of the object
     * @example {id: "abc"} => {id: "abc"}
     */
    static deepCopy(data) {
        try {
            return JSON.parse(JSON.stringify(data));
        } catch (ex) {
            return null;
        }
    }

    /**
     * @description fetches the sub section of the object based on requested parts
     * @param source The input object to be parsed from
     * @param parts The input object parameter to be searched for in parent
     * @returns The sub section of the parent object
     * @example 'enumType': 'priorityLevel', 'enumItems': {'system': {level: '14'} => {'system': {level: '14'}
     */
    static getFromPath(source, parts) {
        if (typeof parts === 'string') {
            parts = parts.split('.');
        }
        for (let i = 0, l = parts.length; i < l; i++) {
            if (source !== null && typeof source === 'object') {
                source = source[parts[i]];
            } else {
                return null;
            }
        }
        return source;
    }

    /**
     * @description adds param at specific position in a given object
     * @param key of param to be added
     * @param value of param to be added
     * @param obj the parent object
     * @param pos index at which the param needs to be added
     * @returns new object with param inserted at pos
     * @example ObjectUtil.insertKey('targetHumidity', ['zone', 'target', 'humidity'], _item['tags'], 1)
     */
    static insertKey(key, value, obj, pos) {
        const res = Object.keys(obj).reduce((ac, a, i) => {
            if (i === pos) { ac[key] = value; }
            ac[a] = obj[a];
            return ac;
        }, {});

        return res;
    }

    /**
     * @description removes param from object
     * @param key param to be removed
     * @param obj parent object
     * @returns new object with param removed
     * @example ObjectUtil.removeKey('isSplit', sch)
     */
    static removeKey(key, obj) {
        if (obj && obj.hasOwnProperty(key)) {
            delete obj[key];
        }
        return obj;
    }

    /**
     * @description Creates and returns a deep copy of the nested object , returns null incase of exception
     * @param obj The input object to be deep copied
     * @returns The deep copy of the object
     * @example {id: "abc"} => {id: "abc"}
     */
    static deepClone(obj) {
        let outObject;
        let value;
        let key;

        if (typeof obj !== 'object' || obj === null) {
          return obj; // Return the value if obj is not an object
        }

        // Create an array or object to hold the values
        outObject = Array.isArray(obj) ? [] : {};

        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                value = obj[key];

                // Recursively (deep) copy for nested objects, including arrays
                outObject[key] = this.deepClone(value);
            }
        }

        return outObject;
      }
}
