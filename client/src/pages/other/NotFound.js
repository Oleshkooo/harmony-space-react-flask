import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AlertTriangle } from 'react-feather'
import { toast } from 'react-hot-toast'

import Layout from '@components/Layout'
import Breadcrumbs from '@components/Breadcrumbs'
import Button from '@components/Button'
import Tile from '@components/Tile'
import ImageBlock from '@components/ImageBlock'

import s from './auth.module.scss'

const NotFound = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || '/'
    const message = location.state?.message || ''

    const handleClick = e => {
        e.preventDefault()
        navigate('/', { state: { from: location.state?.from } })
    }

    useEffect(() => {
        if (message) {
            toast.error(message)
        }
    }, [message])

    return (
        <Layout className={s.login}>
            <div className={s.left}>
                <Breadcrumbs path={from}>Сторінку не знайдено</Breadcrumbs>

                <div className={s.container}>
                    <Tile className={s.tile}>
                        <div className={s.header}>
                            <AlertTriangle size={100} />
                            <h1>404</h1>
                        </div>
                        <div className={s.text}>
                            <h3>Сторінку не знайдено</h3>
                            <span>Можливо, посилання більше не дійсне або сторінки більше не існує</span>
                        </div>
                        <Button onClick={handleClick}>Повернутись на головну</Button>
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
export default NotFound
