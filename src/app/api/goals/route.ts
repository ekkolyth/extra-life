import { getGoals } from '@/actions/goals'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const data = await getGoals()

  return Response.json(data)
}
