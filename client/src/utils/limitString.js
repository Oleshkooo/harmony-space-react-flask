const limitString = (str, limit = 0, end = '...') => {
    if (limit === 0 || str.length < limit)
        return str

    return str.slice(0, limit) + end
}
export default limitString