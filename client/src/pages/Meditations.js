import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

import useMeditations from '@hooks/useMeditations'

import Layout from '@components/Layout'
import Breadcrumbs from '@components/Breadcrumbs'
import Tile from '@components/Tile'
import Player from '@components/Player'

import s from './meditations.module.scss'

const Meditations = () => {
    const globalAudio = useMeditations()

    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || '/'

    return (
        <Layout>
            <Breadcrumbs path={from}>Медитації</Breadcrumbs>

            <div className={s.container}>
                {globalAudio.meditations && globalAudio.meditations.map((item, index) => (
                    <div key={index} className={s.track}>
                        <Tile dark={index === 0 ? true : false}>
                            <h5>{item.title}</h5>
                            <p>{item.content}</p>
                        </Tile>
                        <Player dark={index === 0 ? true : false} data={item}>{item.title}</Player>
                    </div>
                ))}

            </div>
        </Layout>
    )
}
export default Meditations
