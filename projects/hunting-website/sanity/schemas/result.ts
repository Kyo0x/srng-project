import { defineField, defineType } from 'sanity';

export const resultType = defineType({
  name: 'result',
  title: 'Jaktprøve Resultat',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tittel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Dato',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Premierte', value: 'premierte' },
          { title: 'Partiliste', value: 'partiliste' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'Resultatfil',
      type: 'file',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
    },
    prepare({ title, date }) {
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString('nb-NO') : 'Mangler dato',
      };
    },
  },
});
