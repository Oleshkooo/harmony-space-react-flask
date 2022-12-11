import s from './message.module.scss'

const Message = ({ dark = false, left = false, right = false, className = '', ...props }) => {
    const darkClass = dark ? s.dark : ''
    const leftClass = left ? s.left : ''
    const rightClass = right ? s.right : ''

    return (
        <div className={`${s.container} ${leftClass} ${rightClass}`}>
            <div className={`${s.message} ${darkClass}`}>
                {props.children}
            </div>
        </div>
    )
}
export default Message