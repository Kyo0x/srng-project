import { defineField, defineType } from 'sanity'

export const clubhouseSchema = defineType({
  name: 'clubhouse',
  title: 'Utleie Klubbhus',
  type: 'document',
  fields: [
    defineField({
      name: 'contractFile',
      title: 'PDF',
      type: 'file',
      options: {
        accept: '.pdf',
      },
    }),
    defineField({
      name: 'contractButtonText',
      title: 'Knappetekst',
      type: 'string',
      initialValue: 'Last ned leieavtale',
    }),
    defineField({
      name: 'galleryImages',
      title: 'Bilder',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'galleryImage',
          title: 'Bilde',
          fields: [
            defineField({
              name: 'image',
              title: 'Bilde',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Alt-tekst',
              type: 'string',
              description: 'Kort beskrivelse av bildet for tilgjengelighet.',
            }),
          ],
          preview: {
            select: {
              media: 'image',
              title: 'alt',
            },
            prepare(selection) {
              return {
                title: selection.title || 'Galleri-bilde',
                media: selection.media,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      hasContract: 'contractFile',
      buttonText: 'contractButtonText',
    },
    prepare(selection) {
      const { hasContract, buttonText } = selection
      return {
        title: 'Utleie Klubbhus',
        subtitle: hasContract ? `✅ ${buttonText || 'Leieavtale lastet opp'}` : '⚠️ Ingen leieavtale',
      }
    },
  },
})
