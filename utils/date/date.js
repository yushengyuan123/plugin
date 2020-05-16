//change the data format to suit frontEnd pages
export function formatData(data) {
    const replica = []
    for (let i = 0; i < data.length; i++) {
        replica.push({
            key: data[i].key,
            index: data[i].index,
            time: data[i].time.split(' ')[1].split(':', 2).join(':'),
            id: data[i].id,
            status: data[i].status
        })
    }
    return replica
}

export function nowDate(hour, minutes, time) {
    let date = new Date()
    let month = date.getMonth()+1 >= 10 ? date.getMonth()+1 : `0${date.getMonth()+1}`
    let day = date.getDate() >= 10 ? date.getDate() : `0${date.getDate()}`
    if (time === 'future') {
        day = date.getDate()+1 >= 10 ? date.getDate()+1 : `0${date.getDate()+1}`
        return `${date.getFullYear()}-${month}-${day} ${hour}:${minutes}:00`
    } else {
        return `${date.getFullYear()}-${month}-${day} ${hour}:${minutes}:00`
    }
}

/**
 * compare the user time of selection to the current real time
 * @param hour
 * @param minutes
 * @returns {boolean}
 */
export function compareDate(hour, minutes) {
    let date = new Date()
    let now = date.getHours()*3600 + date.getMinutes()*60
    let current = parseInt(hour)*3600 + parseInt(minutes)*60
    return now >= current;
}