import * as camelifyFunctions from './camelify.util';

describe('camelify', () => {
  it('should return string in camel case when calling camelifyString', () => {
    const str = 'appreciation_per_second';
    const expetedStr = 'appreciationPerSecond';
    const result = camelifyFunctions.camelifyString(str);
    expect(result).toEqual(expetedStr);
  });

  it('should return object with keys in camel case when calling camelifyObject', () => {
    const obj = {
      appreciation_per_second: 0.03204034391534392,
      value_date: '2022-10-08',
      value_dollars: 2340613,
      parcel_id: 'd1d848bc-7e8d-585a-8a97-03313892a959',
    };
    const expetedObj = {
      appreciationPerSecond: 0.03204034391534392,
      valueDate: '2022-10-08',
      valueDollars: 2340613,
      parcelId: 'd1d848bc-7e8d-585a-8a97-03313892a959',
    };
    const camelifyStringSpy = jest.spyOn(camelifyFunctions, 'camelifyString');
    const result = camelifyFunctions.camelifyObject(obj);
    Object.keys(obj).forEach((key) => {
      expect(camelifyStringSpy).toHaveBeenCalledWith(key);
    });
    expect(result).toEqual(expetedObj);
  });
});
