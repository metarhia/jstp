// Copyright (c) 2016-2017 JSTP project authors. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.

#include <node.h>
#include <v8.h>

#include "common.h"
#include "jsrs_parser.h"
#include "packet_parser.h"

using v8::Array;
using v8::FunctionCallbackInfo;
using v8::HandleScope;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

namespace jstp {

namespace bindings {

void Parse(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  if (args.Length() != 1) {
    THROW_EXCEPTION(TypeError, "Wrong number of arguments");
    return;
  }
  if (!args[0]->IsString() && !args[0]->IsUint8Array()) {
    THROW_EXCEPTION(TypeError, "Wrong argument type");
    return;
  }

  HandleScope scope(isolate);

  String::Utf8Value str(args[0]->ToString());
  auto result = jstp::parser::Parse(isolate, str);
  args.GetReturnValue().Set(result);
}

void ParseNetworkPackets(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();

  if (args.Length() != 2) {
    THROW_EXCEPTION(TypeError, "Wrong number of arguments");
    return;
  }
  if (!args[0]->IsString() || !args[1]->IsArray()) {
    THROW_EXCEPTION(TypeError, "Wrong argument type");
    return;
  }

  HandleScope scope(isolate);

  String::Utf8Value str(args[0]->ToString());
  auto array = args[1].As<Array>();
  auto result = jstp::packet_parser::ParseNetworkPackets(isolate, str, array);
  args.GetReturnValue().Set(result);
}

void Init(Local<Object> target) {
  NODE_SET_METHOD(target, "parse", Parse);
  NODE_SET_METHOD(target, "parseNetworkPackets", ParseNetworkPackets);
}

NODE_MODULE(jsrs, Init);

}  // namespace bindings

}  // namespace jstp
