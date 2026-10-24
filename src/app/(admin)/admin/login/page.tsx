import LoginForm from "@/components/admin/LoginForm";
import { authConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return <LoginForm configured={authConfigured()} />;
}
