import { Routes, Route } from 'react-router-dom'

import RequireAuth from '@hoc/RequireAuth'

import Sidebar from '@components/Sidebar'
import Main from '@pages/Main'
import Login from '@pages/auth/Login'
import Register from '@pages/auth/Register'

const App = () => {
    return (
        <>
            <Sidebar />
            <Routes>
                <Route path="/" element={<Main />} />
                <Route
                    path="/about"
                    element={
                        <RequireAuth>
                            <Main />
                        </RequireAuth>
                    }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </>
    )
}
export default App
