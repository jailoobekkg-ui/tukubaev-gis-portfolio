import { redirect } from "next/navigation";
import AdminApp from "@/components/admin/AdminApp";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  // Middleware already guards /admin; this check keeps the page safe if the matcher changes.
  if (!(await isAdmin())) redirect("/admin/login");
  return <AdminApp />;
}
