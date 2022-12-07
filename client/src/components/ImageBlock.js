import s from './imageBlock.module.scss'

const ImageBlock = ({ img, className = '', ...props }) => {
    return (
        <div
            className={`${s.imgBlock} ${className}`}
            {...props}
        >
            <img src={img} alt="img" />
        </div>
    )
}
export default ImageBlock
