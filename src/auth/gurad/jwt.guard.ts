import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@Nestjs/passport"

@Injectable()
export class JwtGuard extends AuthGuard('jwt') {}