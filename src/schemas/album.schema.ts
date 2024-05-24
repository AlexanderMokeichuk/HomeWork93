import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, {Document} from 'mongoose';
import { Artist } from './artist.schema';

@Schema()
export class Album {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Artist.name,
    required: true,
  })
  artist: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  createdAt: number;

  @Prop()
  image: string;
}

export type AlbumDocument = Album & Document;
export const AlbumSchema = SchemaFactory.createForClass(Album);
