import s from './TextLink.module.scss'

const TextLink = ({ ...props }) => {
    return (
        <span className={s.link} {...props}>
            {props.children}
        </span>
    )
}
export default TextLink