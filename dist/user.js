"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USERS_SERVICE_NAME = exports.UsersServiceControllerMethods = exports.USER_PACKAGE_NAME = exports.protobufPackage = void 0;
/* eslint-disable */
const microservices_1 = require("@nestjs/microservices");
const minimal_1 = require("protobufjs/minimal");
const Long = require("long");
exports.protobufPackage = "user";
exports.USER_PACKAGE_NAME = "user";
function UsersServiceControllerMethods() {
    return function (constructor) {
        const grpcMethods = ["findOne", "findAll", "findManyById"];
        for (const method of grpcMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            microservices_1.GrpcMethod("UsersService", method)(constructor.prototype[method], method, descriptor);
        }
        const grpcStreamMethods = [];
        for (const method of grpcStreamMethods) {
            const descriptor = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
            microservices_1.GrpcStreamMethod("UsersService", method)(constructor.prototype[method], method, descriptor);
        }
    };
}
exports.UsersServiceControllerMethods = UsersServiceControllerMethods;
exports.USERS_SERVICE_NAME = "UsersService";
// If you get a compile-error about 'Constructor<Long> and ... have no overlap',
// add '--ts_proto_opt=esModuleInterop=true' as a flag when calling 'protoc'.
if (minimal_1.util.Long !== Long) {
    minimal_1.util.Long = Long;
    minimal_1.configure();
}
