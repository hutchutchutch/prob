// Custom reducer functions for state management
export function arrayReplaceReducer<T>(
  current: T[] | undefined, 
  next: T[] | undefined
): T[] {
  return next || current || [];
}

export function arrayAppendReducer<T>(
  current: T[] | undefined, 
  next: T[] | undefined
): T[] {
  if (!current) current = [];
  if (!next) return current;
  return [...current, ...next];
}

export function objectMergeReducer<T extends Record<string, any>>(
  current: T | undefined,
  next: T | undefined
): T {
  if (!current) return next || {} as T;
  if (!next) return current;
  return { ...current, ...next };
}

export function errorAccumulatorReducer(
  current: string[] | undefined,
  next: string[] | undefined
): string[] {
  const currentErrors = current || [];
  const nextErrors = next || [];
  // Deduplicate errors
  const allErrors = [...currentErrors, ...nextErrors];
  return Array.from(new Set(allErrors));
} 