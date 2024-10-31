'use client';

import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const pathname = usePathname();

  return (
    <Tabs value={pathname} className="w-full">
      <TabsList className="flex justify-around bg-card p-1 rounded-lg">
        <TabsTrigger value="/" asChild>
          <Link href="/" className="px-3 py-2 rounded-md hover:bg-muted">
            Home
          </Link>
        </TabsTrigger>
        <TabsTrigger value="/chat" asChild>
          <Link href="/chat" className="px-3 py-2 rounded-md hover:bg-muted">
            AI Chat
          </Link>
        </TabsTrigger>
        <TabsTrigger value="/recipes" asChild>
          <Link href="/recipes" className="px-3 py-2 rounded-md hover:bg-muted">
            Recipes
          </Link>
        </TabsTrigger>
        <TabsTrigger value="/preferences" asChild>
          <Link href="/preferences" className="px-3 py-2 rounded-md hover:bg-muted">
            Preferences
          </Link>
        </TabsTrigger>
        <TabsTrigger value="/login" asChild>
          <Link href="/login" className="px-3 py-2 rounded-md hover:bg-muted">
            Login
          </Link>
        </TabsTrigger>
        <TabsTrigger value="/onboarding" asChild>
          <Link href="/onboarding" className="px-3 py-2 rounded-md hover:bg-muted">
            Onboarding
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default Navigation;