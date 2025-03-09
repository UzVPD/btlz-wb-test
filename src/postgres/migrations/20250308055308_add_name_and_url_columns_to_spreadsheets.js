/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.alterTable('spreadsheets', function(table) {
    table.string('spreadsheet_name').notNullable();
    table.string('spreadsheet_url').unique().notNullable();
  });;
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.alterTable('spreadsheets', function(table) {
    table.dropColumn('spreadsheet_name');
    table.dropColumn('spreadsheet_url');
  });;
}
