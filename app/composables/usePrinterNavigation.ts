interface PrinterNavigationRequest {
  path: string
  sequence: number
}

export const usePrinterNavigation = () => {
  const request = useState<PrinterNavigationRequest>('printer-navigation-request', () => ({
    path: '',
    sequence: 0
  }))
  const handledSequence = useState('printer-navigation-handled', () => 0)

  const requestPrint = (path: string) => {
    request.value = {
      path,
      sequence: request.value.sequence + 1
    }
  }

  const consumePrintRequest = (path: string) => {
    if (request.value.path !== path || request.value.sequence <= handledSequence.value) {
      return false
    }

    handledSequence.value = request.value.sequence
    return true
  }

  return {
    request: readonly(request),
    requestPrint,
    consumePrintRequest
  }
}
