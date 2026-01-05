import { spawn } from "node:child_process";
import net from "node:net";
import path from "node:path";

const PROJECT_NAME = "nordia.si_web";
const START_PORT = 3100;
const END_PORT = 3199;
const STARTUP_TIMEOUT_MS = 30_000;

function log(msg) {
  process.stdout.write(`[smoke] ${msg}\n`);
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
  });
}

async function findFreePort(start, end) {
  for (let port = start; port <= end; port += 1) {
    // eslint-disable-next-line no-await-in-loop
    if (await isPortFree(port)) return port;
  }
  throw new Error(`No free port found in range ${start}-${end}`);
}

async function waitForHttpOk(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (Date.now() > deadline) {
      throw new Error(`Timeout waiting for server: ${url}`);
    }
    try {
      const res = await fetch(url, { redirect: "follow" });
      if (res.ok) return;
    } catch {
      // ignore and retry
    }
    // eslint-disable-next-line no-await-in-loop
    await sleep(250);
  }
}

async function fetchAssert(url, { expectStatus = 200, expectContains } = {}) {
  const res = await fetch(url, { redirect: "follow" });
  if (res.status !== expectStatus) {
    throw new Error(`Expected ${expectStatus} for ${url}, got ${res.status}`);
  }
  const text = await res.text();
  if (expectContains && !text.includes(expectContains)) {
    throw new Error(`Expected response for ${url} to include "${expectContains}"`);
  }
}

async function stopProcess(proc) {
  if (!proc || proc.killed) return;
  proc.kill("SIGTERM");

  const exited = await Promise.race([
    new Promise((resolve) => proc.once("exit", resolve)),
    sleep(5_000).then(() => false),
  ]);

  if (exited === false) {
    proc.kill("SIGKILL");
  }
}

async function main() {
  const port = await findFreePort(START_PORT, END_PORT);
  const urlBase = `http://localhost:${port}`;

  log(`Starting production server on ${urlBase}`);

  const nextBin =
    process.platform === "win32"
      ? path.join("node_modules", ".bin", "next.cmd")
      : path.join("node_modules", ".bin", "next");

  const proc = spawn(
    nextBin,
    ["start", "-p", String(port)],
    {
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, NODE_ENV: "production" },
    }
  );

  proc.stdout.on("data", (d) => process.stdout.write(String(d)));
  proc.stderr.on("data", (d) => process.stderr.write(String(d)));

  try {
    await waitForHttpOk(`${urlBase}/`, STARTUP_TIMEOUT_MS);

    log("Checking critical routes…");
    await fetchAssert(`${urlBase}/`, { expectStatus: 200, expectContains: "Nordia" });
    await fetchAssert(`${urlBase}/zasebnost`, { expectStatus: 200 });
    await fetchAssert(`${urlBase}/robots.txt`, { expectStatus: 200 });
    await fetchAssert(`${urlBase}/sitemap.xml`, { expectStatus: 200 });

    log(`OK — ${PROJECT_NAME} smoke test passed`);
  } finally {
    await stopProcess(proc);
  }
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(`[smoke] FAILED: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});


