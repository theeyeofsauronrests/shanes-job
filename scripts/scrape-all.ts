import {
  getScrapeCountsByCompany,
  scrapeConfiguredJobBoards,
  writeScrapeOutput,
} from './scrape-job-boards';

async function scrapeAll(): Promise<void> {
  console.log('Shane\'s Job List - public board scraper');
  console.log('Collecting Product, Design, and Engineering roles.\n');

  const output = await scrapeConfiguredJobBoards();
  writeScrapeOutput(output);

  console.log('Scrape summary');
  console.log(`Total matching roles: ${output.data.jobs.length}`);

  const counts = getScrapeCountsByCompany(output.data.jobs);
  Object.entries(counts).forEach(([company, count]) => {
    console.log(`- ${company}: ${count}`);
  });

  if (output.metadata.warnings.length > 0) {
    console.log('\nWarnings');
    output.metadata.warnings.forEach((warning) => {
      console.log(`- ${warning}`);
    });
  }

  console.log('\nSaved public/jobs.json and public/api/*.json');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  scrapeAll()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Fatal scrape error:', error);
      process.exit(1);
    });
}
