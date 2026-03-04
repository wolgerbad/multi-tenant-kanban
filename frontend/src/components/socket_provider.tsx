'use client';

import { connectSocket } from '@/helpers/socket';
import { useEffect } from 'react';

export default function SocketProvider({
  isValidated,
  children,
}: {
  isValidated: boolean;
  children: React.ReactNode;
}) {
  useEffect(
    function () {
      if (isValidated) connectSocket();
    },
    [isValidated]
  );

  return <>{children}</>;
}
