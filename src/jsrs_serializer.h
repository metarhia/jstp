// Copyright (c) 2016-2017 JSTP project authors. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.

#ifndef SRC_JSRS_SERIALIZER_H_
#define SRC_JSRS_SERIALIZER_H_

#include <v8.h>

namespace jstp {

namespace serializer {

// Serializes a JavaScript value using the JSTP Record Serialization format
// and returns a string representing it.
v8::Local<v8::String> Stringify(v8::Isolate* isolate,
                                v8::Local<v8::Value> value);

// Serializes a JavaScript date using the JSTP Record Serialization format
// and returns a string representing it.
v8::Local<v8::String> StringifyDate(v8::Isolate* isolate,
                                    v8::Local<v8::Date> date);

// Serializes a JavaScript array using the JSTP Record Serialization format
// and returns a string representing it.
v8::Local<v8::String> StringifyArray(v8::Isolate* isolate,
                                     v8::Local<v8::Array> array);

// Serializes a JavaScript string using the JSTP Record Serialization format
// and returns a string representing it.
v8::Local<v8::String> StringifyString(v8::Isolate* isolate,
                                      v8::Local<v8::String> string);

// Serializes a JavaScript object using the JSTP Record Serialization format
// and returns a string representing it.
v8::Local<v8::String> StringifyObject(v8::Isolate* isolate,
                                      v8::Local<v8::Object> object);

// Serializes a key of an object using the JSTP Record Serialization format
// and returns a string representing it.
v8::Local<v8::String> StringifyKey(v8::Isolate* isolate,
                                   v8::Local<v8::String> key);

}  // namespace serializer

}  // namespace jstp

#endif  // SRC_JSRS_SERIALIZER_H_
