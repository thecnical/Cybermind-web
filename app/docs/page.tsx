import { Surface } from "@/components/DesignPrimitives";
import { DocsPageView, LinkCard } from "@/components/SitePrimitives";
import { cybermindDocRoutes, getDocPage, getSidebarGroups } from "@/lib/siteContent";

const quickStartCards = [
  {
    href: "/docs/get-started",
    label: "I am new here",
    description: "Start with install, platform support, and first-run validation.",
  },
  {
    href: "/docs/resources/tools-hub",
    label: "I need tools",
    description: "Open tools, extensions, command tools, and changelog links in one place.",
  },
  {
    href: "/docs/resources/troubleshooting",
    label: "Something is broken",
    description: "Follow the shortest recovery path instead of searching manually.",
  },
  {
    href: "/docs/changelogs/latest",
    label: "I need updates",
    description: "Read the latest changelog directly from docs.",
  },
];

export default function DocsHomePage() {
  const groups = getSidebarGroups();
  const page = getDocPage("get-started");

  return (
    <div className="grid gap-6">
      <Surface variant="glass" tone="cyan" elevation="medium" className="rounded-[30px] p-6 md:p-8">
        <p className="cm-label">Choose a path</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Open the docs by goal, not by route count</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickStartCards.map((item) => (
            <LinkCard key={item.href} {...item} variant="skeuo" />
          ))}
        </div>
      </Surface>

      <DocsPageView page={page} />

      <Surface variant="glass" elevation="medium" className="rounded-[30px] p-6 md:p-8">
        <h2 className="text-2xl font-semibold text-white">What is inside the docs</h2>
        <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">
          The docs are grouped into four buckets: start here, core workflows, commands and safety, and help and updates.
        </p>
        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {groups.map((group, index) => (
            <Surface key={group.group} variant={index % 2 === 0 ? "clay" : "glass"} elevation="low" className="rounded-[24px] p-5">
              <p className="cm-label text-[var(--accent-cyan)]">{group.group}</p>
              <p className="mt-3 text-sm leading-7 text-[var(--text-soft)]">{group.description}</p>
              <div className="mt-4 grid gap-3">
                {group.items.slice(0, 3).map((item) => (
                  <LinkCard
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    description={`Open ${item.label.toLowerCase()} in the ${group.group.toLowerCase()} section.`}
                    variant="skeuo"
                    motion="fast"
                  />
                ))}
              </div>
            </Surface>
          ))}
        </div>
        <p className="mt-6 text-sm text-[var(--text-muted)]">Total generated docs routes: {cybermindDocRoutes.length}</p>
      </Surface>
    </div>
  );
}
