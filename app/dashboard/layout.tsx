import { cookies } from "next/headers";
import { DashboardProvider } from "./context";

async function getToken() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value ?? "";
    return token;
  
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();
  console.log(token);
  return <DashboardProvider value={{ token }}>{children}</DashboardProvider>;
}
