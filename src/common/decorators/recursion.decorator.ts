export function Recursion(
  depth: number,
  ErrorType: new (...args: any[]) => Error,
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let attempts = 0;

      while (attempts < depth) {
        try {
          return await originalMethod.apply(this, args);
        } catch (e) {
          if (e instanceof ErrorType) {
            attempts++;
            if (attempts === depth) {
              throw e;
            }
            continue;
          }
          throw e;
        }
      }
    };
  };
}
