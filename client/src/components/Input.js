import s from './input.module.scss'

const Input = ({ setState, placeholder = '', label = '', password = false, className = '', ...props }) => {
    const handleChange = e => {
        setState(e.target.value)
    }

    return (
        <div className={`${s.inputContainer} ${className}`} {...props}>
            <label className={s.label}>{label}</label>
            {password && <input className={s.input} placeholder={placeholder} onChange={handleChange} type="password" />}
            {!password && <input className={s.input} placeholder={placeholder} onChange={handleChange} />}
        </div>
    )
}
export default Input
