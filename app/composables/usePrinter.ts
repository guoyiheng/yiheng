import { ref, readonly } from 'vue'

export type PaperTheme = 'vintage' | 'tractor' | 'thermal' | 'dark'
export type PrintSpeed = '1x' | '2x' | 'typewriter'

const printCycle = ref(0)
const paperTheme = ref<PaperTheme>('vintage')
const printSpeed = ref<PrintSpeed>('1x')
const isPrinting = ref(false)
const isTorn = ref(false)

export function usePrinter() {
  const audio = usePrinterAudio()

  async function reprint() {
    if (isPrinting.value) return
    isTorn.value = false
    isPrinting.value = true
    printCycle.value += 1

    audio.playFeedPaper()

    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // 根据速度设置打印持续时间
    const duration = printSpeed.value === '2x' ? 600 : printSpeed.value === 'typewriter' ? 2400 : 1200

    // 在打印过程中播放几次针打打字音效
    const pinCount = printSpeed.value === 'typewriter' ? 8 : 4
    const intervalTime = duration / (pinCount + 1)
    
    for (let i = 1; i <= pinCount; i++) {
      setTimeout(() => {
        if (isPrinting.value) {
          audio.playPrintPin()
        }
      }, intervalTime * i)
    }

    setTimeout(() => {
      isPrinting.value = false
      audio.playBell()
    }, duration)
  }

  function setTheme(theme: PaperTheme) {
    paperTheme.value = theme
    audio.playKeyClick()
  }

  function setSpeed(speed: PrintSpeed) {
    printSpeed.value = speed
    audio.playKeyClick()
  }

  function tearPaper() {
    if (isPrinting.value) return
    isTorn.value = true
    audio.playTearSound()
  }

  function resetPaper() {
    isTorn.value = false
    audio.playFeedPaper()
  }

  return {
    printCycle: readonly(printCycle),
    paperTheme: readonly(paperTheme),
    printSpeed: readonly(printSpeed),
    isPrinting: readonly(isPrinting),
    isTorn: readonly(isTorn),
    reprint,
    setTheme,
    setSpeed,
    tearPaper,
    resetPaper
  }
}
