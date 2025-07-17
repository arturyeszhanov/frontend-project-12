const apiPath = '/api/v1'

export default {
  login: () => `${apiPath}/login`,
  users: () => `${apiPath}/data`,
  messages: () => `${apiPath}/messages`,
  signup: () => `${apiPath}/signup`,
  channels: id => id ? `${apiPath}/channels/${id}` : `${apiPath}/channels`,
  socket: () => import.meta.env.VITE_SOCKET_HOST,
}
