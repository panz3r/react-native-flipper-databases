import { getCellValue } from '../../drivers/realm';

describe('RealmDB', () => {
  describe('getCellValue', () => {
    test('return the expected string value', () => {
      // Arrange
      const row = {
        test: 'test',
      };
      const colName = 'test';

      // Act
      const res = getCellValue(row, colName);

      // Expect
      expect(res).toBe('test');
    });

    test('return the expected number value', () => {
      // Arrange
      const row = {
        test: 1,
      };
      const colName = 'test';

      // Act
      const res = getCellValue(row, colName);

      // Expect
      expect(res).toBe(1);
    });

    test('return the expected object value as JSON string', () => {
      // Arrange
      const row = {
        test: {
          subValue: 'test',
        },
      };
      const colName = 'test';

      // Act
      const res = getCellValue(row, colName);

      // Expect
      expect(res).toBe(`{
  "subValue": "test"
}`);
    });

    test('return the expected array value as JSON string', () => {
      // Arrange
      const row = {
        test: {
          subValue: ['test', 'test'],
        },
      };
      const colName = 'test';

      // Act
      const res = getCellValue(row, colName);

      // Expect
      expect(res).toBe(`{
  "subValue": [
    "test",
    "test"
  ]
}`);
    });
  });
});
