import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default defineCliConfig({
  api: {
    ...(projectId ? { projectId } : {}),
    ...(dataset ? { dataset } : {}),
  },
  deployment: {
    autoUpdates: true,
  },
  schemaExtraction: {
    path: './src/sanity/schema.json',
  },
  typegen: {
    enabled: true,
    path: './src/**/*.{ts,tsx}',
    schema: './src/sanity/schema.json',
    generates: './src/sanity/types.ts',
    overloadClientMethods: true,
  },
})
