import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shuffle, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RandomizersSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shuffle className="h-5 w-5 text-primary" />
          Randomizers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground mb-3">
            Do not close this page once a randomizer is triggered, until it is finished spinning.
          </p>

          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-foreground">
              <span>0</span>
              <span className="text-muted-foreground mx-2">/</span>
              <span>0</span>
            </div>
            <div className="flex justify-center gap-4 text-xs text-muted-foreground">
              <span>Left</span>
              <span>Total</span>
            </div>
          </div>

          <p className="text-sm text-muted-foreground text-center mt-3">No randomizers found</p>
        </div>

        <Button variant="outline" className="w-full bg-transparent" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add one
        </Button>
      </CardContent>
    </Card>
  )
}
