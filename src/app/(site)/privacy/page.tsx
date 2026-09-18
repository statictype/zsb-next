import { singletonPage } from '@site/_lib/singleton-page'

const page = singletonPage('privacy')

export const generateMetadata = page.generateMetadata
export default page.Route
