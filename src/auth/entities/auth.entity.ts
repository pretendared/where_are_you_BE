import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;

  @Column({ unique: true, default: null, nullable: true })
  nickname: string;

  @Column({ nullable: true, default: null })
  profileImage: string | null;

  @Column({default: 'google'})
  provider: string;

  @Column({nullable: true, default: null})
  role: string | null;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
