import * as Knex from 'knex';

exports.up = async (knex: Knex): Promise<any> => {
  // table to store user's submissions
  await knex.schema.createTable('user_submissions', (table) => {
    table
      .integer('user_id')
      .unsigned()
      .notNullable()
      .references('user.id');
    table
      .integer('assessment_id')
      .unsigned()
      .notNullable()
      .references('assessment.id');
    table
      .integer('question_id')
      .unsigned()
      .notNullable()
      .references('question.id');
    table
      .integer('answer_id')
      .unsigned()
      .notNullable()
      .references('answer.id');

    table.primary(['user_id', 'assessment_id', 'question_id']);
  });
  console.log('Created table: user_submissions');
};

exports.down = async (knex: Knex): Promise<any> => {
  await knex.schema.dropTable('user_submissions');
};
