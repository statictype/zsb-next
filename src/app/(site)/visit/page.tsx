import { singletonPage } from '@site/_lib/singleton-page'

const page = singletonPage('visit')

export const generateMetadata = page.generateMetadata
export default page.Route
