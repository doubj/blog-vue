const getters = {
    sidebar: state => state.app.sidebar,
    device: state => state.app.device,
    wordCloudData: state => state.app.wordCloudData,
    token: state => state.user.token,
    avatar: state => state.user.avatar,
    nickName: state => state.user.nickName,
    introduce: state => state.user.introduce,
  }
  export default getters
  