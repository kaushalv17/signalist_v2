import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import Header from '@/components/Header';
import { getAuth } from '@/lib/better-auth/auth';

// Server-side session check — if no session the middleware already redirected,
// but this acts as a belt-and-braces guard at the layout level.
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth    = await getAuth();
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) redirect('/sign-in');

  const user: User = {
    id:    session.user.id,
    name:  session.user.name,
    email: session.user.email,
    image: session.user.image ?? undefined,
  };

  return (
    <main className="min-h-screen text-gray-400">
      <Header user={user} />
      <div className="container py-10">{children}</div>
    </main>
  );
}
