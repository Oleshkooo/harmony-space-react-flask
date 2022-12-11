import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import io from 'socket.io-client'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { Send } from 'react-feather'

import useAuth from '@hooks/useAuth'

import Layout from '@components/Layout'
import Breadcrumbs from '@components/Breadcrumbs'
import Tile from '@components/Tile'
import Input from '@components/Input'
import Button from '@components/Button'
import Message from '../components/Message'

import s from './chat.module.scss'

const Chat = () => {
    const socket = io.connect('http://localhost:5000')

    const auth = useAuth()

    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || '/'

    const sendMessage = async () => {
        await socket.emit('send_message', {
            content: message,
            room: auth.userId,
        })
    }

    useEffect(() => {
        socket.on('recieve_message', data => {
            console.log('recieve', data)
        })
    }, [socket])

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get('/messages')

            if (data?.error) {
                toast.error(data.error)
                return
            }

            setMessages(data)
        }
        fetchData()
    })

    return (
        <Layout>
            <Breadcrumbs path={from}>Чат з психологом</Breadcrumbs>

            <div className={s.container}>
                <Tile className={s.chat}>
                    <div className={s.messages}>
                        {!messages.length && <Message>Повідомлень ще немає</Message>}
                    </div>
                    <div className={s.controls}>
                        <Input
                            className={s.input}
                            setState={setMessage}
                            placeholder="Повідомлення"
                        />
                        <Button>
                            <Send />
                        </Button>
                    </div>
                </Tile>
            </div>
        </Layout>
    )
}
export default Chat
