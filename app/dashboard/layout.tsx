import { cookies } from "next/headers";
import { DashboardProvider } from "./context";

async function getDashboardData() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value ?? "";

  // Default filters (layout cannot read searchParams)
  // const startDate = "2025-01-01";
  // const endDate = "2025-01-01";
  // const email = "";
  // const phone = "";
  // const priceMin = "";
  // const sortBy = "date";
  // const sortOrder = "asc";

  // const url =
  //   `https://autobizz-425913.uc.r.appspot.com/sales` +
  //   `?startDate=${startDate}&endDate=${endDate}&priceMin=${priceMin}` +
  //   `&email=${email}&phone=${phone}&sortBy=${sortBy}&sortOrder=${sortOrder}`;

  // try {
  //   const res = await fetch(url, {
  //     headers: {
  //       "X-AUTOBIZZ-TOKEN": token,
  //     },
  //     cache: "no-store",
  //   });

  //   if (!res.ok) {
  //     return { error: true, message: "Failed to fetch dashboard data" };
  //   }

  //   const data = await res.json();
    return token;
  // } catch (err) {
  //   return { error: true, message: "Fetch failed" };
  // }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = await getDashboardData();
  console.log(token);
  return <DashboardProvider value={{ token }}>{children}</DashboardProvider>;
}
