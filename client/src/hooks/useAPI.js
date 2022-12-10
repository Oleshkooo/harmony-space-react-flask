import { useContext } from 'react'

import { APIContext } from '@context/APIContext'

const useAPI = () => {
    const context = useContext(APIContext)

    if (context === undefined)
        throw new Error('useAPI context must be used within a APIContext Provider')

    return context
}
export default useAPI
