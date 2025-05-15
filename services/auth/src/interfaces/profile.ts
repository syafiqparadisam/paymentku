export type profile = {
	id: number,
	user: string,
	email: string,
	accountNumber: number,
	balance: BigInt,
	name: string,
	created_at: string,
	bio: string | null,
	phone_number: string | null,
	photo_profile: string,
	photo_public_id: string | null
}

export type profileForFindWithAccount = {
	id: number,
	user: string,
	accountNumber: number,
	created_at: string,
	name: string,
	photo_profile: string,
}
