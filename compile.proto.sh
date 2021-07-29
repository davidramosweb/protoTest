mkdir -p ./build
protoc \
--plugin=./node_modules/.bin/protoc-gen-ts_proto \
--ts_proto_out=./build/ ./proto/*.proto \
--ts_proto_opt=nestJs=true,addNestjsRestParameter=true &&

mv build/proto/* build/ &&
rm -R build/proto &&
npm run generate-barrels &&
tsc -p tsconfig.json