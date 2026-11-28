import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function AccordionDemo() {
  return (
    <Accordion type="single" collapsible defaultValue="keep" className="max-w-md">
      <AccordionItem value="keep">
        <AccordionTrigger>How long does mochi keep?</AccordionTrigger>
        <AccordionContent>
          A day at room temperature. After that it goes firm, so warm it for a few seconds and it turns soft again.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="freeze">
        <AccordionTrigger>Can I freeze it?</AccordionTrigger>
        <AccordionContent>Yes. Wrap each piece, freeze it, and let it thaw on the counter for an hour.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="share">
        <AccordionTrigger>Do I have to share?</AccordionTrigger>
        <AccordionContent>Mochi-chan says yes. ぷにっ</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
