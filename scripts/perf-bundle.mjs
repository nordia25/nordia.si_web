import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

function formatBytes(bytes) {
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

function readFileSafe(p) {
  try {
    return fs.readFileSync(p);
  } catch {
    return null;
  }
}

function main() {
  const chunksDir = path.resolve(".next", "static", "chunks");
  if (!fs.existsSync(chunksDir)) {
     
    console.error(
      `[perf:bundle] Missing ${chunksDir}. Run \`npm run build\` first.`
    );
    process.exit(1);
  }

  const files = fs
    .readdirSync(chunksDir)
    .filter((f) => f.endsWith(".js"))
    .sort();

  const rows = [];
  for (const file of files) {
    const full = path.join(chunksDir, file);
    const buf = readFileSafe(full);
    if (!buf) continue;

    const gzip = zlib.gzipSync(buf, { level: 9 });
    const br = zlib.brotliCompressSync(buf, {
      params: {
        [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
      },
    });

    rows.push({
      file,
      raw: buf.length,
      gzip: gzip.length,
      brotli: br.length,
    });
  }

  const totals = rows.reduce(
    (acc, r) => {
      acc.raw += r.raw;
      acc.gzip += r.gzip;
      acc.brotli += r.brotli;
      return acc;
    },
    { raw: 0, gzip: 0, brotli: 0 }
  );

  const top = [...rows]
    .sort((a, b) => b.brotli - a.brotli)
    .slice(0, 10);

   
  console.log(`[perf:bundle] Files: ${rows.length}`);
   
  console.log(
    `[perf:bundle] Total (raw):    ${formatBytes(totals.raw)}\n` +
      `[perf:bundle] Total (gzip):   ${formatBytes(totals.gzip)}\n` +
      `[perf:bundle] Total (brotli): ${formatBytes(totals.brotli)}`
  );

   
  console.log("\n[perf:bundle] Top 10 by brotli size:");
  for (const r of top) {
     
    console.log(
      `- ${r.file}: raw ${formatBytes(r.raw)}, gzip ${formatBytes(
        r.gzip
      )}, brotli ${formatBytes(r.brotli)}`
    );
  }
}

main();


