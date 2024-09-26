export function convertToSeconds(day, timestamp) {
    let [tmonth, tday] = [parseInt(day.slice(0, 2)), parseInt(day.slice(2, 4))];
    let [temp_time, milliseconds] = timestamp.includes('.') ? timestamp.split('.', 2) : [timestamp, 0];
    let temp = temp_time.split(':');
    let seconds = tmonth * 2628000 + tday * 86400 + parseInt(temp[0]) * 3600 + parseInt(temp[1]) * 60 + parseInt(temp[2]);
    return parseFloat(seconds.toString() + '.' + milliseconds.toString());
}

export function splitStringIntoParts(string, sep, length) {
    return [
        ...string.split(sep, length - 1),
        string.split(sep).slice(length - 1).join(sep)
    ]
}