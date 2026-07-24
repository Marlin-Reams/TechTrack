export function isToday(date: Date): boolean {

    const today = new Date();

    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );

}

export function isThisWeek(date: Date): boolean {

    const today = new Date();

    const startOfWeek = new Date(today);

    startOfWeek.setHours(0, 0, 0, 0);

    // Firestone payroll week:
    // Sunday through Saturday

    startOfWeek.setDate(
        startOfWeek.getDate() -
        startOfWeek.getDay()
    );

    const endOfWeek = new Date(startOfWeek);

    endOfWeek.setDate(
        endOfWeek.getDate() + 7
    );

    return (
        date >= startOfWeek &&
        date < endOfWeek
    );

}

export function isThisMonth(date: Date): boolean {

    const today = new Date();

    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth()
    );

}

export function isThisYear(date: Date): boolean {

    return (
        date.getFullYear() ===
        new Date().getFullYear()
    );

}