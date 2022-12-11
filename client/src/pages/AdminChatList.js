import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import io from 'socket.io-client'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Send } from 'react-feather'

import useAuth from '@hooks/useAuth'
import useOnEnter from '@hooks/useOnEnter'

import Layout from '@components/Layout'
import Breadcrumbs from '@components/Breadcrumbs'
import Tile from '@components/Tile'


import s from './articles.module.scss'

const AdminChat = () => {
    const [users, setUsers] = useState([])

    const navigate = useNavigate()
    const location = useLocation()

    const current = location.pathname
    const from = location.state?.from?.pathname || '/'

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get('/users')
            setUsers(data)
        }
        fetchData()
    }, [])

    return (
        <Layout>
            <Breadcrumbs path={from}>Чати з користувачами</Breadcrumbs>

            <div className={s.container}>

                {users && users.map((item, index) => (
                    <Tile
                        key={index}
                        dark={index === 0}
                        className={s.articles}
                        onClick={() => navigate(`${current}/${item.id}`, { state: { from: location } })}
                    >
                        <h5>{item.id}: {item.username}</h5>
                    </Tile>
                ))}

            </div>
        </Layout>
    )
}
export default AdminChat
