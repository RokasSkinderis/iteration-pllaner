export const getFormattedDate = (date) => {
    const newDate = new Date(date)
    let day = newDate.getDate().toString().padStart(2, '0');
    let month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    let year = newDate.getFullYear().toString().slice(-2);

    return `${day}/${month}/${year}`;
}