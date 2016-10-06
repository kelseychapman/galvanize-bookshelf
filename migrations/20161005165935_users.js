exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', function(table){
    table.increments();
    table.string('first_name', 255).notNullable().defaultTo('');
    table.string('last_name', 255).notNullable().defaultTo('');
    table.string('email', 255).notNullable().unique();
    table.specificType('hashed_password', 'character(60)').notNullable();
    table.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users');
};
