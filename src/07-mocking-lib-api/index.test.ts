import axios from 'axios';
import { throttledGetDataFromApi } from './index';

interface Cb {
  (...args: unknown[]): unknown;
}

jest.mock('axios');
jest.mock('lodash', () => ({
  throttle: (fn: Cb) => fn,
}));

const mockUrl = '/test';
const mockData = 'Response text';

describe('throttledGetDataFromApi', () => {
  test('should create instance with provided base url', async () => {
    const mockCreate = jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockData }),
    });
    (axios.create as jest.Mock).mockImplementation(mockCreate);

    await throttledGetDataFromApi(mockUrl);

    expect(mockCreate).toHaveBeenCalledWith({
      baseURL: 'https://jsonplaceholder.typicode.com',
    });
  });

  test('should perform request to correct provided url', async () => {
    const mockGet = jest.fn().mockResolvedValue({ data: mockData });
    const mockCreate = jest.fn().mockReturnValue({
      get: mockGet,
    });
    (axios.create as jest.Mock).mockImplementation(mockCreate);

    await throttledGetDataFromApi(mockUrl);

    expect(mockGet).toHaveBeenCalledWith(mockUrl);
  });

  test('should return response data', async () => {
    const mockCreate = jest.fn().mockReturnValue({
      get: jest.fn().mockResolvedValue({ data: mockData }),
    });
    (axios.create as jest.Mock).mockImplementation(mockCreate);

    const result = await throttledGetDataFromApi(mockUrl);

    expect(result).toEqual(mockData);
  });
});
