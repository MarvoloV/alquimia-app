/* eslint-disable @typescript-eslint/no-explicit-any */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function convertKeysToCamelCase<T extends Record<string, any>>(
  obj: T,
): any {
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToCamelCase);
  }

  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj).reduce((acc, key) => {
      const camelKey = snakeToCamel(key);
      acc[camelKey] = convertKeysToCamelCase(obj[key]);
      return acc;
    }, {} as any);
  }

  return obj;
}
