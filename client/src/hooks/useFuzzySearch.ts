import { useMemo } from "react";
import Fuse from "fuse.js";

interface UseFuzzySearchOptions<T> {
  data: T[];
  keys: string[];
  threshold?: number;
  searchQuery: string;
}

export function useFuzzySearch<T>({
  data,
  keys,
  threshold = 0.4,
  searchQuery,
}: UseFuzzySearchOptions<T>): T[] {
  const fuse = useMemo(
    () =>
      new Fuse(data, {
        keys,
        threshold,
        includeScore: true,
        shouldSort: true,
        ignoreLocation: true,
        minMatchCharLength: 2,
      }),
    [data, keys, threshold]
  );

  const results = useMemo<T[]>(() => {
    if (!searchQuery || searchQuery.trim() === "") {
      return data;
    }

    const fuseResults = fuse.search(searchQuery);
    return fuseResults.map((result) => result.item);
  }, [fuse, searchQuery, data]);

  return results;
}
