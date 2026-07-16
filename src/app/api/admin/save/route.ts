import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    // Security check: Verify session cookie
    const cookieStore = await cookies();
    const session = cookieStore.get("layerz_session");
    if (!session || session.value !== "authenticated") {
      return NextResponse.json({ error: "Unauthorized access. Please log in." }, { status: 401 });
    }

    const body = await request.json();
    const { filePath, content, commitMessage, pat, repo } = body;


    if (!filePath || !content) {
      return NextResponse.json({ error: "Missing filePath or content" }, { status: 400 });
    }

    const cleanFileName = path.basename(filePath);
    const msg = commitMessage || `admin: update ${cleanFileName}`;

    // 1. If in development, write to local file system in the website project
    let localWriteSuccess = false;
    if (process.env.NODE_ENV === "development") {
      try {
        const fullLocalPath = path.join(process.cwd(), "src", "data", cleanFileName);
        // Ensure directory exists
        const dir = path.dirname(fullLocalPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(fullLocalPath, content, "utf8");
        localWriteSuccess = true;
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Unknown local write error";
        console.error("Local file system write failed:", errMsg);
      }
    }

    // 2. Commit to GitHub (private data repository)
    const githubPat = pat || process.env.GITHUB_PAT;
    const githubRepo = repo || process.env.GITHUB_REPO || "saymanlal/layerz-data";
    const branch = process.env.GITHUB_BRANCH || "main";

    let githubSuccess = false;
    let githubErrorMsg = "";

    if (githubPat && githubRepo) {
      try {
        // Resolve whether file is in root or src/data/ on the Github repo
        let resolvedPath = cleanFileName; // Default to root
        
        // Check if file exists in src/data/ on Github first
        const checkUrl = `https://api.github.com/repos/${githubRepo}/contents/src/data/${cleanFileName}?ref=${branch}`;
        const checkRes = await fetch(checkUrl, {
          method: "GET",
          headers: {
            "Authorization": `token ${githubPat}`,
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "Layerz-CMS"
          }
        });

        if (checkRes.status === 200) {
          resolvedPath = `src/data/${cleanFileName}`;
        }

        const url = `https://api.github.com/repos/${githubRepo}/contents/${resolvedPath}`;
        
        // Step A: Get current file SHA to perform the update
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
            sha: sha,
            branch
          })
        });

        if (putRes.status === 200 || putRes.status === 201) {
          githubSuccess = true;
        } else {
          const putErr = await putRes.json();
          githubErrorMsg = putErr.message || "Failed to push to GitHub";
        }
      } catch (err: unknown) {
        githubErrorMsg = err instanceof Error ? err.message : "GitHub API connection error";
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

    if (githubPat && githubRepo) {
      return NextResponse.json({
        success: false,
        error: `GitHub sync failed: ${githubErrorMsg}`
      }, { status: 500 });
    }

    return NextResponse.json({
      success: false,
      error: "No GitHub credentials configured. Please set GITHUB_PAT and GITHUB_REPO."
    }, { status: 400 });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
