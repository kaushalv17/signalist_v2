import 'dotenv/config';

const API_KEY = process.env.FINNHUB_API_KEY;

async function fetchStock() {
  await fetch(
    `https://finnhub.io/api/v1/quote?symbol=TSLA&token=${API_KEY}`
  );
}

async function sequentialTest() {
  const start = Date.now();

  for (let i = 0; i < 10; i++) {
    await fetchStock();
  }

  const end = Date.now();
  console.log(`Sequential time: ${end - start} ms`);
}

async function parallelTest() {
  const start = Date.now();

  await Promise.all(
    Array.from({ length: 10 }).map(() => fetchStock())
  );

  const end = Date.now();
  console.log(`Parallel time: ${end - start} ms`);
}

async function run() {
  await sequentialTest();
  await parallelTest();
}

run();