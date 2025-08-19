import errorIcon from "../assets/icon/error.svg"

const ColorsSet = {
    success: "#10B981",
    error: "#EF4444"
}

export const createToast = (
    message: string,
    type: "success" | "error"
) => {
    const notificationId = "arabix-notification-toast"

    // Remove existing notification if any
    const existingNotification = document.getElementById(notificationId)
    if (existingNotification) {
        existingNotification.remove()
    }

    // Create notification element
    const notification = document.createElement("div")
    notification.id = notificationId
    notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 12px 16px;
    max-width: 250px;
    border-radius: 4px;
    color: white;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    z-index: 99999;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
    display: flex;
  `

    // Set color based on type
    switch (type) {
        case "success":
            notification.style.backgroundColor = ColorsSet.success
            break
        case "error":
            notification.style.backgroundColor = ColorsSet.error
            break
        default:
            notification.style.backgroundColor = ColorsSet.success
    }

    const icon = document.createElement("img")
    icon.src = errorIcon
    icon.style.cssText = `
        width: 28px;
        margin-right: 8px;
    `
    notification.appendChild(icon)

    const details = document.createElement("p")
    details.innerText = message
    details.style.cssText = `
    font-size: 14px;
    margin: 0;
    padding: 0;
    `
    notification.appendChild(details)


    document.body.appendChild(notification)

    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = "0"
        setTimeout(() => notification.remove(), 300)
    }, 5000)
}