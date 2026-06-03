import { defineArrayMember, defineField, defineType } from 'sanity'

const ROW_TYPES = [
  { title: 'Primary', value: 'primary' },
  { title: 'Partner', value: 'partner' },
  { title: 'Secondary', value: 'secondary' },
] as const

function typeField() {
  return defineField({
    name: 'type',
    title: 'Type',
    description: 'Controls visual prominence on the edition page',
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
      org0: 'organizations.0.name',
      org1: 'organizations.1.name',
      org2: 'organizations.2.name',
    },
    prepare({ title, org0, org1, org2 }) {
      const names = [org0, org1, org2].filter(Boolean) as string[]
      return { title, subtitle: names.length ? names.join(', ') : '' }
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
      validation: (rule) =>
        rule.custom((names, context) => {
          const legacy = (context.parent as { value?: string } | undefined)?.value
          const hasNames =
            Array.isArray(names) && names.some((n) => typeof n === 'string' && n.trim())
          if (!hasNames && !legacy?.trim()) return 'Add at least one name'
          return true
        }),
    }),
    // Legacy newline-joined value. Read-only during the migration; the
    // migration splits it into `names` and then it is removed (contract
    // phase). See docs/cms-rollout-plan.md Step 6.
    defineField({
      name: 'value',
      title: 'Value (legacy)',
      description: 'Being replaced by Names. Leave as-is.',
      type: 'text',
      rows: 3,
      readOnly: true,
      hidden: ({ parent }) => !(parent as { value?: string } | undefined)?.value,
    }),
  ],
  preview: {
    select: { title: 'label', names: 'names', value: 'value' },
    prepare({ title, names, value }) {
      const first = Array.isArray(names) && names.length ? names[0] : null
      const fallback = typeof value === 'string' ? (value.split('\n')[0] ?? '') : ''
      return { title, subtitle: first ?? fallback }
    },
  },
})
