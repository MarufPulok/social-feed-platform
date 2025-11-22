"use client";

import { signOut, useSession } from "next-auth/react";

export default function FeedPage() {
  const { data: session } = useSession();

  if (!session) {
    return null;
  }

  return (
    <div className="container">
      <h1>Feed Page</h1>
      <button onClick={() => signOut()}>Sign Out</button>
      <p>
        Welcome, {session.user.firstName} {session.user.lastName}!
      </p>
      <p>Feed functionality will be implemented next.</p>
    </div>
  );
}
