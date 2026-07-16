import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 });
    }

    const githubPat = process.env.GITHUB_PAT;
    const githubRepo = process.env.GITHUB_REPO || "saymanlal/layerz-data";
    const branch = process.env.GITHUB_BRANCH || "main";

    let authenticated = false;
    let accessList: any[] = [];
    let isFallback = false;
    let warningMsg = "";

    if (githubPat) {
      // Try root first, then src/data/
      const pathsToTry = ["access.json", "src/data/access.json"];
      let accessFileFound = false;

      for (const filePath of pathsToTry) {
        try {
          const url = `https://api.github.com/repos/${githubRepo}/contents/${filePath}?ref=${branch}`;
          const res = await fetch(url, {
            headers: {
              "Authorization": `token ${githubPat}`,
              "Accept": "application/vnd.github.v3.raw",
              "User-Agent": "Layerz-CMS"
            },
            next: { revalidate: 0 } // Always bypass cache for auth credentials
          });

          if (res.status === 200) {
            const text = await res.text();
            accessList = JSON.parse(text);
            accessFileFound = true;
            break;
          }
        } catch (err) {
          console.error(`Failed to fetch auth credentials from ${filePath}:`, err);
        }
      }

      if (accessFileFound) {
        // Find matching credentials
        const match = accessList.find(
          (user: any) => user.email === email && user.password === password
        );
        if (match) {
          authenticated = true;
        }
      } else {
        // Fallback if access.json is missing on the private repo
        isFallback = true;
        warningMsg = `access.json was not found in the private repository '${githubRepo}'. Using default system credentials.`;
        if (email === "admin@layerz.xyz" && password === "layerz-admin-2026") {
          authenticated = true;
        }
      }
    } else {
      // Local development or unconfigured env: allow default admin credentials
      isFallback = true;
      warningMsg = "GITHUB_PAT is not configured in environment variables. Using default system credentials.";
      if (email === "admin@layerz.xyz" && password === "layerz-admin-2026") {
        authenticated = true;
      }
    }

    if (authenticated) {
      // Set a session cookie
      const response = NextResponse.json({
        success: true,
        message: "Authentication successful",
        warning: warningMsg || undefined,
        isFallback
      });

      // Simple session cookie, HTTPOnly for security
      response.cookies.set("layerz_session", "authenticated", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 // 1 day
      });

      return response;
    }

    return NextResponse.json({
      success: false,
      error: "Invalid email or password credentials."
    }, { status: 401 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Authentication error" }, { status: 500 });
  }
}
