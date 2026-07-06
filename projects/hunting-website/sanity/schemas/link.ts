import { defineField, defineType } from 'sanity'

export const linkSchema = defineType({
  name: 'usefulLink',
  title: 'Lover og regler - Lenker',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({
        scheme: ['http', 'https']
      }),
    }),
    defineField({
      name: 'order',
      title: 'Rekkefølge',
      type: 'number',
      description: 'Lavere nummer vises først',
      initialValue: 0,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'url',
    },
  },
})
