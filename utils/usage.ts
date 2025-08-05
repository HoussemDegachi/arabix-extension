import dayjs from "dayjs"
import type { Usage } from "~types/Usage"

export const generateInitialUsage = () => {
    const data = []
    for (let i = 6; i >= 0; i--) {
        data.push({
            date: dayjs().subtract(i, "day").format("MMM D"),
            usage: 0
        })
    }
    return data
}

export const increaseUsage = (currentUsageLog: Usage): Usage => {
    const today = dayjs().format("MMM D")
    if (currentUsageLog[currentUsageLog.length - 1].date === today) {
        currentUsageLog[currentUsageLog.length - 1].usage = currentUsageLog[currentUsageLog.length - 1].usage + 1;
    } else {
        currentUsageLog.splice(0, 1)
        currentUsageLog.push({
            "date": today,
            "usage": 1
        })
    }
    return currentUsageLog
}