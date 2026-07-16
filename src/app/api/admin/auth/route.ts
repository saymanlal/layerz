import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

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

    // 1. Try fetching access.json from private GitHub repo first if PAT is configured
    if (githubPat) {
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
            next: { revalidate: 0 } // Always bypass cache for auth
          });

          if (res.status === 200) {
            const text = await res.text();
            accessList = JSON.parse(text);
            accessFileFound = true;
            break;
          }
        } catch (err) {
          console.error(`Failed to fetch auth credentials from GitHub ${filePath}:`, err);
        }
      }

      if (accessFileFound && accessList.length > 0) {
        const match = accessList.find(
          (user: any) => user.email === email && user.password === password
        );
        if (match) {
          authenticated = true;
        }
      }
    }

    // 2. Double fallback: Check local src/data/access.json if GitHub query didn't match or was bypassed
    if (!authenticated) {
      try {
        const localPath = path.join(process.cwd(), "src", "data", "access.json");
        if (fs.existsSync(localPath)) {
          const text = fs.readFileSync(localPath, "utf8");
          const localAccessList = JSON.parse(text);
          const match = localAccessList.find(
            (user: any) => user.email === email && user.password === password
          );
          if (match) {
            authenticated = true;
            isFallback = true;
            warningMsg = "Authenticated via local fallback credentials registry.";
          }
        }
      } catch (err) {
        console.error("Failed to read local credentials registry fallback:", err);
      }
    }

    // 3. Last resort hardcoded fallback if everything else fails
    if (!authenticated) {
      if (email === "admin@layerz.xyz" && password === "layerz-admin-2026") {
        authenticated = true;
        isFallback = true;
        warningMsg = "Authenticated via hardcoded root credentials.";
      }
    }

    if (authenticated) {
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

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.set("layerz_session", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0)
  });
  return response;
}
