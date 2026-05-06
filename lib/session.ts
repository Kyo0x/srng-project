import { getServerAuthSession } from "@/auth";

export async function requireUserSession() {
  const session = await getServerAuthSession();

  if (!session?.user?.id) {
    return null;
  }

  return session;
}
