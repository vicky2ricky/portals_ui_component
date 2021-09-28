import { ArrayUtil } from './array-util';

describe('ArrayUtil', () => {
  const arr = [1, 2, 3, 4];
  const arrNull = false;

  it('should create an instance', () => {
    expect(new ArrayUtil()).toBeTruthy();
  });

  it('call flatten', () => {
    ArrayUtil.flatten(arr);
    expect(new ArrayUtil()).toBeTruthy();
  });

  it('call flatten null', () => {
    ArrayUtil.flatten(arrNull);
    expect(new ArrayUtil()).toBeTruthy();
  });

  it('call clone', () => {
    ArrayUtil.clone(arr);
    expect(new ArrayUtil()).toBeTruthy();
  });

  it('call insert', () => {
    ArrayUtil.insert(arr, 1, [2]);
    expect(new ArrayUtil()).toBeTruthy();
  });

  it('call getIndex', () => {
    const tempArr = [{ 0: 1 }];
    ArrayUtil.getIndex(tempArr, 0, 1);
    expect(new ArrayUtil()).toBeTruthy();
  });

  it('call findInArray ', () => {
    const tempArr = [{ 0: 1 }];
    ArrayUtil.findInArray(tempArr, 0, 1);
    expect(new ArrayUtil()).toBeTruthy();
  });

  it('call findInObj ', () => {
    const obj = { id: 1 };
    ArrayUtil.find(obj, 'id', 1);
    expect(new ArrayUtil()).toBeTruthy();
  });

  it('call findInObj ', () => {
    const obj = { id: { id: { id: 1 } } };
    ArrayUtil.find(obj, 'id', 1);
    expect(new ArrayUtil()).toBeTruthy();
  });

  it('call InsertArr ', () => {
    ArrayUtil.insertArrayAt(arr, [1, 2, 3], 1);
    expect(new ArrayUtil()).toBeTruthy();
  });

  it('call groupBy ', () => {
    ArrayUtil.groupBy(arr, 1);
    expect(new ArrayUtil()).toBeTruthy();
  });

  it('call deepFlatten ', () => {
    ArrayUtil.deepFlatten(arr);
    expect(new ArrayUtil()).toBeTruthy();
  });

  it('call deepFlatten ', () => {
    const tempArr = [{ 0: 1 }, { 0: 1 }];
    ArrayUtil.deepFlatten(tempArr, 0);
    expect(new ArrayUtil()).toBeTruthy();
  });

  it('call deepFlatten with prop', () => {
    const tempArr = [0, 1, 2, [[[3, 4]]]];
    ArrayUtil.deepFlatten(tempArr, 1);
    expect(new ArrayUtil()).toBeTruthy();
  });

  it('call flatternByDepth with prop', () => {
    const tempArr = [0, 1, 2, [[[3, 4]]]];
    ArrayUtil.flatternByDepth(tempArr, 1, 3);
    expect(new ArrayUtil()).toBeTruthy();
  });

  it('call flatternByDepth without prop', () => {
    const tempArr = [0, 1, 2, [[[3, 4]]]];
    ArrayUtil.flatternByDepth(tempArr, 1);
    expect(new ArrayUtil()).toBeTruthy();
  });

  it('call removeByAttr without prop', () => {
    const tempArr = [{ 0: 1 }];
    ArrayUtil.removeByAttr(tempArr, 0, 1);
    expect(new ArrayUtil()).toBeTruthy();
  });

});
