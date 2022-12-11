import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import axios from 'axios'

import Layout from '@components/Layout'
import Breadcrumbs from '@components/Breadcrumbs'
import Button from '@components/Button'
import Tile from '@components/Tile'
import Input from '@components/Input'
import ImageBlock from '@components/ImageBlock'
import TextLink from '@components/TextLink'

import useAuth from '@hooks/useAuth'
import useOnEnter from '@hooks/useOnEnter'

import s from './auth.module.scss'

const Login = () => {
    const auth = useAuth()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || '/'

    const handleSubmit = async () => {
        if (!username || !password) {
            toast.error('Введіть ім\'я користувача та пароль')
            return
        }

        const usernameRegex = /^[a-zA-Z0-9_.]+$/
        const passwordRegex = /^[a-zA-Z0-9_]+$/

        if (!usernameRegex.test(username.toLocaleLowerCase())) {
            toast.error('Ім\'я користувача може містити тільки латинські літери, цифри, підкреслення та крапки')
            return
        }

        if (!passwordRegex.test(password.toLocaleLowerCase())) {
            toast.error('Пароль може містити тільки латинські літери, цифри та підкреслення')
            return
        }

        const { data } = await axios.post('/login', { username, password })

        if (data?.error) {
            toast.error(data.error)
            return
        }

        if (!data?.success || !data?.username) {
            toast.error('Виникла помилка')
            return
        }

        auth.setAuth(true)
        auth.setUserId(data.id)
        auth.setUsername(data.username)
        auth.setAdmin(data.isAdmin)
        toast.success(data.success)
        navigate(from)
    }
    const gotoRegister = () => navigate('/register', { state: { from: location.state?.from } })

    useOnEnter(handleSubmit)

    if (auth.isAuth) {
        return <Navigate to="/" state={{ message: 'Ви вже увійшли в обліковий запис' }} />
    }

    return (
        <Layout className={s.login}>
            <div className={s.left}>
                <Breadcrumbs path={from}>Вхід в обліковий запис</Breadcrumbs>

                <div className={s.container}>
                    <Tile className={s.tile}>
                        <h4>Вхід в обліковий запис</h4>
                        <div className={s.inputs}>
                            <Input
                                label="Ім'я користувача"
                                placeholder="Введіть ім'я користувача"
                                setState={setUsername}
                                value={username}
                            />
                            <Input
                                label="Пароль"
                                placeholder="Введіть пароль"
                                setState={setPassword}
                                password
                                value={password}
                            />
                        </div>
                        <div className={s.buttons}>
                            <Button onClick={handleSubmit}>Увійти</Button>
                            <span>
                                Ще не маєте облікового запису?{' '}
                                <TextLink onClick={gotoRegister}>
                                    Зареєструватись
                                </TextLink>
                            </span>
                        </div>
                    </Tile>
                </div>
            </div>
            {/* <ImageBlock
                className={s.right}
                img="https://i.picsum.photos/id/483/2000/3000.jpg?hmac=ZwWHf5kp6VIY6h699lfQs8kIYz0j9gmbwT3XH0gMyfE"
            /> */}
            <ImageBlock
                className={s.right}
                img="https://picsum.photos/2000/3000"
            />
        </Layout>
    )
}
export default Login
