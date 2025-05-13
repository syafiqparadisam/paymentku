export type profile = {
	user: string,
	email: string,
	accountNumber: BigInt,
	balance: BigInt,
	name: string,
	created_at: string,
	bio: string | null,
	phone_number: string | null,
	photo_profile: string,
	photo_public_id: string | null
}

export type profileForFindWithAccount = {
	user: string,
	accountNumber: BigInt,
	created_at: string,
	name: string,
	photo_profile: string,
}
