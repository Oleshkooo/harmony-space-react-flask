import { useState, useEffect } from 'react'
import { useNavigate, useLocation, useParams, Navigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import axios from 'axios'

import Layout from '@components/Layout'
import Breadcrumbs from '@components/Breadcrumbs'
import Tile from '@components/Tile'

import s from './articles.module.scss'

const ArticlesExact = () => {
    const { id } = useParams()

    const [article, setArticle] = useState(null)

    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || '/'

    const message = 'Такої статті не існує'

    useEffect(() => {
        const fetchData = async () => {
            if (isNaN(id)) {
                navigate('/404', { state: { message } })
                return
            }

            const { data } = await axios.get(`/articles/${id}`)

            if (data?.error) {
                navigate('/404', { state: { message } })
                return
            }

            setArticle(data)
        }
        fetchData()
    }, [id, navigate])

    if (isNaN(id)) {
        return <Navigate to="/404" state={{ message }} />
    }

    return (
        <Layout>
            <Breadcrumbs path={from}>Стаття {id}</Breadcrumbs>

            <div className={s.container}>
                
                {article &&
                    <Tile className={`${s.articles} ${s.articlesExact}`}>
                        <h3>{article.title}</h3>
                        <p>{article.content}</p>
                        <p>
                            {article.author},{' '}
                            {new Date(article.date).toLocaleDateString('uk-UA', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            })}
                        </p>
                    </Tile>
                }

            </div>
        </Layout>
    )
}
export default ArticlesExact
