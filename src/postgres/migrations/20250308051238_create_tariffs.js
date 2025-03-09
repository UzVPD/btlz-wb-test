/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable('tariffs', function(table) {
    table.increments('id').primary();
    table.date('date').notNullable();
    table.timestamp('date_and_time', {useTz: true}).notNullable();
    table.string('box_delivery_and_storage_expr').notNullable();
    table.string('box_delivery_base').notNullable();
    table.string('box_delivery_liter').notNullable();
    table.string('box_storage_base').nullable();
    table.string('box_storage_liter').nullable();
    table.string('warehouse_name').notNullable();
    table.unique(['warehouse_name', 'date']);
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable('tariffs');
}
