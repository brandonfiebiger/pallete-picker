
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('projects', (table) => {
      table.increments('id').primary();
      table.string('title');

      table.timestamps('true', 'true');
    }),

    knex.schema.createTable('palletes', (table) => {
      table.increments('id').primary();
      table.string('title');
      table.integer('project_id').unsigned()
      table.foreign('project_id')
        .references('projects.id');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('projects'),
    knex.schema.dropTable('palletes')
  ]);
};
