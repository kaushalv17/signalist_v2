import 'dotenv/config';

const API_KEY = process.env.FINNHUB_API_KEY;

async function testLatency(symbol: string) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`;

  const start = Date.now();

  const res = await fetch(url);
  await res.json();

  const end = Date.now();

  return end - start;
}

async function runTest() {
  const symbols = ["AAPL", "TSLA", "MSFT", "GOOGL", "AMZN"];

  console.log("Running latency test...\n");

  const results = await Promise.all(
    symbols.map(async (sym) => {
      const latency = await testLatency(sym);
      console.log(`${sym}: ${latency} ms`);
      return latency;
    })
  );

  const avg =
    results.reduce((a, b) => a + b, 0) / results.length;

  console.log(`\nAverage latency: ${avg.toFixed(2)} ms`);
}

runTest();