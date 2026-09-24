import { redirect } from "next/navigation";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { ProfileHeader } from "@/components/ProfileHeader";
import { ProfileTabs } from "@/components/ProfileTabs";
import { getCurrentUser } from "@/lib/permissions";
import {
  getCustomerProfileByUserId,
  getCustomerRequests,
  getCustomerEnquiries,
  getUserNotifications,
} from "@/lib/queries";

export const metadata = { title: "Profile" };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const profile = await getCustomerProfileByUserId(user.id);

  const [requests, enquiries, notifications] = profile
    ? await Promise.all([
        getCustomerRequests(profile.id),
        getCustomerEnquiries(profile.id),
        getUserNotifications(user.id),
      ])
    : [[], [], await getUserNotifications(user.id)];

  return (
    <div className="min-h-screen pb-24 md:pb-12">
      <TopBar location={profile?.city || "Zimbabwe"} />

      <main className="max-w-4xl mx-auto px-4 pt-5">
        <ProfileHeader
          fullName={user.name || "Account"}
          email={user.email}
          role={user.role}
          joinedAt={profile?.createdAt || new Date()}
          city={profile?.city || null}
        />

        <ProfileTabs
          user={{
            id: user.id,
            fullName: user.name || "",
            email: user.email,
            phone: profile?.user.phone || "",
            role: user.role,
          }}
          requests={requests.map((r) => ({
            id: r.id,
            title: r.title,
            quantity: r.quantity,
            unit: r.unit,
            city: r.city,
            province: r.province,
            status: r.status,
            createdAt: r.createdAt,
            responsesCount: r._count.responses,
          }))}
          enquiries={enquiries.map((e) => ({
            id: e.id,
            status: e.status,
            message: e.message,
            createdAt: e.createdAt,
            product: {
              id: e.product.id,
              title: e.product.title,
              imageUrl: e.product.images[0]?.url || null,
            },
            farmer: {
              id: e.farmer.id,
              name: e.farmer.user.fullName,
              farmName: e.farmer.farmName,
              whatsappNumber: e.farmer.whatsappNumber,
              verified: e.farmer.verificationStatus === "VERIFIED",
            },
          }))}
          notifications={notifications.map((n) => ({
            id: n.id,
            title: n.title,
            body: n.body,
            link: n.link,
            isRead: n.isRead,
            type: n.type,
            createdAt: n.createdAt,
          }))}
          customerProfile={
            profile
              ? {
                  province: profile.province || "",
                  city: profile.city || "",
                  area: profile.area || "",
                }
              : null
          }
        />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}