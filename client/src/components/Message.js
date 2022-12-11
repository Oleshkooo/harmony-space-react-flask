import s from './message.module.scss'

const Message = ({ time, dark = false, isFromUser = false, renderTime = true, className = '', ...props }) => {
    const darkClass = dark ? s.dark : ''
    const sideClass = isFromUser ? s.right : s.left

    return (
        <div className={`${s.container} ${sideClass}`}>
            <div className={`${s.message} ${darkClass}`}>
                {props.children}
                {renderTime && (
                    <p className={s.time}>
                        {new Date(time).toLocaleTimeString('uk-UA', {
                            hour12: false,
                            hour: '2-digit',
                            minute: '2-digit',
                        })}
                    </p>
                )}
            </div>
        </div>
    )
}
export default Message
