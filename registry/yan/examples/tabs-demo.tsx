import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TabsDemo() {
  return (
    <Tabs defaultValue="sweet" className="w-full max-w-sm items-center">
      <TabsList>
        <TabsTrigger value="sweet">Sweet</TabsTrigger>
        <TabsTrigger value="sour">Sour</TabsTrigger>
        <TabsTrigger value="salty">Salty</TabsTrigger>
      </TabsList>
      <TabsContent value="sweet" className="text-center text-sm font-bold">
        Strawberry daifuku, melon pan and a very tall parfait.
      </TabsContent>
      <TabsContent value="sour" className="text-center text-sm font-bold">
        Umeboshi candy and lemon drops that make you go キュッ.
      </TabsContent>
      <TabsContent value="salty" className="text-center text-sm font-bold">
        Senbei, edamame and salted caramel mochi.
      </TabsContent>
    </Tabs>
  )
}
