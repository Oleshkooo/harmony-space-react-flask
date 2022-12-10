import { useContext } from 'react'

import { MeditationsContext } from '@context/MeditationsContext'

const useMeditations = () => {
    const context = useContext(MeditationsContext)

    if (context === undefined)
        throw new Error('useMeditations context must be used within a MeditationsContext Provider')

    return context
}
export default useMeditations
