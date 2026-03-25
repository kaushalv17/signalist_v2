import 'dotenv/config';

const API_KEY = process.env.FINNHUB_API_KEY;

async function hitAPI() {
  const res = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=AAPL&token=${API_KEY}`
  );
  return res.json();
}

async function run() {
  const requests = 20;

  const start = Date.now();

  await Promise.all(
    Array.from({ length: requests }).map(() => hitAPI())
  );

  const end = Date.now();

  console.log(`Handled ${requests} concurrent requests in ${end - start} ms`);
  console.log(
    `Throughput: ${(requests / ((end - start) / 1000)).toFixed(2)} req/sec`
  );
}

run();