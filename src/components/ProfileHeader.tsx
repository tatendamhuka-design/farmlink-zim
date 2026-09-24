import { Mail, Calendar, MapPin } from "lucide-react";

interface ProfileHeaderProps {
  fullName: string;
  email: string;
  role: string;
  joinedAt: Date;
  city: string | null;
}

export function ProfileHeader({
  fullName,
  email,
  role,
  joinedAt,
  city,
}: ProfileHeaderProps) {
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <section className="flex items-start gap-4">
      <div className="h-16 w-16 rounded-full bg-brand-100 flex items-center justify-center shrink-0">
        <span className="font-semibold text-brand-800 text-2xl">{initial}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-900 truncate">
          {fullName}
        </h1>
        <p className="text-xs uppercase tracking-wide font-semibold text-brand-700 mt-0.5">
          {role}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500">
          <span className="inline-flex items-center gap-1">
            <Mail className="h-3 w-3" strokeWidth={2} />
            {email}
          </span>
          {city && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" strokeWidth={2} />
              {city}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" strokeWidth={2} />
            Joined{" "}
            {new Date(joinedAt).toLocaleDateString("en-GB", {
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </section>
  );
}