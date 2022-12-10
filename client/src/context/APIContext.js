import { useState, useEffect, createContext } from 'react'
import axios from 'axios'

export const APIContext = createContext()

const APIContextProvider = ({ children }) => {
    const [api, setApi] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const affirmation = await axios.get('/affirmation')
            const latestArticle = await axios.get('/articles/latest')
            // console.log(affirmation.data, latestArticle.data)
            setApi({
                affirmation: affirmation.data.affirmation,
                latestArticle: latestArticle.data,
            })
        }
        fetchData()
    }, [])

    return <APIContext.Provider value={api}>{children}</APIContext.Provider>
}
export default APIContextProvider
