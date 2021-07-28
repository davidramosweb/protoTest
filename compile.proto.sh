protoc \
--plugin=./node_modules/.bin/protoc-gen-ts_proto \
--ts_proto_out=. ./protos/*.proto \
--ts_proto_opt=nestJs=true,addNestjsRestParameter=true