import { useLocation, Navigate } from 'react-router-dom'

const RequireAuth = ({ children, ...props }) => {
    const location = useLocation()
    const isAuth = false

    if (!isAuth) {
        return <Navigate to="/login" state={{ from: location }} />
    }

    return children
}
export default RequireAuth
