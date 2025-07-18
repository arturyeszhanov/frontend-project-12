import { io } from 'socket.io-client'

const URL = import.meta.env.NODE_ENV === 'production'
  ? undefined
  : 'http://localhost:5001'

export default io(URL, {
  withCredentials: true,
})
