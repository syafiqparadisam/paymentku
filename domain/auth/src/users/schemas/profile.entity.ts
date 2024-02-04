import { Column, Entity, ManyToOne,OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Profile {
    @Column({ nullable: true })
    bio: string

    @Column()
    name: string;

    @Column()
    photo_profile: string

    @PrimaryGeneratedColumn()
    id: number
}