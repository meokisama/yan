import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const panel = "w-full rounded-3xl border-2 border-dashed border-border bg-card px-5 py-4 text-center text-sm font-bold text-pretty"

export default function TabsDemo() {
  return (
    <Tabs defaultValue="sweet" className="w-full max-w-sm items-center">
      <TabsList>
        <TabsTrigger value="sweet">
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 14.2C2.2 10.3 1 7.4 1 5.2 1 3.3 2.5 2 4.3 2 5.8 2 7.1 2.9 8 4.3 8.9 2.9 10.2 2 11.7 2 13.5 2 15 3.3 15 5.2c0 2.2-1.2 5.1-7 9Z" />
          </svg>
          Sweet
        </TabsTrigger>
        <TabsTrigger value="sour" color="lemon">
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M9.5 1 3 9h4l-1 6 7-8.5H8.8L9.5 1Z" />
          </svg>
          Sour
        </TabsTrigger>
        <TabsTrigger value="salty" color="sky">
          <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M8 1.5C5.5 5 3.5 7.3 3.5 10a4.5 4.5 0 0 0 9 0c0-2.7-2-5-4.5-8.5Z" />
          </svg>
          Salty
        </TabsTrigger>
      </TabsList>
      <TabsContent value="sweet" className={panel}>
        Strawberry daifuku, melon pan and a very tall parfait.
      </TabsContent>
      <TabsContent value="sour" className={panel}>
        Umeboshi candy and lemon drops that make you go キュッ.
      </TabsContent>
      <TabsContent value="salty" className={panel}>
        Senbei, edamame and salted caramel mochi.
      </TabsContent>
    </Tabs>
  )
}
