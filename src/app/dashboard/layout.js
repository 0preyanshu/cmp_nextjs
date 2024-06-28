"use client";
import * as React from 'react';
import { AuthGuard } from '@/components/auth/auth-guard';
import { DynamicLayout } from '@/components/dashboard/layout/dynamic-layout';
import { usePathname } from "next/navigation";

export default function Layout({ children }) {
  const pathname = usePathname();
  const condition = /^\/dashboard\/events\/\d+\/attendance$/.test(pathname);
  
  if (condition) {
    return (
      <div>{children}</div>
    );
  }

  return (
    <AuthGuard>
      <DynamicLayout>{children}</DynamicLayout>
    </AuthGuard>
  );
}
