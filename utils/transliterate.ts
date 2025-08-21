import { isTransliteratable } from "./api";



const getSelectedInput = (): Element => {
  const selectedElement = document.activeElement
  if (
    !selectedElement ||
    (selectedElement instanceof HTMLElement &&
      !(selectedElement.contentEditable != "false") &&
      !(selectedElement instanceof HTMLInputElement) &&
      !(selectedElement instanceof HTMLTextAreaElement))
  )
    return
  return selectedElement
}

const getAccessForInstanceType = (selectedElement: Element): string => {
  if (
    selectedElement instanceof HTMLInputElement ||
    selectedElement instanceof HTMLTextAreaElement
  )
    return "value"
  else if (selectedElement instanceof HTMLElement) return "textContent"
  else return
}

function isAppendableTextArea(element: Element) {
const divOrSpanChildren = Array.from(element.childNodes)
  .filter(node =>
    node.nodeType === Node.ELEMENT_NODE &&
    (node.nodeName === 'DIV' || node.nodeName === 'SPAN' || node.nodeName === 'P')
  );
  return divOrSpanChildren.length === 0
}

function simulateUserTextInput(el: Element, text: string) {
  console.log(isAppendableTextArea(el))
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    el.focus()

    el.value = text

    const event = new Event("input", {
      bubbles: true,
      cancelable: true
    })
    el.dispatchEvent(event)
  } else if (el instanceof HTMLElement && el.contentEditable && el.contentEditable != "false" && !isAppendableTextArea(el)) {
    el.focus()

    const selection = window.getSelection()
    if (!selection) return

    const range = document.createRange()
    range.selectNodeContents(el)

    selection.removeAllRanges()
    selection.addRange(range)

    const deleteEvent = new InputEvent("beforeinput", {
      inputType: "deleteContent",
      data: null,
      bubbles: true,
      cancelable: true
    })
    el.dispatchEvent(deleteEvent)

    const insertEvent = new InputEvent("beforeinput", {
      inputType: "insertText",
      data: text,
      bubbles: true,
      cancelable: true
    })
    el.dispatchEvent(insertEvent)
  } else if (el instanceof HTMLElement && el.isContentEditable) {
    el.innerText = text;
  }
}

function loadingTextAnimation(selectedElement) {
  let loadingStr = "";
  let asc = true;
  return setInterval(() => {
    if (loadingStr.length === 3 && asc) asc = false
    else if (loadingStr.length === 0 && !asc) asc = true

    if (asc) loadingStr += '.'
    else loadingStr = loadingStr.slice(0, loadingStr.length - 1)
    simulateUserTextInput(selectedElement, loadingStr)
  }, 500)
}

let animationQueue: (string | null)[] = [];
function appendTextWithAnimation(selectedElement) {
  let animationInteval = setInterval(() => {
    const text = selectedElement[getAccessForInstanceType(selectedElement)];
    if (animationQueue.length == 0) return
    else if (animationQueue[0] === null) {
      clearInterval(animationInteval)
      animationQueue = []
      simulateUserTextInput(selectedElement, text.trim())
      return
    }
    let word = animationQueue[0]
    if (word === "") {
      simulateUserTextInput(selectedElement, text + " ")
      animationQueue = animationQueue.slice(1)
      return
    }
    simulateUserTextInput(selectedElement, text + word[0])
    animationQueue[0] = word.substring(1);
  }, 80)
}

export const getTransliteration = async (word: string): Promise<string> => {
  return new Promise((resolve, reject) => {

    chrome.runtime.sendMessage(
      {
        type: "transliterate",
        payload: { text: word }
      },
      (response: { error?: string, data?: { text: string } }) => {
        if (response.error) {
          console.error("An error occured", response.error)
          reject(response.error)
        } else {
          console.log("React: recieved response")
          console.log(response)
          resolve(response.data.text)
        }
      }
    )
  }
  )
}

const getToggleStateForInstance = (element: Element) => {
  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  )
    return "readonly"
  else if (element instanceof HTMLElement) return "contenteditable"
  else return
}

const toggleModifyState = (element: Element) => {
  const currentState = element[getToggleStateForInstance(element)]
  currentState[getToggleStateForInstance(element)] = !currentState;
}

const splitBySpaceOutOfIgnore = (str: string): string[] => {
  const res: string[] = []
  const normalSplit: string[] = str.split(" ")
  let i = 0
  while (i < normalSplit.length) {
    console.log(i)
    if (!normalSplit[i].includes("/ignore{")) {
      res.push(normalSplit[i])
      i++
      continue
    }
    let word: string[] = []
    while (!normalSplit[i].includes("}")) { word.push(normalSplit[i]); i++ }
    word.push(normalSplit[i])
    res.push(word.join(" "))
    i++;
  }
  return res
}

const cleanSplittedWords = (words: string[]): string[] => {
  const res: string[] = []
  const containsAlphaNumericRegex = new RegExp("[A-Za-z0-9]")
  const containsNonAlphaNumericRegex = new RegExp("[^A-Za-z0-9]")
  for (let word of words) {
    if (!isTransliteratable(word) || word.includes("/ignore{")) {
      res.push(word)
      continue
    }

    let i = 0;
    let j = 1;
    while (j <= word.length) {
      let substring = word.substring(i, j)
      if (containsAlphaNumericRegex.test(substring) && containsNonAlphaNumericRegex.test(substring)) {
        res.push(word.substring(i, j - 1))
        i = j - 1
      } else j++

      if (j > word.length && (containsAlphaNumericRegex.test(substring) && containsNonAlphaNumericRegex.test(substring))) {
        res.push(word[j - 2])
      } else if (j > word.length) {
        res.push(substring)
      }
    }
  }
  return res
}

const countApiCall = async (text: string) => {
  chrome.runtime.sendMessage({
    type: "log",
    payload: {
      logType: "inputTransliteration",
      numberOfWords: text.split(" ").length,
      numberOfLetters: text.length
    }
  })
}

export const transliterateSelectedInput = async (current?: Element) => {

  let loadingInt;
  const selectedElement = current ? current : getSelectedInput()
  if (!selectedElement) return
  const text = selectedElement[getAccessForInstanceType(selectedElement)]
  if (!text) return
  console.log("Running animation")
  loadingInt = loadingTextAnimation(selectedElement)


  // toggleModifyState(selectedElement)
  appendTextWithAnimation(selectedElement)
  console.log("Recieved text in client", text)
  let isApiCallCounted = false
  for (let word of cleanSplittedWords(splitBySpaceOutOfIgnore(text))) {
    console.log("from content", word)
    let transliteratedWord = await getTransliteration(word);

    if (!isApiCallCounted && transliteratedWord != word) {
      isApiCallCounted = true
      countApiCall(text)
    }

    if (loadingInt) {
      clearInterval(loadingInt)
      loadingInt = null
      simulateUserTextInput(selectedElement, " ")
    };
    console.log(transliteratedWord)
    animationQueue.push(transliteratedWord)
  }
  // toggleModifyState(selectedElement)
  animationQueue.push(null)
}