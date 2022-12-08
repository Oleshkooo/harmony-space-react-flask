import s from './imageBlock.module.scss'

const ImageBlock = ({ img, className = '', ...props }) => {
    return (
        <div
            className={`${s.imgBlock} ${className}`}
            style={{ backgroundImage: `url(${img})` }}
            {...props}
        >
            {/* <img src={img} alt="img" /> */}
        </div>
    )
}
export default ImageBlock
