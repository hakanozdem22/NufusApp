import React, { createContext, useContext, useState, ReactNode } from 'react'

interface HeaderContextType {
  title: ReactNode
  setTitle: (title: ReactNode) => void
  subTitle: string | null
  setSubTitle: (subTitle: string | null) => void
  extraContent: ReactNode | null
  setExtraContent: (content: ReactNode | null) => void
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined)

export const HeaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState<ReactNode>('')
  const [subTitle, setSubTitle] = useState<string | null>(null)
  const [extraContent, setExtraContent] = useState<ReactNode | null>(null)

  return (
    <HeaderContext.Provider value={{ title, setTitle, subTitle, setSubTitle, extraContent, setExtraContent }}>
      {children}
    </HeaderContext.Provider>
  )
}

export const useHeader = () => {
  const context = useContext(HeaderContext)
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider')
  }
  return context
}
