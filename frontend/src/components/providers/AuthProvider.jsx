import {
  useState, useMemo, useCallback,
} from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import { AuthContext } from '../../contexts/index.jsx'
import { clearCredentials } from '../../slices/authSlice.js'

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch()
  const [loggedIn, setLoggedIn] = useState(() => {
    try {
      const credentials = JSON.parse(window.localStorage.getItem('userId'))
      return !!credentials
    }
    catch (error) {
      console.error(error)
      return false
    }
  })
  const logIn = (data) => {
    window.localStorage.setItem('userId', JSON.stringify(data))
    setLoggedIn(true)
  }
  const logOut = useCallback(() => {
    localStorage.removeItem('userId')
    setLoggedIn(false)
    dispatch(clearCredentials())
  }, [dispatch])

  const contextValue = useMemo(
    () => ({ loggedIn, logIn, logOut }),
    [loggedIn, logOut],
  )

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export default AuthProvider
