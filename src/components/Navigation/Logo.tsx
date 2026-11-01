import Image from 'next/image'
import { navigation } from 'styled-system/recipes'

const s = navigation()

export function Logo() {
  return (
    <Image
      src="/img/logo_ZSB.svg"
      alt="ZSB Logo"
      width={60}
      height={60}
      className={s.logoImg}
      unoptimized
      preload
    />
  )
}
