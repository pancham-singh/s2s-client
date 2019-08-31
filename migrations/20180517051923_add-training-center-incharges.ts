import * as Knex from 'knex';

exports.up = async (knex: Knex): Promise<any> => {
  try {
    await knex.schema.createTable('training_center_incharges', (table) => {
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user.id');
      table
        .integer('training_center_id')
        .unsigned()
        .notNullable()
        .references('training_center.id');

      table.dateTime('valid_from').nullable();
      table.dateTime('valid_till').nullable();

      table.primary(['user_id', 'training_center_id']);
      table.timestamps(true, true);
    });

    console.log('Created table: training_center_incharges');
  } catch (err) {
    console.error('Error while creating training_center_incharge', err);
  }
};

exports.down = async (knex: Knex): Promise<any> => {
  try {
    await knex.schema.dropTable('training_center_incharges');
  } catch (err) {
    console.warn('Error while dropping training_center_incharges');
  }
};
