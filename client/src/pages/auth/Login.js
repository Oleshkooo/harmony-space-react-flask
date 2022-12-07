import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import Layout from '@components/Layout'
import Breadcrumbs from '@components/Breadcrumbs'
import Button from '@components/Button'
import Tile from '@components/Tile'
import Input from '@components/Input'
import ImageBlock from '@components/ImageBlock'
import TextLink from '@components/TextLink'

import s from './auth.module.scss'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || '/'

    const handleClick = e => {
        e.preventDefault()
        console.log(from)
    }

    const gotoRegister = () => {
        navigate('/register', { state: { from: location.state?.from } })
    }

    return (
        <Layout className={s.login}>
            <div className={s.left}>
                <Breadcrumbs path={from}>Вхід в обліковий запис</Breadcrumbs>

                <div className={s.login__container}>
                    <Tile className={s.tile}>
                        <h4>Вхід в обліковий запис</h4>
                        <div className={s.inputs}>
                            <Input
                                label="Ім'я користувача"
                                placeholder="Введіть ім'я користувача"
                                setState={setUsername}
                            />
                            <Input
                                label="Пароль"
                                placeholder="Введіть пароль"
                                setState={setPassword}
                                password
                            />
                        </div>
                        <div className={s.buttons}>
                            <Button onClick={handleClick}>Увійти</Button>
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
            <ImageBlock
                className={s.right}
                img="https://i.picsum.photos/id/483/2000/3000.jpg?hmac=ZwWHf5kp6VIY6h699lfQs8kIYz0j9gmbwT3XH0gMyfE"
            />
        </Layout>
    )
}
export default Login
