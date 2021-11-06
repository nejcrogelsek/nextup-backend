export interface IUser {
	_id: string
	profile_image: string
	first_name: string
	last_name: string
	email: string
	confirmed: boolean
	password: string
	created_at: Date
	updated_at: Date
}