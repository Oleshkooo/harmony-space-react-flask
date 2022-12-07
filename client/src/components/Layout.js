import { motion } from 'framer-motion'

import s from './layout.module.scss'

const Layout = ({ className = '', ...props }) => {
    return (
        <motion.div
            className={`${s.layout} ${className}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            {...props}
        >
            {props.children}
        </motion.div>
    )
}
export default Layout
