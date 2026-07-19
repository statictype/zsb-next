import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { presentationTool } from 'sanity/presentation'
import { structureTool } from 'sanity/structure'
import { apiVersion, dataset, projectId } from '@/sanity/env'
import { locations } from '@/sanity/lib/presentation'
import { isSingletonType, SINGLETON_TYPES } from '@/sanity/lib/singleton'
import { schemaTypes } from '@/sanity/schemaTypes'
import { structure } from '@/sanity/structure'

const LOCKED_SINGLETON_ACTIONS = new Set(['unpublish', 'delete', 'duplicate'])

export default defineConfig({
  name: 'default',
  title: 'ZSB',
  basePath: '/studio',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    presentationTool({
      resolve: { locations },
      previewUrl: {
        previewMode: {
          enable: '/api/draft-mode/enable',
          disable: '/api/draft-mode/disable',
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  schema: { types: schemaTypes },
  document: {
    // Singletons can't be deleted / unpublished / duplicated.
    actions: (prev, { schemaType }) =>
      isSingletonType(schemaType)
        ? prev.filter((action) => !LOCKED_SINGLETON_ACTIONS.has(action.action ?? ''))
        : prev,
    // Hide singletons from the global "Create new" menu so editors can't
    // make a second instance.
    newDocumentOptions: (prev, { creationContext }) =>
      creationContext.type === 'global'
        ? prev.filter((opt) => !(SINGLETON_TYPES as readonly string[]).includes(opt.templateId))
        : prev,
  },
})
