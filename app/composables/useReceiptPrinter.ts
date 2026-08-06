export function useReceiptPrinter() {
  const printCycle = useState('receipt-print-cycle', () => 0)

  function printAgain() {
    printCycle.value += 1
  }

  return {
    printCycle: readonly(printCycle),
    printAgain
  }
}
