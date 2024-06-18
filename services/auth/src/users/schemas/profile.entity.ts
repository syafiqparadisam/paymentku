import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Profile  {
  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  photo_public_id: string;

  @Column({ type: 'text' })
  photo_profile: string;

  @Column({ nullable: true, length: 18, unique: true })
  phone_number: string;

  @PrimaryGeneratedColumn()
  id: number;
}
