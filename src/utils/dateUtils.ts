class DateUtils {
    getCurrentDate() {
        return new Date().toISOString().slice(0, 10) +
            "/" +
            new Date().toLocaleTimeString('en-US', {
                hour12: false,
                hour: "numeric",
                minute: "numeric"
            })
    }
}

module.exports = new DateUtils()

