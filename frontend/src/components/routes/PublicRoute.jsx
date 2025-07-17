import { Navigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useAuth } from '../../hooks/index.jsx'
import routes from '../../routes.js'

const PublicRoute = ({ children }) => {
  const auth = useAuth()
  const location = useLocation()

  return auth.loggedIn
    ? (
        <Navigate to={routes.root()} state={{ from: location }} />
      )
    : (
        children
      )
}

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PublicRoute
