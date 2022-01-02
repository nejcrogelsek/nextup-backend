export interface IUser {
	_id: string
	uid: string
	profile_image: string
	first_name: string
	last_name: string
	email: string
	created_at: Date
	updated_at: Date
}
export interface IToken {
	email: string
	id: string
	iat: number
	exp: number
}
export interface IAccessToken {
	access_token: string
}
export type IUserClient = {
	_id: number
	uid: string
	email: string
	first_name: string
	last_name: string
	profile_image: string
	confirmed: boolean
  }