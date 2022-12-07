import { useNavigate } from 'react-router-dom'

import s from './breadcrumbs.module.scss'

const Breadcrumbs = ({ path = -1, className = '', ...props }) => {
    const navigate = useNavigate()

    const handleClick = e => {
        e.preventDefault()
        navigate(path)
    }

    return (
        <div className={`${s.breadcrumbs} ${className}`} {...props}>
            <div className={s.icon} onClick={handleClick}>
                <i className="fa-solid fa-arrow-left"></i>
            </div>
            {props.children}
        </div>
    )
}
export default Breadcrumbs
