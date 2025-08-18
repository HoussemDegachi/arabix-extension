const getSelectedInput = (): Element => {
  const selectedElement = document.activeElement
  if (
    !selectedElement ||
    (selectedElement instanceof HTMLElement &&
      !selectedElement.isContentEditable &&
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
  else if (selectedElement instanceof HTMLElement) return "innerText"
  else return
}

function simulateUserTextInput(el: Element, text: string) {
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    el.focus()

    el.value = text

    const event = new Event("input", {
      bubbles: true,
      cancelable: true
    })
    el.dispatchEvent(event)
  } else if (el instanceof HTMLElement && el.isContentEditable) {
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
  // let animationInteval = setInterval(() => {
  //   const text = selectedElement[getAccessForInstanceType(selectedElement)];
  //   if (!word) {
  //     simulateUserTextInput(selectedElement, text + " ")
  //     clearInterval(animationInteval)
  //     return
  //   }
  //   simulateUserTextInput(selectedElement, text + word[0])
  //   word = word.substring(1)
  // }, 100)
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

export const transliterateSelectedInput = async (current?: Element) => {
  let loadingInt;
  const selectedElement = current ? current : getSelectedInput()
  if (!selectedElement) return
  const text = selectedElement[getAccessForInstanceType(selectedElement)]
  if (!text) return
  console.log("Running animation")
  loadingInt = loadingTextAnimation(selectedElement)

  appendTextWithAnimation(selectedElement)
  for (let word of text.split(" ")) {
    let transliteratedWord = await getTransliteration(word);
    if (loadingInt) {
      clearInterval(loadingInt)
      loadingInt = null
      simulateUserTextInput(selectedElement, " ")
    };
    console.log(transliteratedWord)
    animationQueue.push(transliteratedWord)
  }
  animationQueue.push(null)
}