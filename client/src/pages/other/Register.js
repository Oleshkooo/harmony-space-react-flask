import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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

const Register = () => {
    const auth = useAuth()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || '/'

    const handleSubmit = async () => {
        if (!username || !password || !email) {
            toast.error('Введіть ім\'я користувача, пароль та електронну пошту')
            return
        }

        if (username.length < 3 || username.length > 20) {
            toast.error('Ім\'я користувача повинно містити від 3 до 20 символів')
            return
        }

        if (password.length < 6 || password.length > 20) {
            toast.error('Пароль повинен містити від 6 до 20 символів')
            return
        }

        const usernameRegex = /^[a-zA-Z0-9_.]+$/
        const passwordRegex = /^[a-zA-Z0-9_]+$/
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (!usernameRegex.test(username.toLocaleLowerCase())) {
            toast.error('Ім\'я користувача може містити тільки латинські літери, цифри, підкреслення та крапки')
            return
        }

        if (!emailRegex.test(email.toLocaleLowerCase())) {
            toast.error('Електронна адреса недійсна')
            return
        }

        if (!passwordRegex.test(password.toLocaleLowerCase())) {
            toast.error('Пароль може містити тільки латинські літери, цифри та підкреслення')
            return
        }

        const { data } = await axios.post('/register', { username, password, email })

        if (data?.error) {
            toast.error(data.error)
            return
        }

        if (!data?.success || !data?.username) {
            toast.error('Виникла помилка')
            return
        }

        toast.success(data.success)
        auth.setAuth(true)
        auth.setUsername(data.username)
        navigate(from)
    }
    const gotoLogin = () => navigate('/login', { state: { from: location.state?.from } })

    useOnEnter(handleSubmit)

    return (
        <Layout className={s.login}>
            <div className={s.left}>
                <Breadcrumbs path={from}>Створення облікового запису</Breadcrumbs>

                <div className={s.container}>
                    <Tile className={s.tile}>
                        <h4>Створення облікового запису</h4>
                        <div className={s.inputs}>
                            <Input
                                label="Ім'я користувача"
                                placeholder="Введіть ім'я користувача"
                                setState={setUsername}
                            />
                            <Input
                                label="Email"
                                placeholder="Введіть email"
                                setState={setEmail}
                            />
                            <Input
                                label="Пароль"
                                placeholder="Введіть пароль"
                                setState={setPassword}
                                password
                            />
                        </div>
                        <div className={s.buttons}>
                            <Button onClick={handleSubmit}>
                                Зареєструватись
                            </Button>
                            <span>
                                Вже маєте обліковий запис?{' '}
                                <TextLink onClick={gotoLogin}>Увійти</TextLink>
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
export default Register
