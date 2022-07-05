import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Verifies {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  code: string;
  @Column()
  expiryDate: number;
}
