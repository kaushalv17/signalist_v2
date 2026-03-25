import 'dotenv/config';

const API_KEY = process.env.FINNHUB_API_KEY;

async function fetchPrice() {
  await fetch(
    `https://finnhub.io/api/v1/quote?symbol=MSFT&token=${API_KEY}`
  );
}

async function run() {
  const totalRequests = 50;

  const start = Date.now();

  for (let i = 0; i < totalRequests; i++) {
    await fetchPrice();
  }

  const end = Date.now();

  const duration = (end - start) / 1000;

  console.log(`Total requests: ${totalRequests}`);
  console.log(`Time taken: ${duration}s`);
  console.log(`Throughput: ${(totalRequests / duration).toFixed(2)} req/sec`);
}

run();