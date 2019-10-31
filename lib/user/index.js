
import cloneDeep from 'lodash/cloneDeep'

export function User (http, data) {
  const user = cloneDeep(data)
  return user
}

export function UserCollection (http, data) {
  const obj = cloneDeep(data)
  const userCollection = obj.map((userdata) => {
    return User(http, userdata)
  })
  return userCollection
}
