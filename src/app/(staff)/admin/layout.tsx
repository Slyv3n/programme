import { headers } from 'next/headers';
import { checkAdminLicense } from "@/lib/license-server-utils";
import { AdminLayoutClient } from '@/components/admin/AdminLayoutClient';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    if (!session) redirect('/login');

    const headersList = headers();
    const requestHost = (await headersList).get('host');
    const licenseState = await checkAdminLicense(requestHost);

    return (
        <AdminLayoutClient licenseState={licenseState}>
            {children}
        </AdminLayoutClient>
    );
}