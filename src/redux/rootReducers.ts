import { combineReducers } from 'redux'
import { HYDRATE } from 'next-redux-wrapper'
import { InitDataAction } from 'src/redux/initData'
import { actionTypesProfile, initialStateUser, UserAction } from 'src/redux/user'
import { NotificationAction } from 'src/redux/notification'
import * as user from 'src/redux/user'
import * as initData from 'src/redux/initData'
import * as mqtt from 'src/redux/mqtt'
import * as notification from 'src/redux/notification'

const rootReducer = combineReducers({
  initData: initData.reducers,
  user: user.reducers,
  mqtt: mqtt.reducers,
  notification: notification.reducers
})

export type RootAction = UserAction | InitDataAction | NotificationAction
// : Store.RootState
const reducer = (state, action): Store.RootState => {
  switch (action.type) {
    case HYDRATE:
      return { ...state, ...action.payload }
    case actionTypesProfile.GET_LOGOUT_REQUEST:
      return {
        ...state,
        user: initialStateUser
      }
    default:
      return rootReducer(state, action)
  }
}

export default reducer
