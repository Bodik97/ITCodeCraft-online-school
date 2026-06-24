// Recompress an oversized image under public/assets in place (keeps format).
// Called by the PostToolUse hook in .claude/settings.json whenever an image is
// written, so heavy source art never ships unoptimized. Safe by design:
// keeps the same file/format (no rename, no deletion) and only writes if smaller.
import sharp from "sharp";
import fs from "fs";

const file = process.argv[2];
const THRESHOLD = 120 * 1024; // only touch images larger than ~120 KB
const MAX_WIDTH = 1280;

if (!file || !fs.existsSync(file)) process.exit(0);
if (!/public\/assets\//.test(file)) process.exit(0); // scope to project assets
if (/\/(favicon|OGP)\//.test(file)) process.exit(0); // leave icons / social images

const before = fs.statSync(file).size;
if (before <= THRESHOLD) process.exit(0);

const ext = file.toLowerCase().split(".").pop();
const pipeline = sharp(file).resize({ width: MAX_WIDTH, withoutEnlargement: true });

let encoder;
if (ext === "webp") encoder = pipeline.webp({ quality: 80, effort: 6 });
else if (ext === "png") encoder = pipeline.png({ compressionLevel: 9, palette: true });
else if (ext === "jpg" || ext === "jpeg") encoder = pipeline.jpeg({ quality: 80, mozjpeg: true });
else process.exit(0);

const buf = await encoder.toBuffer();
if (buf.length < before) {
  fs.writeFileSync(file, buf);
  console.log(
    `[compress-image] ${Math.round(before / 1024)}K → ${Math.round(buf.length / 1024)}K  ${file}`,
  );
}
