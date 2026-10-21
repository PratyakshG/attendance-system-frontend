import AdminDashboard from "@/components/AdminDashboard";
import Header from "@/components/Header";
import { DashboardLoadingSkeleton } from "@/components/LoadingSkeleton";
import { getCurrentUser } from "@/lib/session";
import { Suspense } from "react";

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <section className="relative h-full flex flex-col gap-2">
      <Header user={user} />

      <Suspense fallback={<DashboardLoadingSkeleton />}>
        <AdminDashboard />
      </Suspense>
    </section>
  );
}
