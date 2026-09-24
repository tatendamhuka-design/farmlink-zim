import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export const metadata = { title: "Sign in" };

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-brand-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <span className="font-semibold text-brand-800 text-lg">
              FarmLink <span className="text-brand-600">Zim</span>
            </span>
          </Link>
          <h1 className="mt-4 text-2xl font-semibold text-gray-900">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Sign in to your FarmLink Zim account
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
          <LoginForm />
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-brand-700 hover:text-brand-800"
          >
            Create one
          </Link>
        </p>

        {/* Demo accounts helper */}
        <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-white p-3">
          <p className="text-xs font-medium text-gray-500 mb-2">
            Demo accounts (password: password123)
          </p>
          <div className="space-y-1 text-xs text-gray-600">
            <p>Admin: admin@farmlink.co.zw</p>
            <p>Farmer: tendai@farmlink.co.zw</p>
            <p>Buyer: buyer1@farmlink.co.zw</p>
          </div>
        </div>
      </div>
    </div>
  );
}