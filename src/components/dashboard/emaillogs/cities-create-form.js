'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { useSelector } from 'react-redux';

export function MessageDisplay() {
  const { id } = useParams();
  const { isLoading, toast, emailLogs, totalElements } = useSelector((state) => state.emailLogs);

  const currentMessage = emailLogs.find((message) => message.id === id);

  if (!currentMessage) {
    return <div>Message not found</div>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: currentMessage.html }}
      style={{ padding: '24px 16px', backgroundColor: '#fff', width: '800px', border: '0px solid #000', margin: 'auto' }}
    />
  );
}
