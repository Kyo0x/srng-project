import { defineField, defineType } from 'sanity'

export const resourceSchema = defineType({
  name: 'resource',
  title: 'Lover og regler',
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
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'file',
      title: 'Fil (PDF/Word)',
      type: 'file',
      options: {
        accept: '.pdf,.doc,.docx',
      },
      validation: (Rule) => 
        Rule.custom((file, context) => {
          const doc = context.document as { url?: string; file?: File }
          if (!file && !doc.url) {
            return 'Du må enten laste opp en fil eller legge til en lenke'
          }
          return true
        }),
      description: 'Last opp et dokument (valgfritt)',
    }),
    defineField({
      name: 'url',
      title: 'Lenke (URL)',
      type: 'url',
      description: 'Legg til en ekstern lenke (valgfritt)',
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
      file: 'file',
      url: 'url',
    },
    prepare(selection) {
      const { title, file, url } = selection
      const hasFile = !!file
      const hasUrl = !!url
      
      let subtitle = ''
      if (hasFile && hasUrl) {
        const extension = file?.asset?.originalFilename?.split('.').pop()?.toUpperCase()
        subtitle = `📄 ${extension || 'Fil'} + 🔗 Lenke`
      } else if (hasFile) {
        const extension = file?.asset?.originalFilename?.split('.').pop()?.toUpperCase()
        subtitle = `📄 ${extension || 'Fil'}`
      } else if (hasUrl) {
        subtitle = `🔗 ${url}`
      } else {
        subtitle = '⚠️ Ingen fil eller lenke'
      }
      
      return {
        title,
        subtitle,
      }
    },
  },
})
