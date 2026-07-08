'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Loader from '@/components/home/loader';
import { usePermissions } from '@/src/hooks/usePermissions';
import { useUserStore } from '@/src/stores/user-store';
import { getSectionForPath } from '@/src/lib/permissions';

export default function RoutePermissionGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);
  const { canRoute, isReady, isPermissionsLoading, firstAllowedHref, user } = usePermissions();

  const section = getSectionForPath(pathname);
  const allowed = canRoute(pathname);
  const requiresPermissionCheck = section !== null;

  useEffect(() => {
    if (!isReady) return;

    if (!user) {
      void (async () => {
        await logout();
        router.replace('/login');
      })();
      return;
    }

    if (allowed || isPermissionsLoading) return;

    toast.error('ليس لديك صلاحية للوصول إلى هذه الصفحة');
    router.replace(firstAllowedHref);
  }, [isReady, allowed, firstAllowedHref, isPermissionsLoading, logout, router, user]);

  if (!isReady) {
    return <Loader />;
  }

  if (!user) {
    return <Loader />;
  }

  if (isPermissionsLoading && requiresPermissionCheck) {
    return <Loader />;
  }

  if (!allowed && requiresPermissionCheck) {
    return <Loader />;
  }

  return children;
}
