import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import {
  Container,
  Row,
  Col,
  Nav,
  Button,
  Form as BootstrapForm,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap'
import {
  setMessages,
} from '../../slices/messagesSlice.js'
import { setChannels, setCurrentChannel } from '../../slices/channelsSlice.js'
import { useFilter } from '../../hooks/index.jsx'
import addChannelButton from '../../assets/addChannelButton.svg'
import sendMessageButton from '../../assets/sendMessageButton.svg'
import { selectChannelId, showModal } from '../../slices/modalSlice.js'
import PropTypes from 'prop-types'
import apiPaths from '../../apiPaths.js'
import routes from '../../routes.js'
import { useAuth } from '../../hooks/index'

const Channels = ({ channels }) => {
  const { t } = useTranslation()

  const { currentChannel } = useSelector(state => state.channels)
  const dispatch = useDispatch()
  const handleClick = (channel) => {
    dispatch(setCurrentChannel(channel))
  }

  const handleChannelDropdown = (channel, modalType) => {
    dispatch(selectChannelId(channel.id))
    dispatch(showModal(modalType))
  }

  return (
    <Nav
      id="channels-box"
      className="flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block"
      as="ul"
    >
      {channels.map(channel => (
        <Nav.Item className="w-100" as="li" key={channel.id}>
          {channel.removable
            ? (
                <Dropdown as={ButtonGroup} className="d-flex">
                  <Button
                    type="button"
                    variant={
                      channel.id === currentChannel.id ? 'secondary' : 'light'
                    }
                    className="w-100 rounded-0 text-start text-truncate"
                    onClick={() => handleClick(channel)}
                    aria-label={channel.name}
                  >
                    <span className="me-1"># </span>
                    {channel.name}
                  </Button>

                  <Dropdown.Toggle
                    split
                    id="dropdown-split-basic"
                    variant={
                      channel.id === currentChannel.id ? 'secondary' : 'light'
                    }
                  >
                    <span className="visually-hidden">{t('mainPage.controlChannel')}</span>
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item
                      as="button"
                      onClick={() => handleChannelDropdown(channel, 'removeChannel')}
                    >
                      {t('mainPage.delete')}
                    </Dropdown.Item>
                    <Dropdown.Item
                      as="button"
                      onClick={() => handleChannelDropdown(channel, 'renameChannel')}
                    >
                      {t('mainPage.rename')}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              )
            : (
                <Button
                  onClick={() => handleClick(channel)}
                  type="button"
                  variant={channel.id === currentChannel.id ? 'secondary' : 'light'}
                  className="w-100 rounded-0 text-start"
                >
                  <span className="me-1"># </span>
                  {channel.name}
                </Button>
              )}
        </Nav.Item>
      ))}
    </Nav>
  )
}

Channels.propTypes = {
  channels: PropTypes.node.isRequired,
}

const Messages = ({ messages }) => {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div id="messages-box" className="chat-messages overflow-auto px-5">
      {messages.map(message => (
        <div className="text-break mb-2" key={message.id}>
          <b>{message.username}</b>
          {`: ${message.body}`}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

Messages.propTypes = {
  messages: PropTypes.node.isRequired,
}

const MessageForm = () => {
  const dispatch = useDispatch()
  const { logOut } = useAuth()
  const filterWords = useFilter()
  const { t } = useTranslation()
  const inputRef = useRef(null)
  const [inputValue, setInputValue] = useState('')
  const { channels, auth, messages } = useSelector(state => state)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage)
    }
  }, [errorMessage])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [channels.currentChannel])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!inputValue.trim()) return
    const newMessage = {
      id: messages.list.length,
      body: filterWords(inputValue),
      channelId: channels.currentChannel.id,
      username: auth.username,
    }

    try {
      await axios.post(apiPaths.messages(), newMessage, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      })
      setInputValue('')
      setErrorMessage(null)
      if (inputRef.current) {
        inputRef.current.focus()
      }
      inputRef.current?.focus()
    }
    catch (error) {
      if (error.response?.status === 401) {
        toast.error(t('notification.unauthorized'))
        localStorage.removeItem('userId')
        dispatch(logOut())
        routes.login()
      }
      else {
        setErrorMessage(error.message || t('notifications.messageError'))
      }
    }
  }

  return (
    <BootstrapForm className="py-1 border rounded-2" onSubmit={handleSubmit}>
      <BootstrapForm.Group className="input-group has-validation">
        <BootstrapForm.Control
          autoComplete="off"
          ref={inputRef}
          name="body"
          aria-label="Новое сообщение"
          placeholder={t('mainPage.inputMessage')}
          type="text"
          value={inputValue}
          className="border-0 p-0 ps-2 form-control"
          onChange={e => setInputValue(e.target.value)}
        />
        <button className="btn btn-group-vertical" type="submit">
          <img
            src={sendMessageButton}
            alt="sendButtonMessage"
            width="20"
            height="20"
          />
          <span className="visually-hidden">{t('mainPage.send')}</span>
        </button>
      </BootstrapForm.Group>
      {errorMessage && <div className="text-danger">{errorMessage}</div>}
    </BootstrapForm>
  )
}

const NewChannelButton = () => {
  const dispatch = useDispatch()

  return (
    <button
      type="button"
      className="p-0 text-primary btn btn-group-vertical"
      onClick={() => dispatch(showModal('addChannel'))}
    >
      <img
        src={addChannelButton}
        alt="addChannelButton"
        width="20"
        height="20"
      />
      <span className="visually-hidden">+</span>
    </button>
  )
}

const MainPage = () => {
  const dispatch = useDispatch()
  const { auth, channels, messages } = useSelector(state => state)
  const { t } = useTranslation()

  useEffect(() => {
    if (!auth.token) return

    const fetchData = async () => {
      try {
        const [channelsResponse, messagesResponse] = await Promise.all([
          axios.get(apiPaths.channels(), {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }),
          axios.get(apiPaths.messages(), {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }),
        ])

        dispatch(setChannels(channelsResponse.data))
        const [firstChannel] = channelsResponse.data
        dispatch(setCurrentChannel(firstChannel))
        dispatch(setMessages(messagesResponse.data))
      }
      catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [auth.token, dispatch])

  const currentChannel = useSelector(state => state.channels.currentChannel)
  const currentChannelName = currentChannel
    ? currentChannel.name
    : 'Канал не выбран'

  const channelMessages = messages.list.filter(
    message => message.channelId === channels.currentChannel.id,
  )

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <Col className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
          <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
            <b>{t('mainPage.channels')}</b>
            <NewChannelButton />
          </div>

          <Channels channels={channels.list} />
        </Col>
        <Col className="p-0 h-100 ">
          <div className="d-flex flex-column h-100">
            <div className="bg-light mb-4 p-3 shadow-sm small">
              <p className="m-0">
                <b>{`# ${currentChannelName}`}</b>
              </p>
              <span className="text-muted">
                {t('mainPage.messages', {
                  count: channelMessages.filter(
                    message => message.channelId === currentChannel.id,
                  ).length,
                })}
              </span>
            </div>

            <Messages messages={channelMessages} />

            <div className="mt-auto px-5 py-3">
              <MessageForm />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default MainPage
