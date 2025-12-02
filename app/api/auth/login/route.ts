import { NextResponse } from "next/server";

export async function POST() {
  
  try {
    // 👇 call your external API to get auth token
    const apiRes = await fetch("https://autobizz-425913.uc.r.appspot.com/getAuthorize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // send anything your API requires
        tokenType : "frontEndTest"
      }),
    });

    const data = await apiRes.json();
    console.log(data);
    const token = data?.token;

    if (!token) {
      return NextResponse.json(
        { error: "Token not found" },
        { status: 401 }
      );
    }

    // ✔ Save token in cookie
    const response = NextResponse.json({ success: true });

    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });

    return response;
    
  } catch (err) {
    console.log("Login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
