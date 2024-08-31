import {
  mysqlTable,
  int,
  bigint,
  mysqlEnum,
  boolean,
  varchar,
  text,
} from 'drizzle-orm/mysql-core';

export const Profile = mysqlTable('profile', {
  id: bigint('id', { mode: 'number', unsigned: true })
    .autoincrement()
    .primaryKey(),
  bio: text('bio'),
  name: varchar('name', { length: 255 }).notNull(),
  photo_public_id: text('photo_public_id'),
  photo_profile: text('photo_profile').notNull(),
  phone_number: varchar('phone_number', { length: 18 }).unique().notNull(),
});

export const Users = mysqlTable('users', {
  id: bigint('id', { mode: 'number', unsigned: true })
    .autoincrement()
    .primaryKey(),
  user: varchar('user', { length: 255 }).unique('user').notNull(),
  password: varchar('password', { length: 255 }),
  email: varchar('email', { length: 255 }).unique('user').notNull(),
  balance: bigint('balance', { mode: 'number', unsigned: true }).notNull(),
  accountNumber: bigint('accountNumber', {
    mode: 'number',
    unsigned: true,
  })
    .unique()
    .notNull(),
  profileId: bigint('id', { mode: 'number', unsigned: true }).references(
    () => Profile.id,
  ),
  created_at: text('created_at').notNull(),
});

export const HistoryTopup = mysqlTable('history_topup', {
  id: bigint('id', { mode: 'number', unsigned: true })
    .autoincrement()
    .primaryKey(),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).references(
    () => Users.id,
  ),
  amount: int('amount', { unsigned: true }).notNull(),
  balance: bigint('balance', { mode: 'number', unsigned: true }).notNull(),
  status: mysqlEnum('status', ['SUCCESS', 'FAILED']).notNull(),
  previous_balance: bigint('previous_balance', {
    mode: 'number',
    unsigned: true,
  }).notNull(),
  isRead: boolean('isRead').default(false).notNull(),
  created_at: text('created_at').notNull(),
});

export const HistoryTransfer = mysqlTable('history_transfer', {
  id: bigint('id', { mode: 'number', unsigned: true })
    .autoincrement()
    .primaryKey(),
  sender: varchar('sender', { length: 255 }).notNull(),
  sender_name: varchar('sender_name', { length: 255 }).notNull(),
  notes: text('notes'),
  balance: bigint('balance', { mode: 'number', unsigned: true }).notNull(),
  amount: int('amount', { unsigned: true }).notNull(),
  receiver: varchar('receiver', { length: 255 }).notNull(),
  receiver_name: varchar('receiver_name', { length: 255 }).notNull(),
  previous_balance: bigint('previous_balance', {
    mode: 'number',
    unsigned: true,
  }).notNull(),
  status: mysqlEnum('status', ['SUCCESS', 'FAILED']).notNull(),
  isRead: boolean('isRead').default(false).notNull(),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).references(
    () => Users.id,
  ),
  created_at: text('created_at').notNull(),
});

export const Notification = mysqlTable('notification', {
  id: bigint('id', { mode: 'number', unsigned: true })
    .autoincrement()
    .primaryKey(),
  userId: bigint('user_id', { mode: 'number', unsigned: true }).references(
    () => Users.id,
  ),
  icon: varchar('icon', { length: 255 }),
  title: varchar('title', { length: 255 }),
  description: text('description'),
  isRead: boolean('isRead').default(false).notNull(),
  created_at: text('created_at').notNull(),
  type: varchar('type', { length: 255 }),
});
