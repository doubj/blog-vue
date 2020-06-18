import { login, getInfo, updateInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { Message } from 'element-ui'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    nickName: '',
    avatar: '',
    introduce: '',
  }
}

const state = getDefaultState()

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduce) => {
    state.introduce = introduce
  },
  SET_NAME: (state, nickName) => {
    state.nickName = nickName
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { userName, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ userName: userName.trim(), password: password }).then(response => {
        if (response.length > 0) {
          commit('SET_TOKEN', response)
          setToken(response)
          resolve()
        } else {
          Message({
            message: '登录失败，账号密码错误',
            type: 'error',
            duration: 5 * 1000
          })
          reject()
        }
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        if (!response) {
          reject('Verification failed, please Login again.')
        }

        const { roles, nickName, avatar, introduce } = response

        // roles must be a non-empty array
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }

        commit('SET_NAME', nickName)
        commit('SET_AVATAR', avatar)
        commit('SET_INTRODUCTION', introduce)
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },
  updateInfo({ commit }, userInfo) {
    return new Promise((resolve, reject) => {
      updateInfo(userInfo).then(() => {
        commit('SET_NAME', userInfo.nickName)
        commit('SET_INTRODUCTION', userInfo.introduce)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // user logout
  logout({ commit, dispatch }) {
    return new Promise((resolve, reject) => {
      try {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },
  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

