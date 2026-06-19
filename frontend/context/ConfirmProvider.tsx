"use client"

import React, { createContext, useContext, useState, useCallback } from "react"
import ConfirmModal from "@/components/ConfirmModal"

type ConfirmOptions = {
  title?: string
  description?: string
  okText?: string
  cancelText?: string
}

type ConfirmContextType = {
  showConfirm: (opts?: ConfirmOptions) => Promise<boolean>
}

const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined)

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<ConfirmOptions>({})
  const [resolver, setResolver] = useState<((v: boolean) => void) | null>(null)

  const showConfirm = useCallback((opts: ConfirmOptions = {}) => {
    setOptions(opts)
    setOpen(true)
    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve)
    })
  }, [])

  const handleConfirm = useCallback(() => {
    setOpen(false)
    if (resolver) resolver(true)
    setResolver(null)
  }, [resolver])

  const handleCancel = useCallback(() => {
    setOpen(false)
    if (resolver) resolver(false)
    setResolver(null)
  }, [resolver])

  return (
    <ConfirmContext.Provider value={{ showConfirm }}>
      {children}
      <ConfirmModal
        open={open}
        title={options.title}
        description={options.description}
        okText={options.okText}
        cancelText={options.cancelText}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const ctx = useContext(ConfirmContext)
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider")
  return ctx
}
