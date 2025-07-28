import React, {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction
} from "react"

type Props = {
  setText: Dispatch<SetStateAction<string>>
  loading: boolean
}
type Interval = ReturnType<typeof setInterval>

function LoadingText({ setText, loading }: Props) {
  const [text, setNewText] = useState<string>("")
  const textRef = useRef<string>("")
  const nextDirAscRef = useRef<boolean>(true)
  const intervalRef = useRef<Interval | null>(null)

  // Keep ref in sync with state for display
  useEffect(() => {
    textRef.current = text
  }, [text])

  useEffect(() => {
    if (loading) {
      textRef.current = ""
      nextDirAscRef.current = true
      setNewText("")
      setText("")
      const intervalFn = () => {
        let currentText = textRef.current
        let nextText = currentText

        if (nextDirAscRef.current) {
          nextText = currentText + "."
        } else {
          nextText = currentText.slice(0, -1)
        }

        if (nextText.length >= 3) {
          nextDirAscRef.current = false
        } else if (nextText.length === 0) {
          nextDirAscRef.current = true
        }

        textRef.current = nextText
        setNewText(nextText)
        setText(nextText)
      }

      intervalRef.current = setInterval(intervalFn, 500)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [loading])

  return null
}

export default LoadingText
