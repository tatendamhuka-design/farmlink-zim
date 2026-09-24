import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { RegisterForm } from "@/components/RegisterForm";

export const metadata = { title: "Create an account" };

export default async function RegisterPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect("/");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-lg">
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
            Create your account
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Join Zimbabwe&apos;s direct farm marketplace
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-soft">
          <RegisterForm />
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-brand-700 hover:text-brand-800"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}