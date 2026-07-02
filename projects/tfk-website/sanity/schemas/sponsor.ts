import { defineType } from 'sanity'

export const sponsorSchema = defineType({
  name: 'sponsor',
  title: 'Sponsorer',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Navn',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'website',
      title: 'Nettside',
      type: 'url',
      validation: (Rule) => Rule.uri({
        scheme: ['http', 'https'],
      }),
    },
    {
      name: 'order',
      title: 'Rekkefølge',
      type: 'number',
      description: 'Lavere tall vises først',
      validation: (Rule) => Rule.required().min(0),
    },
  ],
  orderings: [
    {
      title: 'Rekkefølge',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
      order: 'order',
    },
    prepare({ title, media, order }) {
      return {
        title,
        subtitle: `Rekkefølge: ${order}`,
        media,
      }
    },
  },
})
