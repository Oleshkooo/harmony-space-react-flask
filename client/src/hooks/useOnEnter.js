import { useEffect } from 'react'

const useOnEnter = (func, ...args) => {
    useEffect(() => {
        const escClose = e => {
            if (e.key === 'Enter') 
                func(...args)
        }
        window.addEventListener('keydown', escClose)

        return () => window.removeEventListener('keydown', escClose)
    }, [func, args])
}
export default useOnEnter