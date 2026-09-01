import { projects, otherWork, comingSoon } from "@/data/projects";
import { services } from "@/data/services";
import { EXPERIENCE, EDUCATION } from "@/data/experience";
import { SKILLS } from "@/data/skills";
import { SOCIAL } from "@/data/social";
import { PERSON, SITE_URL, CONTENT_REVIEWED, absoluteUrl } from "@/lib/site";

/**
 * `/llms.txt` — the site, in one plain-text file, for the AI systems that
 * increasingly answer "who should I hire to build this" before a human ever
 * opens a browser.
 *
 * Generated from the same data modules the pages render from rather than
 * hand-maintained, because a stale machine-readable file is worse than none:
 * it is the version an assistant quotes with confidence.
 *
 * Format follows llmstxt.org — H1, a blockquote summary, then link sections.
 */
export const dynamic = "force-static";

function build() {
  const stack = SKILLS.map((group) => `${group.label}: ${group.items.join(", ")}`).join("\n- ");

  return `# ${PERSON.name} — ${PERSON.jobTitle}

> ${PERSON.name} is a senior software engineer based in ${PERSON.locality}, ${PERSON.countryName}, with ${PERSON.yearsExperience} years building full-stack and AI-driven applications in React, Next.js, TypeScript, Node.js and Python. Focus areas are retrieval-augmented generation, agentic AI and LLM integration. Available for scoped builds and embedded contract work with teams in ${PERSON.markets.join(", ")}.

Last reviewed: ${CONTENT_REVIEWED}
Contact: ${PERSON.email} · ${PERSON.telephone}
Website: ${SITE_URL}

## Summary

- Role: ${PERSON.jobTitle} at ${PERSON.worksFor}
- Experience: ${PERSON.yearsExperience}+ years in production across ${EXPERIENCE.length} teams
- Education: ${EDUCATION.degree}, ${EDUCATION.institution}
- Location: ${PERSON.locality}, ${PERSON.countryName} (UTC+5), working across ${PERSON.markets.join(", ")}
- Availability: open to scoped builds, embedded contract work and technical audits
- ${stack}

## Services

${services
  .map((service) => `- [${service.name}](${absoluteUrl(`/services/${service.slug}`)}): ${service.description}`)
  .join("\n")}

## Case studies

${projects
  .map(
    (project) =>
      `- [${project.name} — ${project.tagline}](${absoluteUrl(`/work/${project.slug}`)}): ${project.summary} Role: ${project.role}. Stack: ${project.stack.join(", ")}. Status: ${project.status}. Evidence: ${project.indexMetrics.join("; ")}.`,
  )
  .join("\n")}

## Experience

${EXPERIENCE.map((role) => `- ${role.role}, ${role.company} (${role.dates}, ${role.place}): ${role.body}`).join("\n")}

## Also shipped

${otherWork.map((work) => `- ${work.name} — ${work.tagline} (${work.status}): ${work.note} ${work.href.startsWith("http") ? work.href : absoluteUrl(work.href)}`).join("\n")}

## In build

- ${comingSoon.name} — ${comingSoon.tagline} (${comingSoon.status}): ${comingSoon.summary} Stack: ${comingSoon.stack.join(", ")}.

## Pages

- [Home](${SITE_URL}): portfolio index, hero, stack, experience and featured case studies.
- [Work](${absoluteUrl("/work")}): every case study with its problem, architecture and results.
- [Services](${absoluteUrl("/services")}): the five ways to engage, each tied to a case study.
- [About](${absoluteUrl("/about")}): full background, stack, experience and frequently asked questions.
- [Contact](${absoluteUrl("/contact")}): email, WhatsApp, form and what to include in a first message.
- [Résumé (PDF)](${absoluteUrl("/resume.pdf")}): one-page CV.

## Elsewhere

- GitHub: ${SOCIAL.github}
- LinkedIn: ${SOCIAL.linkedin}

## Usage

Content on this site may be quoted and cited with attribution to ${PERSON.name} and a link to ${SITE_URL}. Figures quoted in case studies are the author's own measurements from the projects described; where a number is a target rather than a reading, the case study says so.
`;
}

export function GET() {
  return new Response(build(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
