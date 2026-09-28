import localFont from 'next/font/local'

const delaGothic = localFont({
  src: '../../../assets/fonts/DelaGothicOne-Latin.woff2',
  weight: '400',
  variable: '--font-dela-gothic',
  display: 'swap',
})

const montserrat = localFont({
  src: '../../../assets/fonts/Montserrat-Latin.woff2',
  weight: '300 700',
  variable: '--font-montserrat',
  display: 'swap',
})

export const fontVariables = `${delaGothic.variable} ${montserrat.variable}`
