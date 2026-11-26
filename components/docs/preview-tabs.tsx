import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function PreviewTabs({ preview, code }: { preview: React.ReactNode; code: React.ReactNode }) {
  return (
    <Tabs defaultValue="preview" className="my-7">
      <TabsList aria-label="Preview or code">
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="code" color="lavender">
          Code
        </TabsTrigger>
      </TabsList>
      <div className="overflow-hidden rounded-3xl shadow-[inset_0_0_0_2px_color-mix(in_oklch,var(--yan-lavender)_60%,transparent)]">
        <TabsContent value="preview" className="data-[state=active]:animate-none">
          {preview}
        </TabsContent>
        <TabsContent value="code" className="data-[state=active]:animate-none">
          {code}
        </TabsContent>
      </div>
    </Tabs>
  )
}
