import { Organization } from './organization'
import { SystemFields } from './utility/fields'

export interface PasswordReset {
    resetPasswordToken: string
    password: string
    passwordConfirm: string
}

export interface User extends SystemFields {
    email?: string
    organizations?: [Organization]
    update(): Promise<User>
    delete(): Promise<Response>
    requestPassword(): Promise<Response>
    resetPassword(data: PasswordReset): Promise<Response>
    getTasks(params: object): Promise<any>
}
