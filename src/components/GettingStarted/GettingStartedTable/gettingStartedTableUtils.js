export const sortComparator = (a, b, orderBy, order) => {
    if (b[orderBy] < a[orderBy]) {
        return order === 'desc' ? -1 : 1;
    }
    if (b[orderBy] > a[orderBy]) {
        return order === 'desc' ? 1 : -1;
    }
    return 0;
}