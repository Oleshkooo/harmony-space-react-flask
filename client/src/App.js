import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import MeditationsContextProvider from '@context/MeditationsContext'

import RequireAuth from '@hoc/RequireAuth'
import RequireAdmin from '@hoc/RequireAdmin'
import useAuth from '@hooks/useAuth'

import Sidebar from '@components/Sidebar'
import Login from '@pages/other/Login'
import Register from '@pages/other/Register'
import NotFound from '@pages/other/NotFound'

import Main from '@pages/Main'
import Articles from '@pages/Articles'
import ArticlesExact from '@pages/ArticlesExact'
import Meditations from '@pages/Meditations'
import Chat from '@pages/Chat'
import AdminChat from '@pages/AdminChat'
import AdminChatList from '@pages/AdminChatList'
import Hotline from '@pages/Hotline'

const App = () => {
    const auth = useAuth()

    return (
        <>
            <Toaster containerClassName="toaster" position="top-center" reverseOrder={false} />
            <Sidebar />

            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/hotline" element={<Hotline />} />
                <Route path="/articles" element={<Articles />} />
                <Route path="/articles/:id" element={<ArticlesExact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                    path="/meditations"
                    element={
                        <RequireAuth>
                            <MeditationsContextProvider>
                                <Meditations />
                            </MeditationsContextProvider>
                        </RequireAuth>
                    }
                />
                <Route
                    path="/chat"
                    element={
                        <RequireAuth>{auth.isAdmin === true ? <AdminChatList /> : <Chat />}</RequireAuth>
                    }
                />
                <Route
                    path="/chat/:id"
                    element={
                        <RequireAdmin>
                            <AdminChat />
                        </RequireAdmin>
                    }
                />

                <Route path="*" element={<NotFound />} />
            </Routes>
        </>
    )
}
export default App
