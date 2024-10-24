export function removeEqualProperties<T extends Record<string, unknown>>(
  obj: T,
  compareObj: T,
  options?: {
    removeEmptyString?: boolean;
    removeNull?: boolean;
  },
): Partial<T> | null {
  if (!Object.keys(obj)?.length || !Object.keys(compareObj)?.length)
    return null;

  const result: Partial<T> = {};

  Object.keys(obj).forEach((key) => {
    if (obj[key] !== compareObj[key]) {
      if (options?.removeEmptyString && obj[key] === '') return;
      if (options?.removeNull && obj[key] === null) return;
      result[key as keyof T] = obj[key as keyof T];
    }
  });

  return result;
}
