import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { User } from './auth/entities/auth.entity.js';
  
  export enum EventStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
  }
  
  export enum ReviewDecision {
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
  }
  

  @Entity()
  export class Category {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    name: string;
  }
  
  @Entity()
  export class Tag {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ unique: true })
    name: string;
  }
  
  @Entity()
  export class Event {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    name: string;
  
    @Column({ type: 'text', nullable: true })
    description: string;
  
    @Column({ type: 'timestamp' })
    date: Date;
  
    @Column({ nullable: true })
    location: string;
  
    @Column({ type: 'enum', enum: EventStatus, default: EventStatus.PENDING })
    status: EventStatus;
  
    @ManyToOne(() => Category)
    category: Category;
  
    @ManyToOne(() => User)
    user: User;
  
    @ManyToMany(() => Tag)
    @JoinTable()
    tags: Tag[];
  
    @OneToMany(() => Image, (image) => image.event,{cascade:true}) // so we dont have to make seprate call to save images.
    images: Image[];
  
    @CreateDateColumn()
    createdAt: Date;
  
    @DeleteDateColumn()
    deletedAt: Date;
  }
  
  @Entity()
  export class Image {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    path: string;
  
    @ManyToOne(() => Event, (event) => event.images, { onDelete: 'CASCADE' })
    event: Event;
  
    @CreateDateColumn()
    createdAt: Date;
  }
  
  @Entity()
  export class Review {
    @PrimaryGeneratedColumn()
    id: number;
  
    @OneToOne(() => Event)
    @JoinColumn()
    event: Event;
  
    @ManyToOne(() => User)
    admin: User;
  
    @Column({ type: 'enum', enum: ReviewDecision })
    decision: ReviewDecision;
  
    @Column({ type: 'text', nullable: true })
    reason: string;
  
    @CreateDateColumn()
    createdAt: Date;
  }