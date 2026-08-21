import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const adminRoot = __dirname;
const publicRoot = resolve(__dirname, "../public");
const resumeDataPath = resolve(__dirname, "../public/resume-data.json");
const uploadRoot = resolve(__dirname, "../public/uploads");
const port = Number(process.env.PORT ?? 5180);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
};

function send(response, statusCode, body, contentType = "text/plain; charset=utf-8") {
  response.writeHead(statusCode, { "Content-Type": contentType });
  response.end(body);
}

function sanitizeFilename(filename) {
  const fallbackName = `upload-${Date.now()}.png`;
  const safeName = (filename || fallbackName)
    .replaceAll("\\", "-")
    .replaceAll("/", "-")
    .replaceAll(":", "-")
    .replaceAll("*", "-")
    .replaceAll("?", "-")
    .replaceAll('"', "-")
    .replaceAll("<", "-")
    .replaceAll(">", "-")
    .replaceAll("|", "-")
    .trim();

  return safeName || fallbackName;
}

function readBody(request) {
  return new Promise((resolveBody, rejectBody) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 40 * 1024 * 1024) {
        request.destroy();
        rejectBody(new Error("Payload too large"));
      }
    });

    request.on("end", () => resolveBody(body));
    request.on("error", rejectBody);
  });
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (url.pathname === "/api/resume-data" && request.method === "GET") {
      const data = await readFile(resumeDataPath, "utf8");
      send(response, 200, data, "application/json; charset=utf-8");
      return;
    }

    if (url.pathname === "/api/resume-data" && request.method === "POST") {
      const body = await readBody(request);
      const parsedData = JSON.parse(body);
      await writeFile(resumeDataPath, `${JSON.stringify(parsedData, null, 2)}\n`, "utf8");
      send(response, 200, JSON.stringify({ ok: true }), "application/json; charset=utf-8");
      return;
    }

    if (url.pathname === "/api/upload" && request.method === "POST") {
      const body = await readBody(request);
      const { filename, dataUrl } = JSON.parse(body);
      const safeFilename = sanitizeFilename(filename);
      const match = String(dataUrl).match(/^data:([^;]+);base64,(.+)$/);

      if (!match) {
        send(response, 400, JSON.stringify({ ok: false, error: "Invalid image data" }), "application/json; charset=utf-8");
        return;
      }

      await mkdir(uploadRoot, { recursive: true });
      await writeFile(resolve(uploadRoot, safeFilename), Buffer.from(match[2], "base64"));
      send(
        response,
        200,
        JSON.stringify({ ok: true, path: `/uploads/${encodeURIComponent(safeFilename)}` }),
        "application/json; charset=utf-8",
      );
      return;
    }

    if (url.pathname.startsWith("/uploads/")) {
      const uploadPath = resolve(publicRoot, `.${decodeURIComponent(url.pathname)}`);

      if (!uploadPath.startsWith(uploadRoot)) {
        send(response, 403, "Forbidden");
        return;
      }

      const file = await readFile(uploadPath);
      send(response, 200, file, mimeTypes[extname(uploadPath)] ?? "application/octet-stream");
      return;
    }

    const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
    const filePath = resolve(adminRoot, `.${pathname}`);

    if (!filePath.startsWith(adminRoot)) {
      send(response, 403, "Forbidden");
      return;
    }

    const file = await readFile(filePath);
    send(response, 200, file, mimeTypes[extname(filePath)] ?? "application/octet-stream");
  } catch (error) {
    const statusCode = error.code === "ENOENT" ? 404 : 500;
    send(response, statusCode, statusCode === 404 ? "Not found" : error.message);
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Resume admin running at http://127.0.0.1:${port}/`);
  console.log(`Writing data to ${resumeDataPath}`);
});
