import request from 'supertest'
import { describe, it, expect } from 'vitest'
import app from '../app.js'

describe('GET /', () => {
it('returns the welcome message', async () => {
const res = await request(app).get('/')
expect(res.status).toBe(200)
expect(res.text).toBe('Crew-board backend is connected')
})
})