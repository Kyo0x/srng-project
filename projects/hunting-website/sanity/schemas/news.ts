import { defineField, defineType } from 'sanity'

export const newsSchema = defineType({
  name: 'news',
  title: 'Nyheter',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL-vennlig tittel',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publisert dato',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Sammendrag',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'facebookLink',
      title: 'Facebook lenke',
      type: 'url',
      description: 'Lenke til Facebook innlegg eller arrangement',
    }),
    defineField({
      name: 'content',
      title: 'Innhold',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'image',
      title: 'Bilde',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Valgfritt - hvis ikke satt vil en grå placeholder vises',
    }),
    defineField({
      name: 'pdf',
      title: 'PDF-fil',
      type: 'file',
      description: 'Vedlegg en PDF-fil til nyheten (valgfritt)',
      options: {
        accept: 'application/pdf',
      },
    }),
    defineField({
      name: 'pdfAsMainContent',
      title: 'PDF som hovedinnhold',
      type: 'boolean',
      description: 'Hvis aktivert, vil PDF vises i fullt format på nyhetssiden i stedet for tekstinnhold',
      initialValue: false,
    }),
    defineField({
      name: 'showAsActivity',
      title: 'Vis som aktivitet',
      type: 'boolean',
      description: 'Vis denne nyheten på Aktiviteter-siden',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      date: 'publishedAt',
      media: 'image',
    },
    prepare(selection) {
      const { date } = selection
      return {
        ...selection,
        title: 'Nyhet',
        subtitle: date ? new Date(date).toLocaleDateString('nb-NO') : 'Mangler dato',
      }
    },
  },
})
