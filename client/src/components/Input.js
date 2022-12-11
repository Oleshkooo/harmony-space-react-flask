import { useCallback } from 'react'

import s from './input.module.scss'

const Input = ({ setState, value, placeholder = '', label = '', password = false, className = '', ...props }) => {
    const handleChange = useCallback(e => {
        setState(e.target.value)
    }, [setState])

    return (
        <div className={`${s.inputContainer} ${className}`} {...props}>
            <label className={s.label}>{label}</label>
            {password && <input className={s.input} placeholder={placeholder} value={value} onChange={handleChange} type="password" />}
            {!password && <input className={s.input} placeholder={placeholder} value={value} onChange={handleChange} />}
        </div>
    )
}
export default Input
