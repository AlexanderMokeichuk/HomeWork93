import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Track, TrackDocument } from '../schemas/track.schema';
import { CreateTrackDto } from './create-track.dto';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { PermitAuthGuard } from '../auth/permit-auth.guard';

@Controller('tracks')
export class TrackController {
  constructor(
    @InjectModel(Track.name)
    private trackModel: Model<TrackDocument>,
  ) {}

  @UseGuards(TokenAuthGuard)
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
    try {
      if (album) {
        const tracksById = await this.trackModel.find({ album: album });

        if (!tracksById.length) {
          throw new NotFoundException('Not found tracksById!');
        }

        return tracksById;
      }

      return this.trackModel.find();
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  @Delete(':id')
  @UseGuards(TokenAuthGuard, PermitAuthGuard)
  @SetMetadata('roles', 'admin')
  async deleteTrack(@Param('id') id: string) {
    const result = await this.trackModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Track does not delete');
    }
    return { message: 'Track deleted successfully.' };
  }
}
