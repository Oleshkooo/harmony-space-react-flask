import { useContext } from 'react'

import { AuthContext } from '@context/AuthContext'

const useAuth = () => {
    const context = useContext(AuthContext)

    if (context === undefined)
        throw new Error('useAuth context must be used within a AuthContext Provider')

    return context
}
export default useAuth
