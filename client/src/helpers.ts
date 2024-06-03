export function formatReadableDate(isoDate: string): string {
    const date = new Date(isoDate);

    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false // 24-hour format
    };

    return date.toLocaleTimeString('en-GB', options);
}