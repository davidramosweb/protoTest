/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { util, configure } from "protobufjs/minimal";
import * as Long from "long";
import { Observable } from "rxjs";

export const protobufPackage = "user";

export interface Empty {}

export interface FindOneRequest {
  id: number;
}

export interface FindManyByIdRequest {
  ids: number[];
}

export interface UserListResponse {
  users: UserResponse[];
}

export interface UserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export const USER_PACKAGE_NAME = "user";

export interface UsersServiceClient {
  findOne(request: FindOneRequest, ...rest: any): Observable<UserResponse>;

  findAll(request: Empty, ...rest: any): Observable<UserListResponse>;

  findManyById(
    request: FindManyByIdRequest,
    ...rest: any
  ): Observable<UserListResponse>;
}

export interface UsersServiceController {
  findOne(
    request: FindOneRequest,
    ...rest: any
  ): Promise<UserResponse> | Observable<UserResponse> | UserResponse;

  findAll(
    request: Empty,
    ...rest: any
  ):
    | Promise<UserListResponse>
    | Observable<UserListResponse>
    | UserListResponse;

  findManyById(
    request: FindManyByIdRequest,
    ...rest: any
  ):
    | Promise<UserListResponse>
    | Observable<UserListResponse>
    | UserListResponse;
}

export function UsersServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne", "findAll", "findManyById"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcMethod("UsersService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method
      );
      GrpcStreamMethod("UsersService", method)(
        constructor.prototype[method],
        method,
        descriptor
      );
    }
  };
}

export const USERS_SERVICE_NAME = "UsersService";

// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
