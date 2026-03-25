import 'dotenv/config';

const API_KEY = process.env.FINNHUB_API_KEY;

async function run() {
  const requests = 50;

  console.log(`Running stress test with ${requests} requests`);

  const start = Date.now();

  await Promise.all(
    Array.from({ length: requests }).map(() =>
      fetch(
        `https://finnhub.io/api/v1/quote?symbol=AAPL&token=${API_KEY}`
      )
    )
  );

  const end = Date.now();

  console.log(`Total time: ${end - start} ms`);
}

run();