import { defineField, defineType } from 'sanity'

export const eventSchema = defineType({
  name: 'event',
  title: 'Arrangementer',
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
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Høstprøve', value: 'hostprove' },
          { title: 'Vinterprøve', value: 'vinterprove' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'date',
      title: 'Dato',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Sted',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Beskrivelse',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'facebookLink',
      title: 'Facebook lenke',
      type: 'url',
      description: 'Lenke til Facebook arrangement eller innlegg',
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
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
      category: 'category',
      media: 'image',
    },
    prepare(selection) {
      const { title, date, category } = selection
      const categoryLabel = category ? ` (${category})` : ''
      return {
        ...selection,
        title: `${title}${categoryLabel}`,
        subtitle: date ? new Date(date).toLocaleDateString('nb-NO') : 'Ingen dato',
      }
    },
  },
})
