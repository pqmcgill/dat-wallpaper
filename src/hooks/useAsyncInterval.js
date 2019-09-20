import { useState, useEffect, useCallback, useRef } from 'react'

export default function useAsyncInterval(asyncFn, delay) {
  const [isStarted, setIsStarted] = useState()
  const [isProcessing, setIsProcessing] = useState(false)
  
  const timeoutRef = useRef()

  const start = useCallback(() => {
    setIsStarted(true)
  }, [])

  const stop = useCallback(() => {
    setIsStarted(false)
    setIsProcessing(false)
    clearTimeout(timeoutRef.current)
  }, [])

  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = asyncFn
  }, [asyncFn])

  useEffect(() => {
    if (isStarted && !isProcessing) {
      setIsProcessing(true)
      timeoutRef.current = setTimeout(() => {
        savedCallback.current(() => {
          setIsProcessing(false)
        })
      }, delay)
    }
  }, [delay, isProcessing, isStarted])

  return {
    start,
    stop
  }
}