import { useState, createContext } from 'react'
import Cookies from 'js-cookie'

export const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {
    const [isAuth, setAuthState] = useState(localStorage.getItem('isAuth') || false)
    const [userId, setUserIdState] = useState(localStorage.getItem('userId') || '')
    const [username, setUsernameState] = useState(localStorage.getItem('username') || '')
    const [isAdmin, setAdminSate] = useState(localStorage.getItem('isAdmin') || false)

    const setAuth = value => {
        localStorage.setItem('isAuth', value)
        setAuthState(value)
    }

    const setUserId = value => {
        localStorage.setItem('userId', value)
        setUserIdState(value)
    }

    const setUsername = value => {
        localStorage.setItem('username', value)
        setUsernameState(value)
    }

    const setAdmin = value => {
        localStorage.setItem('isAdmin', value)
        setAdminSate(value)
    }

    const clearData = () => {
        localStorage.removeItem('isAuth')
        localStorage.removeItem('userId')
        localStorage.removeItem('username')
        localStorage.removeItem('isAdmin')
        setAuthState(false)
        setUserIdState('')
        setUsernameState('')
        setAdminSate(false)
    }

    return (
        <AuthContext.Provider
            value={{
                isAuth,
                setAuth,
                userId,
                setUserId,
                username,
                setUsername,
                isAdmin,
                setAdmin,
                clearData,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
export default AuthContextProvider
