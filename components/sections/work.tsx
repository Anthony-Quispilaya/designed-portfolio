import { Container, Label, reveal } from "@/components/ui/primitives";
import { WorkGrid } from "@/components/work/work-grid";
import { work } from "@/content/work";

export function Work() {
  return (
    <section
      id="work"
      aria-labelledby="work-title"
      data-nav-theme="light"
      className="border-t border-sand bg-ivory py-16 lg:py-20"
    >
      <Container>
        <Label className="text-stone">Work</Label>
        <h2
          id="work-title"
          className="mt-2 text-headline font-semibold"
          {...reveal(0)}
        >
          Selected projects
        </h2>
        <div className="mt-8">
          <WorkGrid items={work} />
        </div>
      </Container>
    </section>
  );
}
