/// <reference types="jest" />

declare namespace jest {
  interface Mock<T = any, Y extends any[] = any> {
    (...args: Y): T;
    mockReturnValue: (val: T) => Mock<T, Y>;
    mockReturnValueOnce: (val: T) => Mock<T, Y>;
    mockResolvedValue: <U>(val: U) => Mock<Promise<U>, Y>;
    mockResolvedValueOnce: <U>(val: U) => Mock<Promise<U>, Y>;
    mockRejectedValue: (val: any) => Mock<Promise<never>, Y>;
    mockRejectedValueOnce: (val: any) => Mock<Promise<never>, Y>;
  }
  
  // Estender as funções de mock
  export function mock<T extends {}>(moduleName: string, factory?: () => T): void;
  export function fn<T = any, Y extends any[] = any[]>(): Mock<T, Y>;
  export function clearAllMocks(): void;
}

// Para typescript reconhecer a extensão nos mocks
interface Function {
  mockReturnValue: <T>(val: T) => jest.Mock<T>;
  mockReturnValueOnce: <T>(val: T) => jest.Mock<T>;
  mockResolvedValue: <T>(val: T) => jest.Mock<Promise<T>>;
  mockResolvedValueOnce: <T>(val: T) => jest.Mock<Promise<T>>;
  mockRejectedValue: (val: any) => jest.Mock<Promise<never>>;
  mockRejectedValueOnce: (val: any) => jest.Mock<Promise<never>>;
  mockImplementation: <T, Y extends any[]>(fn: (...args: Y) => T) => jest.Mock<T, Y>;
  mockImplementationOnce: <T, Y extends any[]>(fn: (...args: Y) => T) => jest.Mock<T, Y>;
} 