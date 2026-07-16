import fs from "fs";
import path from "path";

export async function getEcosystemData<T>(fileName: string): Promise<T[]> {
  const repo = process.env.GITHUB_REPO || "saymanlal/layerz-data";
  const pat = process.env.GITHUB_PAT;
  const branch = process.env.GITHUB_BRANCH || "main";

  // If PAT exists, fetch from GitHub for real-time updates on Vercel
  if (pat) {
    // Try root of data repo first, then src/data/
    const pathsToTry = [fileName, `src/data/${fileName}`];
    
    for (const filePath of pathsToTry) {
      try {
        const url = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`;
        
        const res = await fetch(url, {
          headers: {
            "Authorization": `token ${pat}`,
            "Accept": "application/vnd.github.v3.raw",
            "User-Agent": "Layerz-App"
          },
          next: { revalidate: 15 } // cache for 15 seconds to avoid limit exhaust
        });

        if (res.status === 200) {
          const text = await res.text();
          return JSON.parse(text) as T[];
        }
      } catch (err) {
        console.error(`Failed to fetch ${filePath} from GitHub:`, err);
      }
    }
  }

  // Fallback: Read from local filesystem
  try {
    const localPath = path.join(process.cwd(), "src", "data", fileName);
    if (fs.existsSync(localPath)) {
      const data = fs.readFileSync(localPath, "utf8");
      return JSON.parse(data) as T[];
    }
  } catch (err) {
    console.error(`Failed to read local ${fileName}:`, err);
  }

  // Double fallback: import local data if everything else fails
  try {
    const fallbackData = require(`@/data/${fileName}`);
    return fallbackData as T[];
  } catch (err) {
    console.error(`Failed to require fallback data for ${fileName}:`, err);
    return [] as T[];
  }
}

