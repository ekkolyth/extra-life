import { getServerSession } from 'next-auth'

import { authConfig } from '@/lib/auth'
import { getGoals } from '@/actions/goals'

export async function GET() {
  const session = await getServerSession(authConfig)
  if (!session) return Response.json({ error: 'Unauthorized' })

  const data = await getGoals()

  return Response.json(data)
}
