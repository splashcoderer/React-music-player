/** Get amount of minutes between two dates */
export function getDateRange(dateFrom, dateTo, whatToReturn) {
    // if (!dateFrom || !dateTo) return null;
    if (!dateTo) dateTo = new Date();
    const dateFromTime = typeof dateFrom === 'number' ? dateFrom : (typeof dateFrom === 'string' ? new Date(dateFrom) : dateFrom.getTime());
    const dateToTime = typeof dateTo === 'number' ? dateTo : (typeof dateTo === 'string' ? new Date(dateTo) : dateTo.getTime());
    let delimiter = 1000;
    switch(whatToReturn) {
        case 'm':
            delimiter *= 60;
            break;
        case 'h':
            delimiter *= 60 * 60;
            break;
        case 'd':
            delimiter *= 60 * 60 * 24;
            break;
        default:
            break;
    }
    return Math.ceil((dateToTime - dateFromTime) / delimiter);
}
