import { useState, useEffect } from 'react'
import { Play, Pause } from 'react-feather'

import useMeditations from '@hooks/useMeditations'
import disposableFunc from '@utils/disposableFunc'

import s from './player.module.scss'

const Player = ({ data, className = '', dark = false, ...props }) => {
    const darkStyle = dark ? s.dark : ''

    const globalAudio = useMeditations()

    return (
        <div className={`${s.player} ${darkStyle} ${className}`} {...props}>
            {props.children}
            <div className={s.controls}>
                {globalAudio?.currentlyPlaying?.id === data.id ? (
                    <div className={s.playPause} onClick={globalAudio.pause}>
                        <Pause />
                    </div>
                ) : (
                    <div className={s.playPause} onClick={() => globalAudio.play(data.id)}>
                        <Play />
                    </div>
                )}
            </div>
        </div>
    )
}
export default Player
