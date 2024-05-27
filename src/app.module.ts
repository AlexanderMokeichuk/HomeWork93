import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArtistController } from './artist/artist.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Artist, ArtistSchema } from './schemas/artist.schema';
import { Album, AlbumSchema } from './schemas/album.schema';
import { Track, TrackSchema } from './schemas/track.schema';
import { AlbumController } from './album/album.controller';
import { TrackController } from './track/track.controller';
import { UsersController } from './users/users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { AuthService } from './auth/auth.service';
import { LocalStrategy } from './auth/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { PermitAuthGuard } from './auth/permit-auth.guard';
import { TokenAuthGuard } from './auth/token-auth.guard';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/musicApp'),
    MongooseModule.forFeature([
      { name: Artist.name, schema: ArtistSchema },
      { name: Album.name, schema: AlbumSchema },
      { name: Track.name, schema: TrackSchema },
      { name: User.name, schema: UserSchema },
    ]),
    PassportModule,
  ],
  controllers: [
    AppController,
    ArtistController,
    AlbumController,
    TrackController,
    UsersController,
  ],
  providers: [
    AppService,
    AuthService,
    LocalStrategy,
    PermitAuthGuard,
    TokenAuthGuard,
  ],
})
export class AppModule {}
