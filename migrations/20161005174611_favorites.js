exports.up = function(knex, Promise) {
  return knex.schema.createTable('favorites', function(table){
    table.increments();
    table.integer('book_id').references('books.id').onDelete('CASCADE').notNullable().index()
    table.integer('user_id').references('users.id').onDelete('CASCADE').notNullable().index()
    table.timestamps(true, true);
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('favorites');
};
