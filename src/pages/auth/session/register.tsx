import { Helmet } from 'react-helmet-async';

import { SessionRegisterView } from 'src/sections/auth/session';


// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title>Session: Register</title>
      </Helmet>

      <SessionRegisterView />
    </>
  );
}
