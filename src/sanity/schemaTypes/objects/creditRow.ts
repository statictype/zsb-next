import { defineArrayMember, defineField, defineType } from 'sanity'

const ROW_TYPES = [
  { title: 'Logo + credit line', value: 'primary' },
  { title: 'Logo only', value: 'partner' },
  { title: 'Credit line only', value: 'secondary' },
] as const

function typeField() {
  return defineField({
    name: 'type',
    title: 'Shown as',
    description:
      'Logo rows feed the logo wall at the top, in this list’s order — an organization with no logo, or one marked as a gallery, drops to the Partners name list instead. Credit-line rows are the labelled block at the bottom (curator, critics, PR).',
    type: 'string',
    options: { list: [...ROW_TYPES], layout: 'radio' },
    initialValue: 'secondary' as const,
    validation: (rule) => rule.required(),
  })
}

function labelField() {
  return defineField({
    name: 'label',
    title: 'Label',
    description: 'e.g. "Organizer", "Curator", "Partners"',
    type: 'string',
    validation: (rule) => rule.required(),
  })
}

export const creditOrg = defineType({
  name: 'creditOrg',
  title: 'Credit — single organization',
  type: 'object',
  fields: [
    typeField(),
    labelField(),
    defineField({
      name: 'organization',
      title: 'Organization',
      type: 'reference',
      to: [{ type: 'organization' }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'detail',
      title: 'Detail',
      description: 'Optional sub-line under the organization name',
      type: 'string',
    }),
  ],
  preview: {
    select: { title: 'label', orgName: 'organization.name', media: 'organization.logo' },
    prepare({ title, orgName, media }) {
      return { title, subtitle: orgName ?? '', media }
    },
  },
})

export const creditOrgList = defineType({
  name: 'creditOrgList',
  title: 'Credit — list of organizations',
  type: 'object',
  fields: [
    typeField(),
    labelField(),
    defineField({
      name: 'organizations',
      title: 'Organizations',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'organization' }] })],
      validation: (rule) => rule.required().min(1).unique(),
    }),
  ],
  preview: {
    select: {
      title: 'label',
      type: 'type',
      org0: 'organizations.0.name',
      org1: 'organizations.1.name',
      org2: 'organizations.2.name',
      orgs: 'organizations',
    },
    prepare({ title, type, org0, org1, org2, orgs }) {
      const names = [org0, org1, org2].filter(Boolean) as string[]
      const total = Array.isArray(orgs) ? orgs.length : 0
      const more = total > names.length ? ` +${total - names.length}` : ''
      const shown = ROW_TYPES.find((row) => row.value === type)?.title ?? ''
      return { title, subtitle: [names.join(', ') + more, shown].filter(Boolean).join(' · ') }
    },
  },
})

export const creditText = defineType({
  name: 'creditText',
  title: 'Credit — text',
  type: 'object',
  fields: [
    typeField(),
    labelField(),
    defineField({
      name: 'names',
      title: 'Names',
      description: 'One entry per name',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      validation: (rule) => rule.required().min(1).unique(),
    }),
  ],
  preview: {
    select: { title: 'label', names: 'names' },
    prepare({ title, names }) {
      const first = Array.isArray(names) && names.length ? names[0] : ''
      return { title, subtitle: first }
    },
  },
})
