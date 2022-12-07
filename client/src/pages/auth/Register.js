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

const Register = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || '/'

    const handleClick = e => {
        e.preventDefault()
        console.log(from)
    }

    const gotoLogin = () => {
        navigate('/login', { state: { from: location.state?.from } })
    }

    return (
        <Layout className={s.login}>
            <div className={s.left}>
                <Breadcrumbs path={from}>Створення облікового запису</Breadcrumbs>

                <div className={s.login__container}>
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
                            <Button onClick={handleClick}>
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
            <ImageBlock
                className={s.right}
                img="https://i.picsum.photos/id/483/2000/3000.jpg?hmac=ZwWHf5kp6VIY6h699lfQs8kIYz0j9gmbwT3XH0gMyfE"
            />
        </Layout>
    )
}
export default Register
