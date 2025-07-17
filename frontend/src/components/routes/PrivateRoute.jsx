import { Navigate, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useAuth } from '../../hooks/index.jsx'
import routes from '../../routes.js'

const PrivateRoute = ({ children }) => {
  const auth = useAuth()
  const location = useLocation()

  return auth.loggedIn
    ? (
        children
      )
    : (
        <Navigate to={routes.login()} state={{ from: location }} />
      )
}
PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
}

export default PrivateRoute
