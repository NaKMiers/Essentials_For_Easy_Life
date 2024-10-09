import { memo, useEffect, useRef } from 'react'
import { RiDonutChartFill } from 'react-icons/ri'

interface ConfirmDialogProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  title: string
  content: string
  acceptLabel?: string
  cancelLabel?: string
  onAccept: () => void
  isLoading?: boolean
  color?: string
  className?: string
}

function ConfirmDialog({
  open,
  setOpen,
  title,
  content,
  acceptLabel,
  cancelLabel,
  onAccept,
  isLoading = false,
  color = 'rose',
  className = '',
}: ConfirmDialogProps) {
  // ref
  const modalRef = useRef<HTMLDivElement>(null)
  const modalBodyRef = useRef<HTMLDivElement>(null)

  // show/hide modal
  useEffect(() => {
    if (open) {
      // show modal
      modalRef.current?.classList.remove('hidden')
      modalRef.current?.classList.add('flex')

      setTimeout(() => {
        // fade in modal
        modalRef.current?.classList.remove('opacity-0')

        // float in modal body
        modalBodyRef.current?.classList.remove('opacity-0')
        modalBodyRef.current?.classList.remove('translate-y-8')
      }, 1)
    } else {
      // fade out modal
      modalRef.current?.classList.add('opacity-0')

      // float out modal body
      modalBodyRef.current?.classList.add('opacity-0')
      modalBodyRef.current?.classList.add('translate-y-8')

      setTimeout(() => {
        // hide modal
        modalRef.current?.classList.add('hidden')
        modalRef.current?.classList.remove('flex')
      }, 350)
    }
  }, [open])

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (open) {
        // ESC
        if (e.key === 'Escape') {
          setOpen(false)
        }

        // Enter
        if (e.key === 'Enter') {
          onAccept()
          setOpen(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setOpen, onAccept, open])

  return (
    <div
      className="trans-300 fixed left-0 top-0 z-50 hidden h-screen w-screen items-center justify-center bg-black bg-opacity-10 p-21 text-dark opacity-0"
      ref={modalRef}
      onClick={() => setOpen(false)}
    >
      <div
        className={`trans-300 relative z-50 max-h-[500px] w-full max-w-[500px] translate-y-8 rounded-medium bg-white p-21 opacity-0 shadow-medium-light ${className}`}
        ref={modalBodyRef}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold tracking-wide">{title}</h2>
        <hr className="my-2" />

        <p className="font-body tracking-wide">{content}</p>

        <hr className="my-2" />

        <div className="flex select-none items-center justify-end gap-3">
          <button
            className={`trans-200 rounded-lg border border-slate-300 px-3 py-2 shadow-lg hover:bg-slate-300 hover:text-light ${
              isLoading ? 'pointer-events-none' : ''
            }`}
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            {cancelLabel || 'Cancel'}
          </button>
          <button
            className={`rounded-lg border px-3 py-2 shadow-lg text-${color}-500 trans-200 hover:border-secondary hover:bg-secondary hover:text-light ${
              isLoading ? 'pointer-events-none border-slate-300' : `border-${color}-500`
            }`}
            onClick={() => {
              onAccept()
              setOpen(false)
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <RiDonutChartFill
                size={24}
                className="animate-spin text-slate-300"
              />
            ) : (
              acceptLabel || 'Accept'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(ConfirmDialog)
