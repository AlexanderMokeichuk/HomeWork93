import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Query } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import { CreateTrackDto } from './create-track.dto';

@Controller('tracks')
export class TrackController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}

  @Post()
  async createTrack(@Body() trackDto: CreateTrackDto) {
    const track = new this.trackModel({
      name: trackDto.name,
      album: trackDto.album,
      duration: trackDto.duration,
      item: trackDto.item,
    });

    return await track.save();
  }

  @Get()
  async getAll(@Query('album') album: string) {
    if (album) {
      const tracksById = await this.trackModel.find({ album: album });

      return tracksById;
    }

    return this.trackModel.find();
  }

  @Delete(':id')
  async deleteTrack(@Param('id') id: string) {
    const result = await this.trackModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Track does not delete');
    }
    return { message: 'Track deleted successfully.' };
  }
}
