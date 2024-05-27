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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from '../schemas/album.schema';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAlbumDto } from './create-album.dto';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { PermitAuthGuard } from '../auth/permit-auth.guard';

@Controller('albums')
export class AlbumController {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {}

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', { dest: './public/images' }))
  async createAlbum(
    @UploadedFile() file: Express.Multer.File,
    @Body() albumDto: CreateAlbumDto,
  ) {
    const album = new this.albumModel({
      name: albumDto.name,
      artist: albumDto.artist,
      image: file ? '/images/' + file.filename : null,
      createdAt: albumDto.createdAt,
    });

    return await album.save();
  }

  @Get()
  async getAll(@Query('artist') artist: string) {
    if (artist) {
      const albumsById = await this.albumModel.find({ artist: artist }).sort({
        createdAt: -1,
      });

      return albumsById;
    }

    return this.albumModel.find();
  }

  @Get(':id')
  async getByID(@Param('id') id: string) {
    try {
      const album = await this.albumModel.findById({ _id: id });
      if (!album) {
        throw new NotFoundException('Not found album!');
      }

      return album;
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  @Delete(':id')
  @UseGuards(TokenAuthGuard, PermitAuthGuard)
  @SetMetadata('roles', 'admin')
  async deleteArtist(@Param('id') id: string) {
    const result = await this.albumModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException('Album does not delete');
    }
    return { message: 'Album deleted successfully.' };
  }
}
