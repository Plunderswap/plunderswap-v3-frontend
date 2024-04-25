let swapSound: HTMLAudioElement

const swapSoundURL = 'https://dev-v3.plunderswap.com/sounds/coins.mp3'

export const getSwapSound = () => {
  if (!swapSound) {
    swapSound = new Audio(swapSoundURL)
  }
  return swapSound
}
