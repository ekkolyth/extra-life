import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bookmark, ExternalLink, Monitor, MonitorPlay as Overlay, Pointer as Counter } from "lucide-react"
import { Button } from "@/components/ui/button"

const resources = [
  {
    name: "Extra Life Page",
    description: "Donation Page",
    icon: ExternalLink,
  },
  {
    name: "Twitch Page",
    description: "Watch the Stream",
    icon: Monitor,
  },
  {
    name: "Overlay",
    description: "Stream Overlay",
    icon: Overlay,
  },
  {
    name: "Donation Counter",
    description: "Full Screen Donation Counter",
    icon: Counter,
  },
]

export function QuickResourcesSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-primary" />
          Quick Resources
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {resources.map((resource) => (
            <Button
              key={resource.name}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-accent/10 bg-transparent"
            >
              <div className="flex items-center gap-2 w-full">
                <resource.icon className="h-4 w-4 text-primary" />
                <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="font-medium text-sm">{resource.name}</p>
                <p className="text-xs text-muted-foreground">{resource.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
