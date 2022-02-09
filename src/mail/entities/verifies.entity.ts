import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Verifies {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  email: string;
  @Column()
  code: number;
  @Column()
  expiryDate: number;
}
