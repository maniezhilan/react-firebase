
//https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
export const formatDate = (date) => {
    let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString("en-US", options)
}


//https://stackoverflow.com/questions/4413590/javascript-get-array-of-dates-between-2-dates/15882220
export const getDateRange = (startDate, endDate) => {

    Date.prototype.addDays = function (days) {
        var date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date;
    }

    let addFn = Date.prototype.addDays;
    let interval = 1;

    var retVal = [];
    var current = new Date(startDate);

    while (current <= endDate) {
        retVal.push(this.formatDate(new Date(current)))
        current = addFn.call(current, interval);
    }
    return retVal;
}