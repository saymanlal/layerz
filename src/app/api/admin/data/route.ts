import { NextResponse } from "next/server";
import { getEcosystemData } from "@/utils/getData";
import fs from "fs";
import path from "path";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileName = searchParams.get("file");
    const forceLocal = searchParams.get("local") === "true";

    if (!fileName) {
      return NextResponse.json({ error: "Missing file parameter" }, { status: 400 });
    }

    // Validate filename to prevent directory traversal
    const safePattern = /^[a-z0-9_-]+\.json$/i;
    if (!safePattern.test(fileName)) {
      return NextResponse.json({ error: "Invalid file name format" }, { status: 400 });
    }

    if (forceLocal) {
      const localPath = path.join(process.cwd(), "src", "data", fileName);
      if (fs.existsSync(localPath)) {
        const text = fs.readFileSync(localPath, "utf8");
        return NextResponse.json(JSON.parse(text));
      }
      return NextResponse.json({ error: "Local file not found" }, { status: 404 });
    }

    const data = await getEcosystemData(fileName);
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Failed to load data";
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
