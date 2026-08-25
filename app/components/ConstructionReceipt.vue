<script setup lang="ts">
const props = defineProps<{
  title: string
  missing?: boolean
  scrollKey?: string
}>()

const { copyrightYear } = useAppConfig()
const route = useRoute()
const router = useRouter()
const { request, consumePrintRequest } = usePrinterNavigation()
const { themeFeedback } = useSiteTheme()
const printingText = 'Printing...'.split('')
const printSequence = ref(0)
const isPrinting = ref(false)
const hasPrintAnimation = ref(false)
const isPrintPaused = ref(false)
const isPrintRetracting = ref(false)
const isActivePage = ref(false)
const activePath = ref(route.path)
const initialAnimationPlayed = useState('printer-initial-animation-played', () => false)
const historyNavigation = useState('printer-history-navigation', () => false)
const documentNavigationChecked = useState('printer-document-navigation-checked', () => false)
const receiptContent = ref<HTMLElement | null>(null)
const scrollPositions = useState<Record<string, number>>('receipt-scroll-positions', () => ({}))
const scrollPositionKey = computed(() => props.scrollKey ?? props.title)
let printTimer: ReturnType<typeof setTimeout> | undefined
let removeRouterHook: (() => void) | undefined
let removeHistoryHook: (() => void) | undefined

const displayText = computed(() => themeFeedback.value ?? props.title)

const displayTextLength = computed(() => [...displayText.value].reduce((length, character) => {
  return length + (character.charCodeAt(0) > 255 ? 1 : 0.6)
}, 0))

const displayAnnouncement = computed(() => {
  if (isPrintPaused.value) return 'Printer jammed'
  return isPrinting.value ? 'Printing...' : displayText.value
})

const clearPrintTimer = () => clearTimeout(printTimer)

const stopPrinting = () => {
  isPrinting.value = false
  hasPrintAnimation.value = false
  isPrintPaused.value = false
  isPrintRetracting.value = false
  clearPrintTimer()
}

const schedulePrintTimer = () => {
  clearPrintTimer()

  if (props.missing) {
    printTimer = setTimeout(() => {
      isPrintPaused.value = true
      isPrintRetracting.value = true
    }, 300)
    return
  }

  const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 1200
  printTimer = setTimeout(stopPrinting, duration)
}

const beginPrinting = () => {
  isPrinting.value = true
  hasPrintAnimation.value = true
  isPrintPaused.value = false
  isPrintRetracting.value = false
  printSequence.value += 1
  if (import.meta.client) schedulePrintTimer()
}

const finishPrinting = (event: AnimationEvent) => {
  if (event.target === event.currentTarget && event.animationName === 'display') {
    stopPrinting()
  }
}

const enterPage = () => {
  const wasActive = isActivePage.value
  isActivePage.value = true
  activePath.value = route.path

  const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  const isInitialDocumentHistory = !documentNavigationChecked.value
    && navigationEntry?.type === 'back_forward'
  const isHistoryNavigation = historyNavigation.value || isInitialDocumentHistory
  documentNavigationChecked.value = true

  if (props.missing && !wasActive) {
    historyNavigation.value = false
    consumePrintRequest(activePath.value)
    initialAnimationPlayed.value = true
    beginPrinting()
    return
  }

  if (isHistoryNavigation) {
    historyNavigation.value = false
    consumePrintRequest(activePath.value)
    stopPrinting()
    initialAnimationPlayed.value = true
    return
  }

  const isMenuRequest = consumePrintRequest(activePath.value)
  const isFirstEntry = !initialAnimationPlayed.value
  initialAnimationPlayed.value = true

  if (isMenuRequest || isFirstEntry) beginPrinting()
}

const rememberScrollPosition = () => {
  if (receiptContent.value) {
    const position = receiptContent.value.scrollTop
    scrollPositions.value[scrollPositionKey.value] = position
  }
}

const restoreScrollPosition = async () => {
  await nextTick()
  const position = scrollPositions.value[scrollPositionKey.value] ?? 0
  const restore = () => {
    if (receiptContent.value) {
      receiptContent.value.scrollTop = position
    }
  }

  restore()
  if (import.meta.client) {
    requestAnimationFrame(() => requestAnimationFrame(restore))
    setTimeout(restore)
  }
}

