import { Observable } from "rxjs";
export declare const protobufPackage = "user";
export interface Empty {
}
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
export declare const USER_PACKAGE_NAME = "user";
export interface UsersServiceClient {
    findOne(request: FindOneRequest, ...rest: any): Observable<UserResponse>;
    findAll(request: Empty, ...rest: any): Observable<UserListResponse>;
    findManyById(request: FindManyByIdRequest, ...rest: any): Observable<UserListResponse>;
}
export interface UsersServiceController {
    findOne(request: FindOneRequest, ...rest: any): Promise<UserResponse> | Observable<UserResponse> | UserResponse;
    findAll(request: Empty, ...rest: any): Promise<UserListResponse> | Observable<UserListResponse> | UserListResponse;
    findManyById(request: FindManyByIdRequest, ...rest: any): Promise<UserListResponse> | Observable<UserListResponse> | UserListResponse;
}
export declare function UsersServiceControllerMethods(): (constructor: Function) => void;
export declare const USERS_SERVICE_NAME = "UsersService";
