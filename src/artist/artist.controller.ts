import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Artist, ArtistDocument } from '../schemas/artist.schema';
import { Model } from 'mongoose';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateArtistDto } from './create-artist.dto';
import { TokenAuthGuard } from '../auth/token-auth.guard';

@Controller('artists')
export class ArtistController {
  constructor(
    @InjectModel(Artist.name)
    private artistModel: Model<ArtistDocument>,
  ) {}

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', { dest: './public/images' }))
  async createArtist(
    @UploadedFile() file: Express.Multer.File,
    @Body() artistDto: CreateArtistDto,
  ) {
    const artist = new this.artistModel({
      name: artistDto.name,
      image: file ? '/images/' + file.filename : null,
      description: artistDto.description,
    });

    return await artist.save();
  }

  @Get()
  getAll() {
    return this.artistModel.find();
  }

  @Get(':id')
  getByID(@Param('id') id: string) {
    return this.artistModel.findById({ _id: id });
  }

  @Delete(':id')
  async deleteArtist(@Param('id') id: string) {
    const result = await this.artistModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Artist does not delete');
    }
    return { message: 'Artist deleted successfully.' };
  }
}