onMounted(() => {
  const markHistoryNavigation = () => {
    historyNavigation.value = true
  }
  const stopForPageExit = () => stopPrinting()
  const stopForCachedPageRestore = (event: PageTransitionEvent) => {
    if (event.persisted) stopPrinting()
  }

  window.addEventListener('popstate', markHistoryNavigation)
  window.addEventListener('pagehide', stopForPageExit)
  window.addEventListener('pageshow', stopForCachedPageRestore)
  removeHistoryHook = () => {
    window.removeEventListener('popstate', markHistoryNavigation)
    window.removeEventListener('pagehide', stopForPageExit)
    window.removeEventListener('pageshow', stopForCachedPageRestore)
  }

  enterPage()
  void restoreScrollPosition()
  if (props.scrollKey) {
    removeRouterHook = router.afterEach((to) => {
      if (to.fullPath === props.scrollKey) {
        setTimeout(() => void restoreScrollPosition(), 50)
      }
    })
  }
})

onActivated(() => {
  enterPage()
  void restoreScrollPosition()
})

onDeactivated(() => {
  isActivePage.value = false
  stopPrinting()
})

onBeforeRouteLeave(rememberScrollPosition)

watch(() => request.value.sequence, () => {
  if (
    isActivePage.value
    && !historyNavigation.value
    && request.value.path === activePath.value
    && consumePrintRequest(activePath.value)
  ) {
    beginPrinting()
  }
})

onBeforeUnmount(() => {
  removeRouterHook?.()
  removeHistoryHook?.()
  clearPrintTimer()
})
</script>

<template>
  <main class="receipt-page">
    <div
      class="wrapper"
      :class="{
        'is-printing': hasPrintAnimation,
        'is-print-paused': isPrintPaused,
        'is-print-retracting': isPrintRetracting
      }"
    >
      <div class="printer" />

      <div :key="`display-${printSequence}`" class="printer-display" aria-live="polite" aria-atomic="true">
        <span class="sr-only">{{ displayAnnouncement }}</span>
        <div v-if="isPrintPaused" class="printer-result-viewport" aria-hidden="true">
          <span class="printer-result is-jammed">Printer jammed</span>
        </div>
        <div v-else-if="isPrinting" class="letter-wrapper" aria-hidden="true">
          <span v-for="(letter, index) in printingText" :key="index" class="letter">{{ letter }}</span>
        </div>
        <div v-else class="printer-result-viewport" aria-hidden="true">
          <span class="printer-result" :class="{ 'is-scrolling': displayTextLength > 10 }">
            {{ displayText }}
          </span>
        </div>
      </div>

      <div class="printer-toolbar">
        <SiteMenu />
        <PrinterThemeControls />
      </div>

      <div class="paper-viewport">
        <div :key="`receipt-${printSequence}`" :class="{ 'is-ready': !hasPrintAnimation }" class="receipt-wrapper"
          @animationend="finishPrinting">
          <article class="receipt" :aria-label="props.missing ? '404 页面不存在' : props.title">
            <div
              ref="receiptContent"
              class="receipt-content"
              @scroll.passive="rememberScrollPosition"
            >
              <div v-if="props.missing" class="receipt-not-found">
                <PageHeading id="not-found-heading" title="404" />
              </div>

              <slot v-else>
                <table class="receipt-table">
                  <tbody>
                    <tr>
                      <th>Item</th>
                      <th>Qty</th>
                      <th>Price</th>
                    </tr>
                    <tr>
                      <td>Structure</td>
                      <td>1 x</td>
                      <td>0.00</td>
                    </tr>
                    <tr>
                      <td>Content</td>
                      <td>0 x</td>
                      <td>0.00</td>
                    </tr>
                    <tr>
                      <td>Progress</td>
                      <td>1 x</td>
                      <td>0.00</td>
                    </tr>
                    <tr class="receipt-subtotal">
                      <td colspan="2">Subtotal</td>
                      <td>0.00</td>
                    </tr>
                    <tr class="receipt-tax">
                      <td colspan="2">Tax (0%)</td>
                      <td>0.00</td>
                    </tr>
                    <tr class="receipt-total">
                      <td colspan="2">Total</td>
                      <td>0.00</td>
                    </tr>
                  </tbody>
                </table>
              </slot>
            </div>
          </article>
        </div>
      </div>
    </div>

    <footer class="site-copyright">
      © {{ copyrightYear }} yiheng
    </footer>
  </main>
</template>
