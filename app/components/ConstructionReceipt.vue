<script setup lang="ts">
const props = defineProps<{
  title: string
  missing?: boolean
  scrollKey?: string
}>()

const route = useRoute()
const router = useRouter()
const { request, consumePrintRequest } = usePrinterNavigation()
const printingText = 'Printing...'.split('')
const printSequence = ref(0)
const isPrinting = ref(false)
const hasPrintAnimation = ref(false)
const isActivePage = ref(false)
const activePath = ref(route.path)
const initialAnimationPlayed = useState('printer-initial-animation-played', () => false)
const historyNavigation = useState('printer-history-navigation', () => false)
const documentNavigationChecked = useState('printer-document-navigation-checked', () => false)
const receiptContent = ref<HTMLElement | null>(null)
const scrollPositions = useState<Record<string, number>>('receipt-scroll-positions', () => ({}))
const scrollPositionKey = computed(() => props.scrollKey ?? props.title)
let printFallbackTimer: ReturnType<typeof setTimeout> | undefined
let removeRouterHook: (() => void) | undefined
let removeHistoryHook: (() => void) | undefined

const titleLength = computed(() => [...props.title].reduce((length, character) => {
  return length + (character.charCodeAt(0) > 255 ? 1 : 0.6)
}, 0))

const displayAnnouncement = computed(() => {
  if (props.missing) return '建设中...'
  return isPrinting.value ? 'Printing...' : props.title
})

const clearPrintFallback = () => clearTimeout(printFallbackTimer)

const stopPrinting = () => {
  isPrinting.value = false
  hasPrintAnimation.value = false
  clearPrintFallback()
}

const schedulePrintFallback = () => {
  clearPrintFallback()
  if (props.missing) return

  const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 3000
  printFallbackTimer = setTimeout(stopPrinting, duration)
}

const beginPrinting = () => {
  isPrinting.value = true
  hasPrintAnimation.value = true
  printSequence.value += 1
  if (import.meta.client) schedulePrintFallback()
}

const finishPrinting = (event: AnimationEvent) => {
  if (event.target === event.currentTarget && event.animationName === 'display') {
    stopPrinting()
  }
}

const enterPage = () => {
  isActivePage.value = true
  activePath.value = route.path

  const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  const isInitialDocumentHistory = !documentNavigationChecked.value
    && navigationEntry?.type === 'back_forward'
  const isHistoryNavigation = historyNavigation.value || isInitialDocumentHistory
  documentNavigationChecked.value = true

  if (props.missing) {
    historyNavigation.value = false
    stopPrinting()
    initialAnimationPlayed.value = true
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
    !props.missing
    && isActivePage.value
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
  clearPrintFallback()
})
</script>

<template>
  <main class="receipt-page">
    <div class="wrapper" :class="{ 'is-printing': hasPrintAnimation }">
      <div class="printer" />

      <div :key="`display-${printSequence}`" class="printer-display" :class="{ 'is-error': props.missing }"
        aria-live="polite" aria-atomic="true">
        <span class="sr-only">{{ displayAnnouncement }}</span>
        <span v-if="props.missing" class="printer-message" aria-hidden="true">建设中...</span>
        <div v-else-if="isPrinting" class="letter-wrapper" aria-hidden="true">
          <span v-for="(letter, index) in printingText" :key="index" class="letter">{{ letter }}</span>
        </div>
        <div v-else class="printer-result-viewport" aria-hidden="true">
          <span class="printer-result" :class="{ 'is-scrolling': titleLength > 10 }">
            {{ props.title }}
          </span>
        </div>
      </div>

      <SiteMenu />

      <div v-if="!props.missing" class="paper-viewport">
        <div :key="`receipt-${printSequence}`" :class="{ 'is-ready': !hasPrintAnimation }" class="receipt-wrapper"
          @animationend="finishPrinting">
          <article class="receipt" :aria-label="props.title">
            <div ref="receiptContent" class="receipt-content" @scroll.passive="rememberScrollPosition">
              <slot>
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
      2020-PRESENT © YIHENG
    </footer>
  </main>
</template>
