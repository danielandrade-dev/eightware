declare module 'jest' {
  interface Matchers<R> {
    toBeNull(): R;
    not: Matchers<R>;
  }
}

declare const jest: {
  fn: () => jest.Mock;
  clearAllMocks: () => void;
};

declare const describe: (name: string, fn: () => void) => void;
declare const it: (name: string, fn: () => void) => void;
declare const expect: <T>(value: T) => jest.Matchers<T>;
declare const beforeEach: (fn: () => void) => void; 