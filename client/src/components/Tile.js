import s from './tile.module.scss'

const Tile = ({ className = '', dark = false, img = '', ...props }) => {
    const darkStyle = dark ? s.dark : ''

    if (img) return (
        <div
            className={`${s.tileImg} ${className}`}
            style={{ backgroundImage: `url(${img})` }}
            {...props}
        >
            {/* <img src={img} alt="img" /> */}
        </div>
    )

    return (
        <div
            className={`${s.tile} ${darkStyle} ${className}`}
            {...props}
        >
            {props.children}
        </div>
    )
}
export default Tile
