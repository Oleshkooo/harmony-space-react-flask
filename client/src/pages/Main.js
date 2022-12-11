import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import useAPI from '@hooks/useAPI'

import Layout from '@components/Layout'
import Tile from '@components/Tile'
import Button from '@components/Button'

import limitString from '@utils/limitString'

import s from './main.module.scss'

const Main = () => {
    const apiData = useAPI()

    const navigate = useNavigate()
    const location = useLocation()

    const message = location.state?.message || ''

    const gotoRegister = () => navigate('/register', { state: { from: location } })
    const gotoArticles = () => navigate('/articles', { state: { from: location } })
    const gotoHotline = () => navigate('/hotline', { state: { from: location } })
    // const gotoTest = () => navigate('/test', { state: { from: location } })

    useEffect(() => {
        if (message) {
            toast.error(message)
        }
    }, [message])

    return (
        <Layout>
            <div className={s.tiles}>
                <Tile dark className={s.area1}>
                    <h5>Афірмація дня</h5>
                    <p>{apiData ? apiData.affirmation : 'Афірмації зараз недостуні'}</p>
                </Tile>
                <Tile className={s.area2}>
                    <h5>Вперше на нашому сайті?</h5>
                    <p>
                        Зареєструйтесь або увійдіть в існуючий обліковий запис для детальнішої
                        інформації про себе
                    </p>
                    <Button onClick={gotoRegister}>Зареєструватись</Button>
                </Tile>

                <Tile className={s.area3}>
                    {apiData ? (
                        <>
                            <h5>{apiData.latestArticle.title}</h5>
                            <p>{limitString(apiData.latestArticle.content, 1500)}</p>
                            <p>
                                {apiData.latestArticle.author},{' '}
                                {new Date(apiData.latestArticle.date).toLocaleDateString('uk-UA', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                })}
                            </p>
                            <Button onClick={gotoArticles}>Переглянути статті</Button>
                        </>
                    ) : (
                        <>
                            <h5>Остання стаття</h5>
                            <p>Статті зараз недоступні</p>
                        </>
                    )}
                </Tile>
                <Tile className={s.area4}>
                    <h5>Гаряча лінія</h5>
                    <p>
                        Міністерство охорони здоров'я України нагадує, що в Україні працює «гаряча
                        лінія», спеціалісти якої допомагають українцям підтримати психічне здоров’я
                        в умовах постійного стресу й емоційної напруги, спричинених війною. <br />
                        <br />
                        «Гаряча лінія» за номером <b>0-800-100-102</b> працює{' '}
                        <b>щодня з 10:00 до 20:00</b>. Дзвінки з України є безоплатними.
                        Консультації надають фахові психологи з багаторічним досвідом, які
                        попередньо пройшли спеціальну підготовку для роботи зі складними кризовими
                        ситуаціями. Лінія працює у двох форматах: через аудіо- та відеозв’язок. Для
                        отримання відеосеансу особа, яка звернулася по допомогу, має повідомити про
                        своє бажання оператору лінії. <br />
                        <br />
                        Крім того, лінія приймає дзвінки громадян України, які перебувають в інших
                        країнах
                        <br />
                    </p>
                    <Button onClick={gotoHotline}>Більше інформації</Button>
                </Tile>
                {/* <Tile
                    className={s.area5}
                    img="https://i.picsum.photos/id/483/2000/3000.jpg?hmac=ZwWHf5kp6VIY6h699lfQs8kIYz0j9gmbwT3XH0gMyfE"
                ></Tile> */}
                <Tile className={s.area5} img="https://picsum.photos/2000/3000"></Tile>
            </div>
        </Layout>
    )
}
export default Main
