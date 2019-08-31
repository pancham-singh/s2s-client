import * as Knex from 'knex';

exports.up = async (knex: Knex) => {
  try {
    await knex.schema.createTable('user', (table) => {
      table
        .increments('id')
        .notNullable()
        .primary();
      table.string('name');
      table.string('profile_pic');
      table
        .string('email')
        .notNullable()
        .unique();
      table.string('password');

      table.dateTime('deleted_at').defaultTo(null);
      table.timestamps(true, true);
    });
    console.log('Created table: user');

    await knex.schema.createTable('role', (table) => {
      table
        .increments('id')
        .notNullable()
        .primary();
      table.string('name').notNullable();
      table
        .boolean('is_active')
        .notNullable()
        .defaultTo(false);
      table.string('description').notNullable();

      table.dateTime('deleted_at').defaultTo(null);
      table.timestamps(true, true);
    });
    console.log('Created table: role');

    await knex.schema.createTable('permission', (table) => {
      table
        .increments('id')
        .notNullable()
        .primary();
      table.string('name').notNullable();
      table.string('description').notNullable();

      table.dateTime('deleted_at').defaultTo(null);
      table.timestamps(true, true);
    });
    console.log('Created table: permission');

    await knex.schema.createTable('user_roles', (table) => {
      table
        .integer('role_id')
        .unsigned()
        .notNullable()
        .references('role.id');
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user.id');
      table.dateTime('valid_from').nullable();
      table.dateTime('valid_till').nullable();

      table.primary(['role_id', 'user_id']);
      table.timestamps(true, true);
    });
    console.log('Created table: user_roles');

    await knex.schema.createTable('role_permissions', (table) => {
      table
        .integer('role_id')
        .unsigned()
        .notNullable()
        .references('role.id');
      table
        .integer('permission_id')
        .unsigned()
        .notNullable()
        .references('permission.id');

      table.primary(['role_id', 'permission_id']);
      table.timestamps(true, true);
    });
    console.log('Created table: role_permissions');

    await knex.schema.createTable('course', (table) => {
      table
        .increments('id')
        .notNullable()
        .primary();
      table.string('name').notNullable();
      table.string('description');
      table.string('icon');
      table.string('cover_image');
      table.string('category');

      table.dateTime('deleted_at').defaultTo(null);
      table.timestamps(true, true);
    });
    console.log('Created table: course');

    await knex.schema.createTable('module', (table) => {
      table
        .increments('id')
        .notNullable()
        .primary();
      table.string('name').notNullable();
      table.string('description');
      table.string('icon');
      table.string('cover_image');
      table
        .integer('course_id')
        .unsigned()
        .notNullable()
        .references('course.id');

      table.dateTime('deleted_at').defaultTo(null);
      table.timestamps(true, true);
    });
    console.log('Created table: module');

    await knex.schema.createTable('topic', (table) => {
      table
        .increments('id')
        .notNullable()
        .primary();
      table.string('name').notNullable();
      table.string('description');
      table.string('icon');
      table.string('cover_image');
      table.integer('points_practical');
      table.integer('points_theory');
      table
        .integer('module_id')
        .unsigned()
        .notNullable()
        .references('module.id');

      table.dateTime('deleted_at').defaultTo(null);
      table.timestamps(true, true);
    });
    console.log('Created table: topic');

    await knex.schema.createTable('question', (table) => {
      table
        .increments('id')
        .notNullable()
        .primary();
      table.string('body').notNullable();
      table
        .integer('points')
        .notNullable()
        .defaultTo(0);
      table.enum('type', ['theory', 'practical']);
      table
        .integer('topic_id')
        .unsigned()
        .notNullable()
        .references('topic.id');

      table.dateTime('deleted_at').defaultTo(null);
      table.timestamps(true, true);
    });
    console.log('Created table: question');

    await knex.schema.createTable('answer', (table) => {
      table
        .increments('id')
        .notNullable()
        .primary();
      table.string('body').notNullable();
      table
        .boolean('is_correct')
        .notNullable()
        .defaultTo(false);
      table
        .integer('question_id')
        .unsigned()
        .notNullable()
        .references('question.id');

      table.dateTime('deleted_at').defaultTo(null);
      table.timestamps(true, true);
    });
    console.log('Created table: answer');

    await knex.schema.createTable('training_center', (table) => {
      table
        .increments('id')
        .notNullable()
        .primary();
      table.string('name').notNullable();
      table.string('address');
      table.specificType('coordinates', 'POINT');
      table
        .integer('pia_id')
        .unsigned()
        .notNullable()
        .references('user.id');

      table.dateTime('deleted_at').defaultTo(null);
      table.timestamps(true, true);
    });
    console.log('Created table: training_center');

    await knex.schema.createTable('batch', (table) => {
      table
        .increments('id')
        .notNullable()
        .primary();
      table.string('name').notNullable();
      table.date('start_date').notNullable();
      table.date('end_date').notNullable();
      table
        .integer('course_id')
        .unsigned()
        .notNullable()
        .references('course.id');
      table
        .integer('training_center_id')
        .unsigned()
        .notNullable()
        .references('training_center.id');

      table.dateTime('deleted_at').defaultTo(null);
      table.timestamps(true, true);
    });
    console.log('Created table: batch');

    await knex.schema.createTable('user_batches', (table) => {
      table.enum('role', ['student', 'teacher']);
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user.id');
      table
        .integer('batch_id')
        .unsigned()
        .notNullable()
        .references('batch.id');

      table.primary(['user_id', 'batch_id']);
      table.dateTime('deleted_at').defaultTo(null);
      table.timestamps(true, true);
    });
    console.log('Created table: user_batches');

    await knex.schema.createTable('assessment', (table) => {
      table
        .increments('id')
        .notNullable()
        .primary();
      table.string('name').notNullable();
      table
        .boolean('is_public')
        .notNullable()
        .defaultTo(false);
      table.date('start_date').notNullable();
      table.date('end_date').notNullable();
      table.integer('duration_minutes').notNullable();
      table
        .integer('course_id')
        .unsigned()
        .notNullable()
        .references('course.id');
      table
        .integer('created_by')
        .unsigned()
        .notNullable()
        .references('user.id');

      table.dateTime('deleted_at').defaultTo(null);
      table.timestamps(true, true);
    });
    console.log('Created table: assessment');

    await knex.schema.createTable('assessment_topics', (table) => {
      table
        .integer('assessment_id')
        .unsigned()
        .notNullable()
        .references('assessment.id');
      table
        .integer('topic_id')
        .unsigned()
        .notNullable()
        .references('topic.id');

      table.primary(['assessment_id', 'topic_id']);
      table.timestamps(true, true);
    });
    console.log('Created table: assessment_topics');

    await knex.schema.createTable('assessment_questions', (table) => {
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

      table.primary(['assessment_id', 'question_id']);
      table.timestamps(true, true);
    });
    console.log('Created table: assessment_questions');

    await knex.schema.createTable('user_assessments', (table) => {
      table
        .integer('assessment_id')
        .unsigned()
        .notNullable()
        .references('assessment.id');
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('user.id');
      table.enum('role', ['student', 'teacher']);

      table.primary(['assessment_id', 'user_id']);
      table.timestamps(true, true);
    });
    console.log('Created table: user_assessments');

    await knex.schema.createTable('video', (table) => {
      table
        .increments('id')
        .notNullable()
        .primary();
      table.string('title').notNullable();
      table.string('youtube_id').notNullable();
      table
        .integer('topic_id')
        .unsigned()
        .notNullable()
        .references('topic.id');

      table.dateTime('deleted_at').defaultTo(null);
      table.timestamps(true, true);
    });
    console.log('Created table: video');

    await knex.schema.createTable('attachment', (table) => {
      table
        .increments('id')
        .notNullable()
        .primary();
      table.string('url').notNullable();
      table.string('type').notNullable();
      table
        .integer('question_id')
        .unsigned()
        .references('question.id');
      table
        .integer('answer_id')
        .unsigned()
        .references('answer.id');

      table.dateTime('deleted_at').defaultTo(null);
      table.timestamps(true, true);
    });
    console.log('Created table: attachment');
  } catch (err) {
    console.error('Error while creating initial schema', err);
  }
};

exports.down = async (knex: Knex) => {
  try {
    await knex.schema.dropTable('user_batches');
    await knex.schema.dropTable('user_assessments');
    await knex.schema.dropTable('assessment_topics');
    await knex.schema.dropTable('assessment_questions');

    await knex.schema.dropTable('user_roles');
    await knex.schema.dropTable('role_permissions');

    await knex.schema.dropTable('batch');
    await knex.schema.dropTable('assessment');
    await knex.schema.dropTable('training_center');
    await knex.schema.dropTable('answer');
    await knex.schema.dropTable('question');
    await knex.schema.dropTable('video');
    await knex.schema.dropTable('topic');
    await knex.schema.dropTable('course');
    await knex.schema.dropTable('role');
    await knex.schema.dropTable('permission');
    await knex.schema.dropTable('user');
  } catch (err) {
    console.warn('Error while rolling back initial schema', err);
  }
};
