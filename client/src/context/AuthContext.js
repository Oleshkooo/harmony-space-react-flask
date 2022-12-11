import { useState, createContext } from 'react'
import Cookies from 'js-cookie'

export const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {
    // const [isAuth, setAuthState] = useState(Cookies.get('isAuth') || false)
    // const [userId, setUserIdState] = useState(Cookies.get('userId') || '')
    // const [username, setUsernameState] = useState(Cookies.get('username') || '')
    const [isAuth, setAuthState] = useState(localStorage.getItem('isAuth') || false)
    const [userId, setUserIdState] = useState(localStorage.getItem('userId') || '')
    const [username, setUsernameState] = useState(localStorage.getItem('username') || '')

    const setAuth = value => {
        // Cookies.set('isAuth', value)
        localStorage.setItem('isAuth', value)
        setAuthState(value)
    }

    const setUserId = value => {
        // Cookies.set('userId', value)
        localStorage.setItem('userId', value)
        setUserIdState(value)
    }

    const setUsername = value => {
        // Cookies.set('username', value)
        localStorage.setItem('username', value)
        setUsernameState(value)
    }

    const clearData = () => {
        // Cookies.remove('isAuth')
        // Cookies.remove('userId')
        // Cookies.remove('username')
        localStorage.removeItem('isAuth')
        localStorage.removeItem('userId')
        localStorage.removeItem('username')
        setAuthState(false)
        setUserIdState('')
        setUsernameState('')
    }

    return (
        <AuthContext.Provider value={{ isAuth, setAuth, userId, setUserId, username, setUsername, clearData }}>
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContextProvider
