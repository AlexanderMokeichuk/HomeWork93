import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Album } from './album.schema';

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
}
