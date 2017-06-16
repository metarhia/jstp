// Copyright (c) 2016-2017 JSTP project authors. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.

#ifndef SRC_JSRS_PARSER_H_
#define SRC_JSRS_PARSER_H_

#include <cstddef>

#include <v8.h>

namespace jstp {

namespace parser {

// Deserializes a UTF-8 encoded string in the JSTP Record Serialization format
// into a JavaScript value and returns a handle to it.
v8::Local<v8::Value> Parse(v8::Isolate* isolate,
                           const v8::String::Utf8Value& in);

namespace internal {

// Returns count of bytes needed to skip to next token.
size_t SkipToNextToken(const char* str, const char* end);

// Parses an undefined value from `begin` but never past `end` and returns the
// parsed JavaScript value. The `size` is incremented by the number of
// characters the function has used in the string so that the calling side
// knows where to continue from.
v8::MaybeLocal<v8::Value> ParseUndefined(v8::Isolate* isolate,
                                         const char*  begin,
                                         const char*  end,
                                         std::size_t* size);

// Parses a null value from `begin` but never past `end` and returns the parsed
// JavaScript value. The `size` is incremented by the number of characters the
// function has used in the string so that the calling side knows where to
// continue from.
v8::MaybeLocal<v8::Value> ParseNull(v8::Isolate* isolate,
                                    const char*  begin,
                                    const char*  end,
                                    std::size_t* size);

// Parses a boolean value from `begin` but never past `end` and returns the
// parsed JavaScript value. The `size` is incremented by the number of
// characters the function has used in the string so that the calling side
// knows where to continue from.
v8::MaybeLocal<v8::Value> ParseBool(v8::Isolate* isolate,
                                    const char*  begin,
                                    const char*  end,
                                    std::size_t* size);

// Parses a numeric value from `begin` but never past `end` and returns the
// parsed JavaScript value. The `size` is incremented by the number of
// characters the function has used in the string so that the calling side
// knows where to continue from.
v8::MaybeLocal<v8::Value> ParseNumber(v8::Isolate* isolate,
                                      const char*  begin,
                                      const char*  end,
                                      std::size_t* size);

// Parses a string value from `begin` but never past `end` and returns the
// parsed JavaScript value. The `size` is incremented by the number of
// characters the function has used in the string so that the calling side
// knows where to continue from.
v8::MaybeLocal<v8::Value> ParseString(v8::Isolate* isolate,
                                      const char*  begin,
                                      const char*  end,
                                      std::size_t* size);

// Parses an array from `begin` but never past `end` and returns the parsed
// JavaScript value. The `size` is incremented by the number of characters the
// function has used in the string so that the calling side knows where to
// continue from.
v8::MaybeLocal<v8::Value> ParseArray(v8::Isolate* isolate,
                                     const char*  begin,
                                     const char*  end,
                                     std::size_t* size);

// Parses an object key from `begin` but never past `end` and returns
// the parsed JavaScript value. The `size` is incremented by the number
// of characters the function has used in the string so that the calling side
// knows where to continue from.
v8::MaybeLocal<v8::String> ParseKeyInObject(v8::Isolate* isolate,
                                            const char*  begin,
                                            const char*  end,
                                            std::size_t* size);

// Parses a value corresponding to key inside object from `begin`
// but never past `end` and returns the parsed JavaScript value.
// The `size` is incremented by the number of characters the function has used
// in the string so that the calling side knows where to continue from.
v8::MaybeLocal<v8::Value> ParseValueInObject(v8::Isolate* isolate,
                                             const char*  begin,
                                             const char*  end,
                                             std::size_t* size);

// Parses an object from `begin` but never past `end` and returns the parsed
// JavaScript value. The `size` is incremented by the number of characters the
// function has used in the string so that the calling side knows where to
// continue from.
v8::MaybeLocal<v8::Value> ParseObject(v8::Isolate* isolate,
                                      const char*  begin,
                                      const char*  end,
                                      std::size_t* size);

// Parses a decimal number, either integer or float.
v8::MaybeLocal<v8::Value> ParseDecimalNumber(v8::Isolate* isolate,
                                             const char*  begin,
                                             const char*  end,
                                             std::size_t* size,
                                             bool         negate_result);

// Parses an integer number in arbitrary base without prefixes.
v8::Local<v8::Value> ParseIntegerNumber(v8::Isolate* isolate,
                                        const char*  begin,
                                        const char*  end,
                                        std::size_t* size,
                                        int          base,
                                        bool         negate_result);

// Parses an integer number, which is too big to be parsed using
// ParseIntegerNumber, in arbitrary base without prefixes.
v8::Local<v8::Value> ParseBigIntegerNumber(v8::Isolate* isolate,
                                           const char*  begin,
                                           const char*  end,
                                           std::size_t* size,
                                           int          base,
                                           bool         negate_result);

// Parses a noctal integer number.
v8::MaybeLocal<v8::Value> ParseNoctalNumber(v8::Isolate* isolate,
                                            const char*  begin,
                                            const char*  end,
                                            std::size_t* size,
                                            bool         negate_result);


}  // namespace internal

}  // namespace parser

}  // namespace jstp

#endif  // SRC_JSRS_PARSER_H_
