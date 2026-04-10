import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE, verifyAdminCookie } from "@/lib/admin-session";
import { AdminDashboard } from "./AdminDashboard";

export default async function AdminPage() {
  const token = cookies().get(ADMIN_COOKIE)?.value;
  const pwd = process.env.ADMIN_PASSWORD?.trim();
  const ok = await verifyAdminCookie(token, pwd);
  if (!ok) {
    redirect("/admin/login?from=%2Fadmin");
  }
  return <AdminDashboard />;
}
