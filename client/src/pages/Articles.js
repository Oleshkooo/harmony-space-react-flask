import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'

import Layout from '@components/Layout'
import Breadcrumbs from '@components/Breadcrumbs'
import Tile from '@components/Tile'

import limitString from '@utils/limitString'

import s from './articles.module.scss'

const Articles = () => {
    const [articles, setArticles] = useState(null)

    const navigate = useNavigate()
    const location = useLocation()

    const current = location.pathname
    const from = location.state?.from?.pathname || '/'

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get('/articles')
            setArticles(data)
        }
        fetchData()
    }, [])

    return (
        <Layout>
            <Breadcrumbs path={from}>Статті</Breadcrumbs>

            <div className={s.container}>

                {articles && articles.map((item, index) => (
                    <Tile
                        key={index}
                        dark={index === 0}
                        className={s.articles}
                        onClick={() => navigate(`${current}/${item.id}`, { state: { from: location } })}
                    >
                        <h5>{item.title}</h5>
                        <p>{limitString(item.content, 540)}</p>
                        <p>
                            {item.author},{' '}
                            {new Date(item.date).toLocaleDateString('uk-UA', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </Tile>
                ))}

            </div>
        </Layout>
    )
}
export default Articles
