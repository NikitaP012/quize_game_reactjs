import { useEffect, useState, useCallback } from 'react';

/**
 * Runs an async function and tracks { data, loading, error }.
 * Re-runs whenever `deps` change. `fn` should be stable or wrapped by caller.
 */
export function useAsync(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const run = useCallback(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    Promise.resolve(fn())
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(run, [run]);

  return { data, loading, error, reload: run };
}
