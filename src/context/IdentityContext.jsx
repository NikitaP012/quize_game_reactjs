import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import { loadIdentity, saveIdentity } from '../store/identityStore';

const IdentityContext = createContext(null);

/** Turn the URL's `class` segment into a numeric grade id (defaults to 1). */
function toGrade(classId) {
  const n = parseInt(classId, 10);
  return Number.isFinite(n) && n > 0 ? n : 1;
}

export function IdentityProvider({ children }) {
  const [identity, setIdentityState] = useState(loadIdentity);

  // Persist whenever it changes so it survives refresh / internal navigation.
  useEffect(() => {
    if (identity) saveIdentity(identity);
  }, [identity]);

  const setIdentity = useCallback((next) => setIdentityState(next), []);

  const value = useMemo(
    () => ({
      identity, // { schoolId, classId, userId, userName } | null
      schoolId: identity?.schoolId ?? null,
      classId: identity?.classId ?? null,
      userId: identity?.userId ?? null,
      userName: identity?.userName ?? null,
      // Which grade's content to load — driven by the URL's class segment.
      gradeId: toGrade(identity?.classId),
      setIdentity,
    }),
    [identity, setIdentity]
  );

  return <IdentityContext.Provider value={value}>{children}</IdentityContext.Provider>;
}

export function useIdentity() {
  const ctx = useContext(IdentityContext);
  if (!ctx) throw new Error('useIdentity must be used within IdentityProvider');
  return ctx;
}
