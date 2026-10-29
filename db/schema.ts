import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const records = sqliteTable('user_records', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull(),
  kind: text('kind', { enum: ['note', 'bookmark'] }).notNull(),
  equipmentId: text('equipment_id').notNull(),
  componentId: text('component_id'),
  title: text('title').notNull(),
  body: text('body').notNull().default(''),
  updatedAt: integer('updated_at').notNull(),
}, table => [index('records_owner_kind').on(table.ownerId, table.kind)]);
