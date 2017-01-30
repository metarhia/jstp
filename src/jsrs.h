// Copyright (c) 2016-2017 JSTP project authors. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.

#ifndef JSRS_H_
#define JSRS_H_

#include <node.h>
#include <v8.h>

namespace jstp {

namespace jsrs {

// Serializes a JavaScript value using the JSTP Record Serialization format
// and returns a string representing it.
v8::Local<v8::String> Stringify(v8::Isolate* isolate,
    v8::Local<v8::Value> value);

// Deserializes a UTF-8 encoded string in the JSTP Record Serialization format
// into a JavaScript value and returns a handle to it.
v8::Local<v8::Value> Parse(v8::Isolate* isolate,
    const v8::String::Utf8Value& in);

// Efficiently parses JSTP packets for transports that require packet
// delimiters eliminating the need to split the stream data into parts before
// parsing and allowing to do that in one pass.
v8::Local<v8::String> ParseNetworkPackets(v8::Isolate* isolate,
    const v8::String::Utf8Value& in, v8::Local<v8::Array> out);

namespace bindings {

// JavaScript binding to jstp::jsrs::Stringify.
void Stringify(const v8::FunctionCallbackInfo<v8::Value>& args);

// JavaScript binding to jstp::jsrs::Parse.
void Parse(const v8::FunctionCallbackInfo<v8::Value>& args);

// JavaScript binding to jstp::jsrs::ParseNetworkPackets.
void ParseNetworkPackets(const v8::FunctionCallbackInfo<v8::Value>& args);

}  // namespace bindings

}  // namespace jsrs

}  // namespace jstp

#endif  // JSRS_H_
