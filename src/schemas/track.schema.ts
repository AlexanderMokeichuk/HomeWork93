import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Album } from './album.schema';
import { Artist } from './artist.schema';

@Schema()
export class Track {
  @Prop({ required: true })
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Album.name,
    required: true,
  })
  album: mongoose.Schema.Types.ObjectId;

  @Prop({ required: true })
  duration: string;

  @Prop({ required: true })
  item: number;

  @Prop({
    required: true,
    default: false,
  })
  isPublished: boolean;
}

export type TrackDocument = Artist & Document;
export const TrackSchema = SchemaFactory.createForClass(Track);
