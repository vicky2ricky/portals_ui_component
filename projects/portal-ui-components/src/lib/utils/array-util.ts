/* tslint:disable */
// @dynamic
export class ArrayUtil {
    static flatten(arr) {

        if (arr) {
            return [].concat(...arr);
        } else {
            return [];
        }

    }
    static clone(src) {
        return JSON.parse(JSON.stringify(src));
    }
    static insert = (arr, index, newItem) => [
        // part of the array before the specified index
        ...arr.slice(0, index),
        // inserted item
        ...ArrayUtil.flatten(newItem),
        // part of the array after the specified index
        ...arr.slice(index)
    ]
    static getIndex(array, property, value) {
        let result = -1;

        array.find((current, index) => {
            if (current[property] === value) {
                result = index;
            }
        });
        return result;
    }
    static findInArray(array, property, value) {
        const result = array.find((current) => {
            return property ? (current[property] == value) : (current == value);
        });
        return result;
    }
    static find(obj, key, value) {
        // Base case
        if (obj[key] === value) {
            return obj;
        } else {
            for (let i = 0, len = Object.keys(obj).length; i < len; i++) {
                if (typeof obj[i] == 'object') {
                    let found = this.find(obj[i], key, value);
                    if (found) {
                        // If the object was found in the recursive call, bubble it up.
                        return found;
                    }
                }
            }
        }
    }
    static insertArrayAt(array, destArr, index) {
        return array.splice(index, 0, ...destArr);
    }
    static groupBy(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    static deepFlatten(array, property?) {
        return ArrayUtil.flatten(
            array.map((rec) => {
                if (property) {

                    return Array.isArray(rec[property]) && rec[property].length > 0 ? [].concat(rec, ArrayUtil.deepFlatten(rec[property], property)) : rec;
                } else {
                    return Array.isArray(rec) ? ArrayUtil.deepFlatten(rec) : rec;
                }
            }
            )
        );
    }
    static flatternByDepth(arr, d = 1, property?) {
        if (property) {
            return (d > 0) ? arr.reduce((acc, val) => acc.concat((Array.isArray(val[property]) && val[property].length > 0) ? [].concat(val, ArrayUtil.flatternByDepth(val[property], d - 1, property)) : val), [])
                : arr.slice();
        } else {
            return d > 0 ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? ArrayUtil.flatternByDepth(val, d - 1) : val), [])
                : arr.slice();
        }
    }
    static removeByAttr(arr, attr, value) {
        let i = arr.length;
        while (i--) {
            if (arr[i]
                && arr[i].hasOwnProperty(attr)
                && (arguments.length > 2 && arr[i][attr] === value)) {
                arr.splice(i, 1);
            }
        }
        return arr;
    }

    static mapOrder (array, order, key) {
  
        array.sort( function (a, b) {
          var A = a[key], B = b[key];
          
          if (order.indexOf(A) > order.indexOf(B)) {
            return 1;
          } else {
            return -1;
          }
          
        });
        
        return array;
      };

}
