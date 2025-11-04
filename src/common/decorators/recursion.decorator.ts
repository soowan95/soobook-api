const MAX_RECURSION_DEPTH = 3;

export function Recursion(
  depth: number = MAX_RECURSION_DEPTH,
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
        attempts++;
        try {
          return await originalMethod.apply(this, args);
        } catch (e) {
          if (e instanceof ErrorType) {
            if (attempts === depth) {
              throw e;
            }
            console.log(`Recursion depth reached. Retrying...`);
            console.log(`Error: ${e.message}`);
            continue;
          }
          throw e;
        }
      }
    };
  };
}
