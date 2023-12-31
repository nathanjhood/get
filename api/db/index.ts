import { createPool, sql } from '@vercel/postgres';
import seed from './seed';

export default async function defineEventHandler(async () => {
  const startTime = Date.now()
  const db = createPool()
  try {
    const { rows: users } = await db.query('SELECT * FROM users')
    const duration = Date.now() - startTime
    return {
      users: users,
      duration: duration,
    }
  } catch (error) {
    // @ts-ignore
    if (error?.message === `relation "users" does not exist`) {
      console.log(
        'Table does not exist, creating and seeding it with dummy data now...'
      )
      // Table is not created yet
      await seed()
      const { rows: users } = await db.query('SELECT * FROM users')
      const duration = Date.now() - startTime
      return {
        users: users,
        duration: duration,
      }
    } else {
      throw error
    }
  }
})
