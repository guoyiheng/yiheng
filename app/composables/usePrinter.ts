export function usePrinter() {
  const printCycle = useState('printer-cycle', () => 0)

  function reprint() {
    printCycle.value += 1

    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return {
    printCycle: readonly(printCycle),
    reprint
  }
}
