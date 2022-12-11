import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import io from 'socket.io-client'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Send } from 'react-feather'

import useAuth from '@hooks/useAuth'
import useOnEnter from '@hooks/useOnEnter'

import Layout from '@components/Layout'
import Breadcrumbs from '@components/Breadcrumbs'
import Tile from '@components/Tile'
import Input from '@components/Input'
import Button from '@components/Button'
import Message from '../components/Message'

import s from './chat.module.scss'

const AdminChat = () => {
    const { id } = useParams()

    const [socket, setSocket] = useState(io.connect('http://localhost:5000'))
    const [connected, setConnected] = useState(false)
    const [user, setUser] = useState({})
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || '/'

    const handleSubmit = async () => {
        await socket.emit('send_message', {
            id: id,
            content: message,
            isFromUser: false,
            date: Date.now(),
        })

        setMessage('')
    }
    const renderMessage = (msg, index) => {
        return (
            <Message key={index} dark={!msg.isFromUser} isFromUser={!msg.isFromUser} time={msg.date}>
                {msg.content}
            </Message>
        )
    }

    useOnEnter(handleSubmit)

    useEffect(() => {
        if (!connected) {
            socket.emit('join_room', id)
            setConnected(true)
        }
    }, [socket, id, connected])

    useEffect(() => {
        socket.on('recieve_message', data => {
            setMessages(prev => [data, ...prev])
        })
    }, [socket])

    useEffect(() => {
        const fetchData = async () => {
            const messages = await axios.get(`/messages/${id}`)
            const user = await axios.get(`/users/${id}`)

            if (messages.data?.error) {
                toast.error(messages.data.error)
                return
            }

            if (user.data?.error) {
                toast.error(user.data.error)
                return
            }

            setMessages(messages.data)
            setUser(user.data)
        }
        fetchData()
    }, [id])

    return (
        <Layout>
            <Breadcrumbs path={from}>Чат з {user && user.username}</Breadcrumbs>

            <div className={s.container}>
                <Tile className={s.chat}>
                    <div className={s.messages}>
                        {!messages.length ? (
                            <Message renderTime={false}>Повідомлень ще немає</Message>
                        ) : (
                            messages.map((item, index) => renderMessage(item, index))
                        )}
                    </div>
                    <div className={s.controls}>
                        <Input
                            className={s.input}
                            value={message}
                            setState={setMessage}
                            placeholder="Повідомлення"
                        />
                        <Button onClick={handleSubmit}>
                            <Send />
                        </Button>
                    </div>
                </Tile>
            </div>
        </Layout>
    )
}
export default AdminChat
