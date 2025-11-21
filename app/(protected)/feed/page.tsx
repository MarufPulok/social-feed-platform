import { auth } from "@/auth";

export default async function FeedPage() {
  const session = await auth();

  if (!session) {
    return null;
  }

  return (
    <div className="container">
      <h1>Feed Page</h1>
      <p>
        Welcome, {session.user.firstName} {session.user.lastName}!
      </p>
      <p>Feed functionality will be implemented next.</p>
    </div>
  );
}
