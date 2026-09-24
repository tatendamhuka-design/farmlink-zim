import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import type { UserRole } from "@prisma/client";

export interface SessionUser {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;
  return {
    id: (session.user as any).id,
    email: session.user.email!,
    name: session.user.name,
    role: (session.user as any).role,
  };
}

/**
 * Require a specific role (or one of several) to view a page.
 * Redirects to /login if not signed in, or / if wrong role.
 * Returns the session user so the page can use it.
 */
export async function requireRole(
  allowed: UserRole | UserRole[]
): Promise<SessionUser> {
  const user = await getCurrentUser();
  const roles = Array.isArray(allowed) ? allowed : [allowed];

  if (!user) {
    redirect("/login");
  }

  if (!roles.includes(user.role)) {
    redirect("/");
  }

  return user;
}

/**
 * Require an admin. Shorthand.
 */
export async function requireAdmin(): Promise<SessionUser> {
  return requireRole("ADMIN");
}

/**
 * Require a farmer. Shorthand.
 */
export async function requireFarmer(): Promise<SessionUser> {
  return requireRole("FARMER");
}

/**
 * Require any signed-in user.
 */
export async function requireAuth(): Promise<SessionUser> {
  return requireRole(["CUSTOMER", "FARMER", "ADMIN"]);
}