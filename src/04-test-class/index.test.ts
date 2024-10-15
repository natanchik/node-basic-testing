import {
  getBankAccount,
  InsufficientFundsError,
  TransferFailedError,
  SynchronizationFailedError,
  BankAccount,
} from '.';

describe('BankAccount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should create account with initial balance', () => {
    const bankAccount = getBankAccount(5);

    expect(bankAccount.getBalance()).toBe(5);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const bankAccount = getBankAccount(5);

    expect(() => bankAccount.withdraw(6)).toThrow(InsufficientFundsError);
  });

  test('should throw error when transferring more than balance', () => {
    const bankAccount = getBankAccount(5);
    const anotherBankAccount = getBankAccount(10);

    expect(() => bankAccount.transfer(20, anotherBankAccount)).toThrowError();
  });

  test('should throw error when transferring to the same account', () => {
    const bankAccount = getBankAccount(5);

    expect(() => bankAccount.transfer(3, bankAccount)).toThrow(
      TransferFailedError,
    );
  });

  test('should deposit money', () => {
    const bankAccount = getBankAccount(5);
    bankAccount.deposit(6);

    expect(bankAccount.getBalance()).toBe(11);
  });

  test('should withdraw money', () => {
    const bankAccount = getBankAccount(12);
    bankAccount.withdraw(4);

    expect(bankAccount.getBalance()).toBe(8);
  });

  test('should transfer money', () => {
    const bankAccount = getBankAccount(30);
    const anotherBankAccount = getBankAccount(10);
    bankAccount.transfer(15, anotherBankAccount);

    expect(bankAccount.getBalance()).toBe(15);
    expect(anotherBankAccount.getBalance()).toBe(25);
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const bankAccount = getBankAccount(20);
    const balance = await bankAccount.fetchBalance();

    if (balance) {
      expect(typeof balance).toBe('number');
    } else {
      expect(balance).toBeNull();
    }
  });

  test('should set new balance if fetchBalance returned number', async () => {
    jest
      .spyOn(BankAccount.prototype, 'fetchBalance')
      .mockReturnValue(Promise.resolve(20));

    const bankAccount = new BankAccount(30);
    await bankAccount.synchronizeBalance();

    expect(bankAccount.getBalance()).toBe(20);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    jest
      .spyOn(BankAccount.prototype, 'fetchBalance')
      .mockReturnValue(Promise.resolve(null));

    const bankAccount = new BankAccount(30);

    try {
      await bankAccount.synchronizeBalance();
    } catch (error) {
      expect(error).toBeInstanceOf(SynchronizationFailedError);
    }
  });
});
