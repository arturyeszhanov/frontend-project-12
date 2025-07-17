import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { ToastContainer } from 'react-toastify'
import { Provider, ErrorBoundary } from '@rollbar/react'
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom'
import Container from 'react-bootstrap/Container'
import { Navbar, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import { io } from 'socket.io-client'
import NotFoundPage from './pages/NotFoundPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MainPage from './pages/MainPage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import { addNewMessage } from '../slices/messagesSlice.js'
import {
  addNewChannel,
  removeChannel,
  renameChannel,
} from '../slices/channelsSlice.js'
import routes from '../routes.js'
import apiPaths from '../apiPaths.js'

import FilterProvider from '../components/providers/FilterProvider.jsx'
import AuthProvider from '../components/providers/AuthProvider.jsx'
import PrivateRoute from '../components/routes/PrivateRoute.jsx'
import PublicRoute from '../components/routes/PublicRoute.jsx'
import LogOutButton from '../components/common/LogOutButton.jsx'
import ModalFacade from '../components/modals/ModalFacade.jsx'

const rollbarConfig = {
  accessToken: import.meta.env.ROLLBAR_ACCESS_TOKEN,
  environment: 'testenv',
}

const App = () => {
  const socket = io(apiPaths.socket(), {
    withCredentials: true,
  })

  const { t } = useTranslation()
  const dispatch = useDispatch()

  useEffect(() => {
    const onNewMessage = (payload) => {
      dispatch(addNewMessage(payload))
    }

    const onNewChannel = (payload) => {
      dispatch(addNewChannel(payload))
    }

    const onRemoveChannel = (payload) => {
      dispatch(removeChannel(payload))
    }

    const onRenameChannel = (payload) => {
      dispatch(renameChannel(payload))
    }

    socket.on('newMessage', onNewMessage)
    socket.on('newChannel', onNewChannel)
    socket.on('removeChannel', onRemoveChannel)
    socket.on('renameChannel', onRenameChannel)

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  })

  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <FilterProvider>
          <AuthProvider>
            <ModalFacade />
            <ToastContainer />
            <div className="d-flex flex-column bg-white h-100">
              <Navbar className="bg-light-subtle shadow-sm">
                <Container>
                  <Navbar.Brand href={routes.root()}>
                    {t('title')}
                  </Navbar.Brand>
                  <LogOutButton />
                </Container>
              </Navbar>

              <BrowserRouter>
                <Routes>
                  <Route
                    path={routes.root()}
                    element={(
                      <PrivateRoute>
                        <MainPage />
                      </PrivateRoute>
                    )}
                  />
                  <Route
                    path={routes.login()}
                    element={(
                      <PublicRoute>
                        <LoginPage />
                      </PublicRoute>
                    )}
                  />
                  <Route path={routes.signup()} element={<SignUpPage />} />
                  <Route
                    path={routes.notFound()}
                    element={<NotFoundPage />}
                  />
                </Routes>
              </BrowserRouter>
            </div>
          </AuthProvider>
        </FilterProvider>
      </ErrorBoundary>
    </Provider>
  )
}

export default App
