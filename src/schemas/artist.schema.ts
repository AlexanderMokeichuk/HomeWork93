import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Artist {
  @Prop({ required: true })
  name: string;

  @Prop()
  image: string;

  @Prop()
  description: string;
}

export type ArtistDocument = Artist & Document;
export const ArtistSchema = SchemaFactory.createForClass(Artist);
