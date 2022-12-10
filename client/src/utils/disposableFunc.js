const disposableFunc = func => {
    let executed = false
    return (...args) => {
        if (!executed) {
            executed = true
            func(...args)
        }
    }
}
export default disposableFunc
