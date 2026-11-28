import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CardDemo() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Strawberry daifuku</CardTitle>
        <CardDescription>Soft mochi around a whole strawberry. Best eaten the day it is made.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Badge dot>Seasonal</Badge>
        <Badge color="mint">Fresh today</Badge>
      </CardContent>
      <CardFooter>
        <Button size="sm" sfx="もぐもぐ">
          Add to box
        </Button>
        <Button size="sm" variant="ghost">
          Later
        </Button>
      </CardFooter>
    </Card>
  )
}
