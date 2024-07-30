import * as React from 'react';

import { config } from '@/config';
import { ResetPasswordForm } from '@/components/auth/custom/update-password-form';
import { GuestGuard } from '@/components/auth/guest-guard';
import { SplitLayout } from '@/components/auth/split-layout';

export const metadata = { title: `Sign up | Custom | Auth | ${config.site.name}` };

export default function Page({searchParams}) {
  return (
    <GuestGuard>
      <SplitLayout>
        <ResetPasswordForm  searchParams={searchParams}/>
      </SplitLayout>
    </GuestGuard>
  );
}
