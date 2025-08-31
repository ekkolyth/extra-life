'use server'

import { db } from '@/lib/convex'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function getGoals() {
  const goals = await db.goal.findMany({
    orderBy: {
      amount: 'asc'
    }
  })

  return goals
}

export async function createGoal(prevState: any, formData: FormData) {
  const title = String(formData.get('title'))
  const amount = Number(formData.get('amount'))
  const endOfStream = Boolean(formData.get('endOfStream'))

  await db.goal.create({
    data: {
      title: title,
      amount: amount,
      endOfStream: endOfStream
    }
  })

  revalidatePath('/admin/goals')
  redirect('/admin/goals')
}

export async function updateGoal(prevState: any, formData: FormData) {
  const id = String(formData.get('id'))
  const title = String(formData.get('title'))
  const amount = Number(formData.get('amount'))
  const endOfStream = Boolean(formData.get('endOfStream'))

  await db.goal.update({
    where: { id },
    data: {
      title: title,
      amount: amount,
      endOfStream: endOfStream
    }
  })

  revalidatePath('/admin/goals')
  redirect('/admin/goals')
}

export async function deleteGoal(formData: FormData) {
  const id = String(formData.get('id'))

  await db.goal.delete({
    where: { id }
  })

  revalidatePath('/admin/goals')
  redirect('/admin/goals')
}
