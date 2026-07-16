import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { pat, repo } = await request.json();

    if (!pat) {
      return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    // Call GitHub API to verify the token is valid
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        "Authorization": `token ${pat}`,
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "Layerz-CMS"
      }
    });

    if (userRes.status !== 200) {
      return NextResponse.json({ success: false, error: "Invalid Personal Access Token (PAT)" }, { status: 401 });
    }

    const userData = await userRes.json();

    // Optionally check if they have access to the repo
    if (repo) {
      const repoRes = await fetch(`https://api.github.com/repos/${repo}`, {
        headers: {
          "Authorization": `token ${pat}`,
          "Accept": "application/vnd.github.v3+json",
          "User-Agent": "Layerz-CMS"
        }
      });

      if (repoRes.status !== 200) {
        return NextResponse.json({ 
          success: true, 
          username: userData.login,
          warning: `Token is valid, but could not access repository '${repo}'. Please verify the repository exists and your token has permissions for it.` 
        });
      }
    }

    return NextResponse.json({
      success: true,
      username: userData.login,
      message: "Authentication successful"
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Authentication error" }, { status: 500 });
  }
}
