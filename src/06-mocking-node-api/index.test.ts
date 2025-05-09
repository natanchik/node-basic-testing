import { join } from 'path';
import { existsSync } from 'fs';
import { readFile } from 'fs/promises';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

jest.mock('fs');
jest.mock('fs/promises');
jest.mock('path');

describe('doStuffByTimeout', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set timeout with provided callback and timeout', () => {
    const mockCb = jest.fn();
    const mockTimeout = 1000;
    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(mockCb, mockTimeout);

    expect(setTimeout).toHaveBeenCalledWith(mockCb, mockTimeout);
  });

  test('should call callback only after timeout', () => {
    const mockCb = jest.fn();
    const mockTimeout = 1000;
    jest.spyOn(global, 'setTimeout');
    doStuffByTimeout(mockCb, mockTimeout);

    expect(mockCb).not.toHaveBeenCalled();

    jest.advanceTimersByTime(mockTimeout);

    expect(mockCb).toHaveBeenCalledTimes(1);
  });
});

describe('doStuffByInterval', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('should set interval with provided callback and timeout', () => {
    const mockCb = jest.fn();
    const mockInterval = 1000;
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(mockCb, mockInterval);

    expect(setInterval).toHaveBeenCalledWith(mockCb, mockInterval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const mockCb = jest.fn();
    const mockInterval = 1000;
    jest.spyOn(global, 'setInterval');
    doStuffByInterval(mockCb, mockInterval);

    expect(mockCb).not.toHaveBeenCalled();

    jest.advanceTimersByTime(mockInterval);

    expect(mockCb).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(mockInterval);

    expect(mockCb).toHaveBeenCalledTimes(2);
  });
});

describe('readFileAsynchronously', () => {
  const pathToFile = 'test/path';
  const testContent = 'test text';

  test('should call join with pathToFile', async () => {
    await readFileAsynchronously(pathToFile);
    expect(join).toHaveBeenCalledWith(expect.any(String), pathToFile);
  });

  test('should return null if file does not exist', async () => {
    (existsSync as jest.Mock).mockReturnValue(false);
    const receivedContent = await readFileAsynchronously(pathToFile);
    expect(receivedContent).toBeNull();
  });

  test('should return file content if file exists', async () => {
    (existsSync as jest.Mock).mockReturnValue(true);
    (readFile as jest.Mock).mockResolvedValue(Buffer.from(testContent));

    const receivedContent = await readFileAsynchronously(pathToFile);
    expect(receivedContent).toBe(testContent);
  });
});
