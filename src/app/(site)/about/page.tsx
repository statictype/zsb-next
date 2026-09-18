import { singletonPage } from '@site/_lib/singleton-page'

const page = singletonPage('about')

export const generateMetadata = page.generateMetadata
export default page.Route
