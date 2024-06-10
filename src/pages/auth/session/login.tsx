import { Helmet } from 'react-helmet-async';

import { SessionLoginView } from 'src/sections/auth/session';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title>Session: Login</title>
      </Helmet>

      <SessionLoginView />
    </>
  );
}
