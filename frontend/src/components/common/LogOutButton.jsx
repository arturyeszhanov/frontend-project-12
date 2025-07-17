import { useTranslation } from 'react-i18next'
import { useAuth } from '../../hooks/index'

const LogOutButton = () => {
    const { t } = useTranslation()
    const { logOut, loggedIn } = useAuth()
  
    return loggedIn
      ? (
          <button type="button" className="btn btn-primary" onClick={logOut}>
            {t('logoutButton')}
          </button>
        )
      : null
  }
export default LogOutButton
