import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { filePath, content, commitMessage, pat, repo } = body;

    if (!filePath || !content) {
      return NextResponse.json({ error: "Missing filePath or content" }, { status: 400 });
    }

    const cleanFilePath = filePath.replace(/^\//, ""); // remove leading slash
    const msg = commitMessage || `admin: update ${cleanFilePath}`;

    // 1. If in development, write to local file system
    let localWriteSuccess = false;
    if (process.env.NODE_ENV === "development") {
      try {
        const fullLocalPath = path.join(process.cwd(), cleanFilePath);
        // Ensure directory exists
        const dir = path.dirname(fullLocalPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(fullLocalPath, content, "utf8");
        localWriteSuccess = true;
      } catch (err: any) {
        console.error("Local file system write failed:", err);
      }
    }

    // 2. If GitHub credentials are provided (either in request or in env), commit to GitHub
    const githubPat = pat || process.env.GITHUB_PAT;
    const githubRepo = repo || process.env.GITHUB_REPO; // e.g. "krushn/layerz-data" or "krushn/layerz"

    let githubSuccess = false;
    let githubErrorMsg = "";

    if (githubPat && githubRepo) {
      try {
        const url = `https://api.github.com/repos/${githubRepo}/contents/${cleanFilePath}`;
        
        // Step A: Get current file SHA if it exists
        const getRes = await fetch(url, {
          method: "GET",
          headers: {
            "Authorization": `token ${githubPat}`,
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Layerz-CMS"
          }
        });

        let sha: string | undefined;
        if (getRes.status === 200) {
          const getJson = await getRes.json();
          sha = getJson.sha;
        }

        // Step B: Push updated content (base64 encoded)
        const base64Content = Buffer.from(content, "utf8").toString("base64");
        
        const putRes = await fetch(url, {
          method: "PUT",
          headers: {
            "Authorization": `token ${githubPat}`,
            "Content-Type": "application/json",
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Layerz-CMS"
          },
          body: JSON.stringify({
            message: msg,
            content: base64Content,
            sha: sha // required to update an existing file
          })
        });

        if (putRes.status === 200 || putRes.status === 201) {
          githubSuccess = true;
        } else {
          const putErr = await putRes.json();
          githubErrorMsg = putErr.message || "Failed to push to GitHub";
        }
      } catch (err: any) {
        githubErrorMsg = err.message || "GitHub API connection error";
      }
    }

    // Determine overall result
    if (process.env.NODE_ENV === "development" && localWriteSuccess) {
      return NextResponse.json({
        success: true,
        message: "Saved successfully to local file system" + (githubSuccess ? " and pushed to GitHub" : ""),
        githubPushed: githubSuccess,
        githubError: githubErrorMsg || undefined
      });
    }

    if (githubSuccess) {
      return NextResponse.json({
        success: true,
        message: "Successfully committed to GitHub repository",
        githubPushed: true
      });
    }

    // If GitHub was attempted but failed, or no GitHub configured in production
    if (githubPat && githubRepo) {
      return NextResponse.json({
        success: false,
        error: `GitHub sync failed: ${githubErrorMsg}`
      }, { status: 500 });
    }

    return NextResponse.json({
      success: false,
      error: "No GitHub credentials provided. Please configure GITHUB_PAT and GITHUB_REPO or provide a PAT in the admin panel."
    }, { status: 400 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
