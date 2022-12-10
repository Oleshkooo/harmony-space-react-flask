import { useLocation, Navigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import useAuth from '@hooks/useAuth'

const RequireAuth = ({ children }) => {
    const location = useLocation()
    const { isAuth } = useAuth()

    if (!isAuth) {
        // toast.error('Ви повинні увійти, щоб переглянути цю сторінку')
        return <Navigate to="/login" state={{ from: location }} />
    }

    return children
}
export default RequireAuth
