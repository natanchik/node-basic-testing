import { simpleCalculator, Action } from './index';

const testCases = [
  { a: 1, b: 2, action: Action.Add, expected: 3 },
  { a: 2, b: 2, action: Action.Add, expected: 4 },
  { a: 3, b: 2, action: Action.Add, expected: 5 },
  { a: 3, b: 2, action: Action.Subtract, expected: 1 },
  { a: 6, b: 1, action: Action.Subtract, expected: 5 },
  { a: 7, b: 4, action: Action.Subtract, expected: 3 },
  { a: 15, b: 3, action: Action.Divide, expected: 5 },
  { a: 36, b: 4, action: Action.Divide, expected: 9 },
  { a: 40, b: 5, action: Action.Divide, expected: 8 },
  { a: 15, b: 3, action: Action.Multiply, expected: 45 },
  { a: 10, b: 6, action: Action.Multiply, expected: 60 },
  { a: 12, b: 3, action: Action.Multiply, expected: 36 },
  { a: 2, b: 3, action: Action.Exponentiate, expected: 8 },
  { a: 3, b: 3, action: Action.Exponentiate, expected: 27 },
  { a: 5, b: 2, action: Action.Exponentiate, expected: 25 },
  { a: 5, b: 2, action: 'invalidAction', expected: null },
  { a: 'string', b: true, action: Action.Add, expected: null },
];

describe('simpleCalculator', () => {
  test.each(testCases)(
    'should return $expected as result of $a $action $b',
    ({ a, b, action, expected }) => {
      expect(simpleCalculator({ a, b, action })).toBe(expected);
    },
  );
});
