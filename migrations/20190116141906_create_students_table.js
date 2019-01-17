exports.up = function(knex, Promise) {
  return knex.schema.createTable('students', function(tbl) {
    // primary key 'id'
    tbl.increments();

    // other fields
    tbl.text('name', 255).unique(); // first argument is the column name, second argument(optional) is the limit size (default 255)

    // timestamps
    tbl.timestamps(true, true); // Creates two columns "created at" and "updated at".

    // foreign key example
    tbl
      .integer('cohort_id')
      .unsigned()
      .references('id')
      .inTable('cohorts');

    // constraints
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('students');
};
