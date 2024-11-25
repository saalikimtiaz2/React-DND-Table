import { Link } from 'react-router-dom'

function Header() {
    return (
        <div className="flex items-center justify-end gap-x-4 bg-primary px-8 py-2 text-white">
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
        </div>
    )
}

export default Header
