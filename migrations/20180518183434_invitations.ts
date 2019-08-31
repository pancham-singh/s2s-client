import * as Knex from 'knex';

exports.up = async (knex: Knex): Promise<any> => {
  try {
    await knex.schema.createTable('invitation', (table) => {
      table
        .increments('id')
        .notNullable()
        .primary();
      table
        .string('token')
        .notNullable()
        .unique();
      table.string('invited_email').notNullable();
      table
        .integer('invited_by_id')
        .unsigned()
        .notNullable()
        .references('user.id');
      table
        .integer('training_center_id')
        .unsigned()
        .notNullable()
        .references('training_center.id');
      table
        .integer('batch_id')
        .unsigned()
        .nullable()
        .references('batch.id');
      table.string('invited_as').notNullable();
      table.dateTime('valid_till').nullable();

      table.dateTime('deleted_at').defaultTo(null);
      table.timestamps(true, true);
    });

    console.log('Created table: invitation');
  } catch (err) {
    console.error('Error while creating invitation', err);
  }
};

exports.down = async (knex: Knex): Promise<any> => {
  try {
    await knex.schema.dropTable('invitation');
  } catch (err) {
    console.warn('Error while dropping invitation');
  }
};
