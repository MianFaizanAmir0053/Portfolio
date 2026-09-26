"use client"

import * as React from "react"
import { Accordion as AccordionPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react"

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-colors outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon data-slot="accordion-trigger-icon" className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden" />
        <ChevronUpIcon data-slot="accordion-trigger-icon" className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

/*
 * Closed panels stay mounted. Radix unmounts a closed panel's children by
 * default, which left every collapsed answer out of the server HTML — present
 * only in the RSC script payload, where crawlers and answer engines do not read
 * it. `forceMount` keeps the text in the document; the closed state below
 * hides it visually and from assistive technology, the same approach Skills
 * uses.
 *
 * The panel opens and closes by animating its height, both ways. The trick
 * is a one-cell grid whose row goes from `0fr` to `1fr`: that resolves to the
 * content's real height on every frame, so it needs no measured pixel value
 * — Radix never measures a force-mounted panel — and an open panel still
 * reflows when the viewport narrows afterwards, instead of being frozen at
 * the size it opened at and clipping the answer.
 *
 * The transition sits on a wrapper inside the panel, not on the panel. On
 * every open and close Radix sets the panel's own `transitionDuration` to
 * `0s` while it measures, and a transition declared there would never run.
 *
 * Closed is `invisible` as well as zero-high, which takes the answer out of
 * the accessibility tree and the tab order the way `hidden` did. Visibility
 * flips at the end of the transition when closing, so the text stays on
 * screen while it folds away, and at the start when opening.
 */
function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      forceMount
      className="group/accordion-content text-sm"
      {...props}
    >
      <div className="invisible grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity,visibility] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[state=open]/accordion-content:visible group-data-[state=open]/accordion-content:grid-rows-[1fr] group-data-[state=open]/accordion-content:opacity-100 motion-reduce:transition-none">
        <div className="min-h-0 overflow-hidden">
          <div
            className={cn(
              "pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
              className
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
