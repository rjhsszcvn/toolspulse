import sharp from "sharp";
import fs from "fs";
import path from "path";

const svgBuffer = fs.readFileSync("public/icon.svg");

const sizes = [
  { size: 16, name: "favicon-16x16.png" },
  { size: 32, name: "favicon-32x32.png" },
  { size: 48, name: "favicon-48x48.png" },
  { size: 96, name: "favicon-96x96.png" },
  { size: 180, name: "apple-touch-icon.png" },
  { size: 192, name: "android-chrome-192x192.png" },
  { size: 512, name: "android-chrome-512x512.png" },
];

async function generate() {
  for (const { size, name } of sizes) {
    await sharp(svgBuffer).resize(size, size).png().toFile(path.join("public", name));
    console.log("Generated " + name);
  }
  await sharp(svgBuffer).resize(32, 32).png().toFile("src/app/favicon.ico");
  console.log("Generated favicon.ico");
  console.log("All favicons generated!");
}

generate().catch(console.error);
