import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Profile {
    @Column({ nullable: true })
    bio: string

    @Column()
    name: string;

    @Column({nullable: true})
    photo_profile: string

    @PrimaryGeneratedColumn()
    id: number
}