import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Home, BookOpen, Headphones, CheckCircle, Info, LogIn, LogOut } from 'react-feather'

import useAuth from '@hooks/useAuth'

import s from './sidebar.module.scss'

const Sidebar = () => {
    const auth = useAuth()

    const [isOpen, setOpen] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()

    const current = location.pathname

    const handleOver = () => setOpen(true)
    const handleOut = () => setOpen(false)
    const gotoLogin = () => navigate('/login', { state: { from: location } })
    const logOut = () => {
        const confirm = (t) => {
            auth.setAuth(false)
            navigate('/')
            toast.dismiss(t.id)
            toast.success('Ви вийшли з аккаунту')
        }

        toast((t) => (
            <h6>
                Ви впевнені, що хочете <b>вийти</b>?
                <button className={s.toastButton} onClick={() => confirm(t)}>Так</button>
            </h6>
        ), {
            duration: 10000,
        })
    }

    const links = [
        {
            name: 'Головна',
            icon: <Home />,
            path: '/',
            isActive: current === '/',
        },
        {
            name: 'Статті',
            icon: <BookOpen />,
            path: '/articles',
            isActive: current.includes('/articles'),
        },
        {
            name: 'Медитації',
            icon: <Headphones />,
            path: '/meditations',
            isActive: current === '/meditations',
        },
        {
            name: 'Тест',
            icon: <CheckCircle />,
            path: '/test',
            isActive: current === '/test',
        },
        {
            name: 'Гаряча лінія',
            icon: <Info />,
            path: '/hotline',
            isActive: current === '/hotline',
        },
    ]

    return (
        <nav
            className={`${s.sidebar} ${isOpen ? s.open : ''}`}
            onMouseOver={handleOver}
            onMouseOut={handleOut}
        >
            <ul>
                {links &&
                    links.map(({ name, icon, path, isActive }, id) => (
                        <li
                            key={id}
                            className={isActive ? s.linkActive : ''}
                            onClick={() => navigate(path, { state: { from: location } })}
                        >
                            {icon}
                            <h6>{name}</h6>
                        </li>
                    ))}
            </ul>

            {auth.isAuth ? (
                <ul>
                    <li
                        className={
                            current === '/login' || current === '/register' ? s.linkActive : ''
                        }
                        onClick={logOut}
                    >
                        <LogOut />
                        <h6>Вийти</h6>
                    </li>
                </ul>
            ) : (
                <ul>
                    <li
                        className={
                            current === '/login' || current === '/register' ? s.linkActive : ''
                        }
                        onClick={gotoLogin}
                    >
                        <LogIn />
                        <h6>Увійти</h6>
                    </li>
                </ul>
            )}
        </nav>
    )
}
export default Sidebar
