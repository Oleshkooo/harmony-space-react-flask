import { useState, useEffect, createContext } from 'react'
import axios from 'axios'

export const MeditationsContext = createContext()

const MeditationsContextProvider = ({ children }) => {
    const [meditations, setMeditations] = useState([])
    const [currentlyPlaying, setCurrentPlaying] = useState(null)
    const [audios, setAudios] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await axios.get('/meditations')
            data.map(item => (item.playing = false))
            setMeditations(data)
        }
        fetchData()
    }, [])

    const play = id => {
        if (currentlyPlaying) {
            currentlyPlaying.audio.pause()
        }

        if (!audios || !audios?.find(item => item.id === id)) {
            const audio = new Audio(`/meditations/${id}`)
            setAudios([...audios, { id, audio }])
            setCurrentPlaying({ id, audio })
            audio.play()
            return
        }

        const audio = audios.find(item => item.id === id).audio
        setCurrentPlaying({ id, audio })
        audio.play()
    }

    const pause = () => {
        if (!currentlyPlaying) return

        currentlyPlaying.audio.pause()
        setCurrentPlaying(null)
    }

    return (
        <MeditationsContext.Provider
            value={{ meditations, currentlyPlaying, play, pause }}
        >
            {children}
        </MeditationsContext.Provider>
    )
}
export default MeditationsContextProvider
