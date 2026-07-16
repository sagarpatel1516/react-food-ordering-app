import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

import LinkButton from './LinkButton';

function ErrorElement() {
  const error = useRouteError();

  let message = 'Something went wrong.';

  if (isRouteErrorResponse(error)) {
    message = String(error.data || error.statusText);
  } else if (error instanceof globalThis.Error) {
    message = error.message;
  }

  return (
    <div>
      <h1>Something went wrong 😢</h1>
      <p>{message}</p>

      <LinkButton to="-1">&larr; Go back</LinkButton>
    </div>
  );
}

export default ErrorElement;
