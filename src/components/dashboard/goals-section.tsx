"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Trophy, CheckCircle, Clock } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function GoalsSection() {
  const goals = [
    {
      name: "Eat Shit",
      amount: 500,
      raised: 0,
      isNext: true,
      status: "active",
      description: "Streamer will eat something unpleasant",
    },
    {
      name: "Extra Hour Stream",
      amount: 1000,
      raised: 0,
      isNext: false,
      status: "pending",
      description: "Stream for an additional hour",
    },
    {
      name: "Cosplay Stream",
      amount: 1500,
      raised: 0,
      isNext: false,
      status: "pending",
      description: "Stream in costume",
    },
    {
      name: "24 Hour Marathon",
      amount: 2000,
      raised: 0,
      isNext: false,
      status: "pending",
      description: "Ultimate goal - 24 hour stream",
    },
  ]

  const nextGoal = goals.find((goal) => goal.isNext)
  const progressToNext = nextGoal ? (nextGoal.raised / nextGoal.amount) * 100 : 0

  const goalChartData = goals.map((goal) => ({
    name: goal.name.length > 10 ? goal.name.substring(0, 10) + "..." : goal.name,
    target: goal.amount,
    raised: goal.raised,
  }))

  return (
    <div className="space-y-6">
      {/* Next Goal Highlight */}
      {nextGoal && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-sm font-medium text-primary">Next Goal</span>
                <h3 className="text-2xl font-bold text-foreground">{nextGoal.name}</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{nextGoal.description}</p>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">${nextGoal.raised} raised</span>
                <span className="font-medium">${nextGoal.amount} target</span>
              </div>
              <Progress value={progressToNext} className="h-2" />
              <p className="text-xs text-muted-foreground">{progressToNext.toFixed(1)}% complete</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Goals Overview Chart */}
      <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Target className="h-4 w-4 text-primary" />
            </div>
            Goals Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              target: {
                label: "Target Amount",
                color: "hsl(var(--muted))",
              },
              raised: {
                label: "Amount Raised",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[200px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={goalChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="target" fill="hsl(var(--muted))" radius={[2, 2, 0, 0]} />
                <Bar dataKey="raised" fill="hsl(var(--chart-1))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Goals List */}
      <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg">All Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {goals.map((goal, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    {goal.status === "completed" ? (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    ) : goal.isNext ? (
                      <Clock className="h-4 w-4 text-primary" />
                    ) : (
                      <Target className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{goal.name}</p>
                    <p className="text-xs text-muted-foreground">{goal.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">${goal.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">${goal.raised} raised</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
