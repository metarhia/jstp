// Copyright (c) 2016-2017 JSTP project authors. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.

#include "packet_parser.h"

#include <cstddef>

#include <v8.h>

#include "common.h"
#include "jsrs_parser.h"

using std::size_t;

using v8::Array;
using v8::Exception;
using v8::Isolate;
using v8::Local;
using v8::String;

using jstp::parser::internal::PrepareString;
using jstp::parser::internal::ParseObject;

namespace jstp {

namespace packet_parser {

Local<String> ParseNetworkPackets(Isolate* isolate,
                                  const String::Utf8Value& in,
                                  Local<Array> out) {
  size_t total_size = 0;
  size_t parsed_size = 0;
  const char* source = PrepareString(isolate, *in, in.length(), &total_size);
  const char* curr_chunk = source;
  int index = 0;

  while (parsed_size < total_size) {
    auto chunk_size = strlen(curr_chunk);
    parsed_size += chunk_size + 1;

    if (parsed_size <= total_size) {
      size_t parsed_chunk_size = 0;
      auto result = ParseObject(isolate, curr_chunk,
          curr_chunk + chunk_size, &parsed_chunk_size);

      if (parsed_chunk_size != chunk_size) {
        delete[] source;
        THROW_EXCEPTION(SyntaxError, "Invalid format");
        return String::Empty(isolate);
      }

      out->Set(index++, result);
      curr_chunk += chunk_size + 1;
    }
  }

  auto rest = String::NewFromUtf8(isolate, curr_chunk);
  delete[] source;
  return rest;
}

}  // namespace packet_parser

}  // namespace jstp
