import { defineCollection, z } from 'astro:content';

const caseStudies = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    industry: z.string(),        // eyebrow line, e.g. "Health & Wellness · Voice AI"
    problem: z.string(),         // the card-level teaser problem statement
    outcome: z.string(),         // the one-line result shown on the card
    stack: z.array(z.string()),  // tools used, shown as tags
    client: z.string().optional(),
    featured: z.boolean().default(false), // spans 2 grid columns when true
    tinted: z.boolean().default(false),   // subtle teal card tint for visual rhythm
    order: z.number().default(0),         // display order, lower first
  }),
});

export const collections = {
  'case-studies': caseStudies,
};
