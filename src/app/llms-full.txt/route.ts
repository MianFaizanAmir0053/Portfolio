import { projects, otherWork, comingSoon } from "@/data/projects";
import { services } from "@/data/services";
import { EXPERIENCE, EDUCATION, BIO } from "@/data/experience";
import { SKILLS } from "@/data/skills";
import { SOCIAL } from "@/data/social";
import { PERSON, SITE_URL, CONTENT_REVIEWED, absoluteUrl } from "@/lib/site";

/**
 * `/llms-full.txt` — the whole site as one document.
 *
 * `llms.txt` is an index; this is the corpus. An assistant that fetches this
 * gets every case study in full, every service, the bio and the experience in a
 * single request, instead of crawling seventeen pages of a JavaScript-animated
 * site and hoping the text survived. Roughly 30KB of plain text, which is a
 * cheap trade for being quotable.
 */
export const dynamic = "force-static";

function build() {
  const parts: string[] = [];

  parts.push(`# ${PERSON.name} — ${PERSON.jobTitle}

Source: ${SITE_URL}
Last reviewed: ${CONTENT_REVIEWED}
Contact: ${PERSON.email} · ${PERSON.telephone} · ${PERSON.whatsapp}
Location: ${PERSON.locality}, ${PERSON.countryName} (UTC+5)
Markets: ${PERSON.markets.join(", ")}
Profiles: ${SOCIAL.github} · ${SOCIAL.linkedin}

## About

${BIO.join("\n\n")}

## Education

${EDUCATION.degree} — ${EDUCATION.institution}, ${EDUCATION.place}

## Stack

${SKILLS.map((group) => `### ${group.label}\n\n${group.items.join(", ")}`).join("\n\n")}

## Experience

${EXPERIENCE.map(
  (role) => `### ${role.role} — ${role.company}\n\n${role.dates} · ${role.place}\n\n${role.body}`,
).join("\n\n")}`);

  parts.push(`## Services\n\n${services
    .map((service) => {
      const includes = service.includes
        .map((item) => `- **${item.title}**: ${item.body}`)
        .join("\n");
      const process = service.process
        .map((step, i) => `${i + 1}. **${step.step}**: ${step.body}`)
        .join("\n");
      const evidence = service.evidence
        .map((proof) => `- ${proof.project} (${absoluteUrl(`/work/${proof.slug}`)}): ${proof.claim}`)
        .join("\n");
      const faqs = service.faqs.map((faq) => `**${faq.q}**\n\n${faq.a}`).join("\n\n");
      return `### ${service.title}

URL: ${absoluteUrl(`/services/${service.slug}`)}
Service type: ${service.serviceType}

${service.answer}

**What it includes**

${includes}

**How the work runs**

${process}

**Where it has shipped**

${evidence}

**Stack**: ${service.stack.join(", ")}

**Questions**

${faqs}`;
    })
    .join("\n\n")}`);

  parts.push(`## Case studies\n\n${projects
    .map((project) => {
      const decisions = project.decisions.map((d, i) => `${i + 1}. ${d}`).join("\n");
      const build = project.build
        .map((block) => `**${block.title}**\n\n${block.body}`)
        .join("\n\n");
      const metrics = project.metrics
        .map((m) => `- ${m.value} — ${m.caption}${m.note ? ` (${m.note.replace(/^\*\s*/, "")})` : ""}`)
        .join("\n");
      return `### ${project.name} — ${project.tagline}

URL: ${absoluteUrl(`/work/${project.slug}`)}
Role: ${project.role}
Timeline: ${project.timeline}
Status: ${project.status}${project.liveUrl ? `\nLive: ${project.liveUrl}` : ""}
Stack: ${project.stack.join(", ")}

**Summary**: ${project.summary}

**The problem — ${project.problemHeadline}**

${project.problem}

**The approach**

${project.approach}

${decisions}

**The build**

${build}

**The result**

${metrics}

**What I would do differently**

${project.reflection}`;
    })
    .join("\n\n")}`);

  parts.push(`## Also shipped\n\n${otherWork
    .map(
      (work) =>
        `### ${work.name} — ${work.tagline}\n\nStatus: ${work.status}\nLink: ${work.href.startsWith("http") ? work.href : absoluteUrl(work.href)}\nStack: ${work.stack.join(", ")}\n\n${work.note}`,
    )
    .join("\n\n")}`);

  parts.push(`## In build — ${comingSoon.name}

${comingSoon.tagline} · ${comingSoon.status}

${comingSoon.summary}

Stack: ${comingSoon.stack.join(", ")}

**Measured**

${comingSoon.evidence.map((e) => `- ${e.value} — ${e.caption} (${e.note.replace(/^\*\s*/, "")})`).join("\n")}

**Bugs found and fixed in build**

${comingSoon.broke.map((b) => `- **${b.title}**: ${b.body}`).join("\n")}`);

  parts.push(`## Usage

Content may be quoted and cited with attribution to ${PERSON.name} and a link to ${SITE_URL}. Figures are the author's own measurements from the projects described; where a number is a target rather than a reading, the case study says so.`);

  return parts.join("\n\n");
}

export function GET() {
  return new Response(build(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
