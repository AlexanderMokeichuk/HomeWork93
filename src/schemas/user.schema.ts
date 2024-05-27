import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface UserMethods {
  generateToken(): void;

  checkPassword(password: string): Promise<boolean>;
}

const SALT_WORK_FACTOR = 10;

@Schema()
export class User {
  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  token: string;

  @Prop({
    required: true,
    enum: ['admin', 'user'],
    default: 'user',
  })
  role: string;

  @Prop()
  displayName: string;
}

export type UserDocument = User & Document & UserMethods;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.methods.generateToken = function generateToken() {
  this.token = crypto.randomUUID();
};

UserSchema.methods.checkPassword = async function (
  password: string,
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});
