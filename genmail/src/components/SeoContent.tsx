import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "./ui/button";
import { ArrowUpRight } from "lucide-react";

const accordionItems = [
  {
    value: "item-1",
    trigger: "Protect Your Privacy",
    content:
      "Keep your real inbox clean from spam and marketing emails. A temporary email address is perfect for signing up for services, forums, or newsletters without revealing your personal information.",
  },
  {
    value: "item-2",
    trigger: "Enhance Your Security",
    content:
      "Using a disposable email for one-time signups prevents your primary email from being exposed in data breaches. If a service you signed up for gets hacked, your real email address remains safe.",
  },
  {
    value: "item-3",
    trigger: "No Commitment",
    content:
      "Temporary emails self-destruct after a short period. There's no need to manage another account, remember passwords, or worry about deleting it later. It's hassle-free and instant.",
  },
];

export default function SeoContent() {
  return (
    <section className="px-6 font-sans">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left Column */}
        <div className="md:pr-8">
          <h2 className="font-serif text-5xl font-bold tracking-tighter leading-tight mb-6">
            Why use a{" "}
            <span className="text-foreground/80 relative inline-block">
              temporary
              <span className="absolute bottom-1 left-0 w-full h-1 bg-purple-500/30"></span>
            </span>{" "}
            email?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 tracking-tight">
            Take control of your digital footprint. Genmail provides a secure,
            anonymous, and disposable temporary email solution to protect you from spam
            and data breaches.
          </p>
          <Button
            variant="outline"
            className="group"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Generate Your First Email
            <ArrowUpRight className="w-4 h-4 ml-2 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Right Column (Accordion) */}
        <div>
          <Accordion type="single" collapsible defaultValue="item-1">
            {accordionItems.map((item) => (
              <AccordionItem key={item.value} value={item.value}>
                <AccordionTrigger className="font-semibold text-lg">
                  {item.trigger}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {item.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
