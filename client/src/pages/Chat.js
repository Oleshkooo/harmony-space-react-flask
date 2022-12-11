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
import Input from '@components/Input'
import Button from '@components/Button'
import Message from '../components/Message'

import s from './chat.module.scss'

const Chat = () => {
    const { userId } = useAuth()

    const [socket, setSocket] = useState(io.connect('http://localhost:5000'))
    const [connected, setConnected] = useState(false)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || '/'

    const handleSubmit = async () => {
        await socket.emit('send_message', {
            id: userId,
            content: message,
            isFromUser: true,
            date: Date.now(),
        })

        setMessage('')
    }
    const renderMessage = (msg, index) => {
        return (
            <Message key={index} dark={msg.isFromUser} isFromUser={msg.isFromUser} time={msg.date}>
                {msg.content}
            </Message>
        )
    }

    useOnEnter(handleSubmit)

    useEffect(() => {
        if (!connected) {
            socket.emit('join', userId)
            setConnected(true)
        }
    }, [socket, userId, connected])

    useEffect(() => {
        socket.on('recieve_message', data => {
            setMessages(prev => [data, ...prev])
        })
    }, [socket])

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get(`/messages/${userId}`)

            if (data?.error) {
                toast.error(data.error)
                return
            }

            setMessages(data)
        }
        fetchData()
    }, [userId])

    return (
        <Layout>
            <Breadcrumbs path={from}>Чат з психологом</Breadcrumbs>

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
export default Chat
