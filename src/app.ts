import env from "#config/env/env.js";
import knex, { migrate, seed } from "#postgres/knex.js";
import { loadGoogleSpreadsheetInfo } from "#services/spreadsheetsDataExport.js";
import { scheduleTariffsDataFetch } from "./services/tariffsData.js";
await migrate.latest();
await seed.run();

console.log("All migrations and seeds have been run");

await scheduleTariffsDataFetch();

await loadGoogleSpreadsheetInfo(env.SPREADSHEET_ID);