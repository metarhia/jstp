// Copyright (c) 2016-2017 JSTP project authors. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.

#ifndef SRC_PACKET_PARSER_H_
#define SRC_PACKET_PARSER_H_

#include <v8.h>

namespace jstp {

namespace packet_parser {

// Efficiently parses JSTP packets for transports that require packet
// delimiters eliminating the need to split the stream data into parts before
// parsing and allowing to do that in one pass.
v8::Local<v8::String> ParseNetworkPackets(v8::Isolate* isolate,
    const v8::String::Utf8Value& in, v8::Local<v8::Array> out);

}  // namespace packet_parser

}  // namespace jstp

#endif  // SRC_PACKET_PARSER_H_
