import * as Knex from 'knex';

exports.up = async (knex: Knex): Promise<any> => {
  await knex.schema.table('assessment', (table) => {
    // rename column because objection models and columns can not be of same name
    table.renameColumn('created_by', 'created_by_id');

    // remove course-id because it can be fetched from batch
    table.dropForeign(['course_id']);
    table.dropColumn('course_id');

    // remove is-public because client says assessments will never be public
    table.dropColumn('is_public');

    // assessments are assigned to batches. Every batch has a different assessment
    table
      .integer('batch_id')
      .unsigned()
      .notNullable()
      .references('batch.id');
  });

  await knex.schema.table('user_assessments', (table) => {
    table
      .timestamp('started_at')
      .nullable()
      .defaultTo(knex.fn.now());
  });
};

exports.down = async (knex: Knex): Promise<any> => {
  await knex.schema.table('assessment', (table) => {
    table
      .boolean('is_public')
      .notNullable()
      .defaultTo(false);
    table
      .integer('course_id')
      .unsigned()
      .notNullable()
      .references('course.id');

    table.dropColumn('batch_id');
  });
};
