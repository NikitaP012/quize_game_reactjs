import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIdentity } from '../context/IdentityContext';
import { Loader } from '../components/States';

/**
 * Landing route for the manager's link:
 *   quiz.prisms.in/{school_id}/{class}/{user_id}/{user_name}
 *
 * It captures the four segments as the player's identity, stores them, then
 * redirects into the normal app (the subjects page). From then on the identity
 * rides along with every quiz submission so results land in k6kb9_ec_marks.
 */
export default function GuestEntry() {
  const { schoolId, classId, userId, userName } = useParams();
  const { setIdentity } = useIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    setIdentity({
      schoolId,
      classId,
      userId,
      userName: safeDecode(userName),
    });
    navigate('/', { replace: true });
  }, [schoolId, classId, userId, userName, setIdentity, navigate]);

  return <Loader label="Setting up your quiz…" />;
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value || '');
  } catch {
    return value || '';
  }
}
