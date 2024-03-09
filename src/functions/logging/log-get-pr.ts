import styles from 'ansi-styles'

export function logGetPr(prLength): string {
  const getPr = `${styles.bold.open}[${styles.magenta.open}${prLength}${styles.magenta.close}] ${styles.blueBright.open}pull requests found${styles.blueBright.close}.${styles.bold.close}`

  return getPr
}
