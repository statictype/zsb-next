import { defineCliConfig } from 'sanity/cli'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export default defineCliConfig({
  api: {
    ...(projectId ? { projectId } : {}),
    ...(dataset ? { dataset } : {}),
  },
  autoUpdates: true,
  typegen: {
    enabled: true,
    path: './src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: './sanity.types.ts',
    overloadClientMethods: true,
  },
})
