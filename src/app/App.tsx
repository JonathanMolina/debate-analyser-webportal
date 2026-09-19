import { FC } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './router/router';
import { QueryProvider } from './providers/QueryProvider';

export const App: FC = () => {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
};
