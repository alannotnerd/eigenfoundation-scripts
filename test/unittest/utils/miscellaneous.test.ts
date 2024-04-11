import { stringify } from '../../../src/utils/miscellaneous';

describe('stringify', () => {
  it('should stringify an object', () => {
    const obj = { name: 'John', age: 30 };
    const expectedString = '{"name":"John","age":30}';
    const result = stringify(obj);
    expect(result).toBe(expectedString);
  });

  it('should stringify an object with bigint values', () => {
    const obj = { value: BigInt(123456789) };
    const expectedString = '{"value":"123456789"}';
    const result = stringify(obj);
    expect(result).toBe(expectedString);
  });

  it('should stringify an object with nested objects', () => {
    const obj = { name: 'John', address: { city: 'New York', number: BigInt(123456789) } };
    const expectedString = '{"name":"John","address":{"city":"New York","number":"123456789"}}';
    const result = stringify(obj);
    expect(result).toBe(expectedString);
  });

  it('should stringify an array', () => {
    const arr = [BigInt(1), BigInt(2), BigInt(3)];
    const expectedString = '["1","2","3"]';
    const result = stringify(arr);
    expect(result).toBe(expectedString);
  });

  it('should stringify a string', () => {
    const str = 'Hello, World!';
    const expectedString = '"Hello, World!"';
    const result = stringify(str);
    expect(result).toBe(expectedString);
  });
});
