import s from './button.module.scss'

const Button = ({ onClick, className = '', ...props }) => {
    return (
        <button
            className={`${s.btn} ${className}}`}
            onClick={onClick}
            {...props}
        >
            {props.children}
        </button>
    )
}
export default Button
