// Copyright (c) 2016-2017 JSTP project authors. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.

#include "packet_parser.h"

#include <cstddef>
#include <cstring>

#include <v8.h>

#include "common.h"
#include "jsrs_parser.h"

using std::size_t;
using std::strlen;

using v8::Array;
using v8::Isolate;
using v8::Local;
using v8::String;

using jstp::parser::internal::ParseObject;
using jstp::parser::internal::SkipToNextToken;

namespace jstp {

namespace packet_parser {

Local<String> ParseNetworkPackets(Isolate* isolate,
                                  const String::Utf8Value& in,
                                  Local<Array> out) {
  const size_t total_size = in.length();
  size_t parsed_size = 0;
  const char* source = *in;
  const char* curr_chunk = source;
  int index = 0;

  while (parsed_size < total_size) {
    auto chunk_size = strlen(curr_chunk);
    parsed_size += chunk_size + 1;

    if (parsed_size <= total_size) {
      size_t skipped_size = SkipToNextToken(curr_chunk,
          curr_chunk + chunk_size);
      size_t parsed_chunk_size;
      auto result = ParseObject(isolate, curr_chunk + skipped_size,
          curr_chunk + chunk_size, &parsed_chunk_size);

      parsed_chunk_size += skipped_size;
      parsed_chunk_size += SkipToNextToken(curr_chunk + parsed_chunk_size,
          curr_chunk + chunk_size);

      if (parsed_chunk_size != chunk_size) {
        THROW_EXCEPTION(SyntaxError, "Invalid format");
        return Local<String>();
      }

      out->Set(index++, result);
      curr_chunk += chunk_size + 1;
    }
  }

  auto rest = String::NewFromUtf8(isolate, curr_chunk);
  return rest;
}

}  // namespace packet_parser

}  // namespace jstp
