import { useEffect } from 'react'

const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), summary, [tabindex]:not([tabindex="-1"])'

export function useDialogFocusTrap(isOpen: boolean) {
  useEffect(() => {
    if (!isOpen) return

    const previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const dialog = document.querySelector<HTMLDivElement>('[role="dialog"][aria-modal="true"]')
    if (!dialog) return
    const getFocusableElements = () => Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector))
      .filter((element) => element.offsetParent !== null)
    const focusTimer = window.setTimeout(() => {
      const preferredTarget = dialog.querySelector<HTMLElement>('[data-dialog-autofocus], button[aria-label^="Закрыть"]')
      ;(preferredTarget ?? getFocusableElements()[0])?.focus()
    }, 0)

    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const focusableElements = getFocusableElements()
      if (!focusableElements.length) return

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', trapFocus)
    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', trapFocus)
      previouslyFocusedElement?.focus()
    }
  }, [isOpen])

}
