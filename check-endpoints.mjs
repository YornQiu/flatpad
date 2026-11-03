const urls = [
  'http://localhost:9090/',
  'http://localhost:9090/src/main.ts',
  'http://localhost:9091/apps/app1/index.html',
  'http://localhost:9091/apps/app1/src/main.ts',
  'http://localhost:9091/apps/app1/src/App.vue',
  'http://localhost:9092/apps/app2/index.html',
  'http://localhost:9092/apps/app2/src/main.ts',
];

for (const url of urls) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const text = await res.text();
    console.log(`${res.status} ${url} (${text.length} bytes)`);
  } catch (error) {
    console.log(`FAIL ${url} -> ${error.message}`);
  }
}
