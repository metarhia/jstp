// JSTP Record Serialization
//
// Copyright (c) 2016 Mykola Bilochub, Alexey Orlenko
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.
//
// The code in this file is based upon the C++ implementation of JSTP parser
// and serializer originating from `https://github.com/NechaiDO/JSTP-cpp`.
// Original license:
//
// Copyright (c) 2016 Dmytro Nechai, Nikolai Belochub
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
// IN THE SOFTWARE.

#ifndef JSRS_IMPL_H_
#define JSRS_IMPL_H_

#include <cstddef>

#include <node.h>
#include <v8.h>

namespace jstp {

namespace jsrs {

namespace serializer {

// Serializes a JavaScript date into string.
v8::Local<v8::String> StringifyDate(v8::Isolate* isolate,
    v8::Local<v8::Date> date);

// Serializes a JavaScript string into another string representing it as it
// would have been written in JavaScript source code.
v8::Local<v8::String> StringifyString(v8::Isolate* isolate,
    v8::Local<v8::String> string);

// Serializes a JavaScript array into string.
v8::Local<v8::String> StringifyArray(v8::Isolate* isolate,
    v8::Local<v8::Array> array);

// Serializes a JavaScript object into string.
v8::Local<v8::String> StringifyObject(v8::Isolate* isolate,
    v8::Local<v8::Object> object);

// Serializes a key inside a JavaScript object into string without
// quotes if possible, with single quotes otherwise.
v8::Local<v8::String> StringifyKey(v8::Isolate* isolate,
    v8::Local<v8::String> key);

// Checks if a string can be a non-quoted object key.
bool IsValidKey(v8::Isolate* isolate, const v8::String::Utf8Value& key);

// Returns a string representing an escaped control character.
// If the given character is not a control one, returns nullptr.
// The `size` is being incremented by the length of the resulting
// string, but always at least by two, even when the function
// returns nullptr.
const char* GetEscapedControlChar(char str, std::size_t* size);

}  // namespace serializer

namespace deserializer {

// Enumeration of supported JavaScript types used for deserialization
// function selection.
enum Type {
  kUndefined = 0, kNull, kBool, kNumber, kString, kArray, kObject, kDate
};

// Parses an undefined value from `begin` but never past `end` and returns the
// parsed JavaScript value. The `size` is incremented by the number of
// characters the function has used in the string so that the calling side
// knows where to continue from.
v8::Local<v8::Value> ParseUndefined(v8::Isolate* isolate, const char* begin,
    const char* end, std::size_t* size);

// Parses a null value from `begin` but never past `end` and returns the parsed
// JavaScript value. The `size` is incremented by the number of characters the
// function has used in the string so that the calling side knows where to
// continue from.
v8::Local<v8::Value> ParseNull(v8::Isolate* isolate, const char* begin,
    const char* end, std::size_t* size);

// Parses a boolean value from `begin` but never past `end` and returns the
// parsed JavaScript value. The `size` is incremented by the number of
// characters the function has used in the string so that the calling side
// knows where to continue from.
v8::Local<v8::Value> ParseBool(v8::Isolate* isolate, const char* begin,
    const char* end, std::size_t* size);

// Parses a numeric value from `begin` but never past `end` and returns the
// parsed JavaScript value. The `size` is incremented by the number of
// characters the function has used in the string so that the calling side
// knows where to continue from.
v8::Local<v8::Value> ParseNumber(v8::Isolate* isolate, const char* begin,
    const char* end, std::size_t* size);

// Parses a string value from `begin` but never past `end` and returns the
// parsed JavaScript value. The `size` is incremented by the number of
// characters the function has used in the string so that the calling side
// knows where to continue from.
v8::Local<v8::Value> ParseString(v8::Isolate* isolate, const char* begin,
    const char* end, std::size_t* size);

// Parses an array from `begin` but never past `end` and returns the parsed
// JavaScript value. The `size` is incremented by the number of characters the
// function has used in the string so that the calling side knows where to
// continue from.
v8::Local<v8::Value> ParseArray(v8::Isolate* isolate, const char* begin,
    const char* end, std::size_t* size);

// Parses an object key from `begin` but never past `end` and returns
// the parsed JavaScript value. The `size` is incremented by the number
// of characters the function has used in the string so that the calling side
// knows where to continue from.
v8::Local<v8::String> ParseKeyInObject(v8::Isolate* isolate, const char* begin,
    const char* end, std::size_t* size);

// Parses a value corresponding to key inside object from `begin`
// but never past `end` and returns the parsed JavaScript value.
// The `size` is incremented by the number of characters the function has used
// in the string so that the calling side knows where to continue from.
v8::Local<v8::Value> ParseValueInObject(v8::Isolate* isolate, const char* begin,
    const char* end, std::size_t* size);

// Parses an object from `begin` but never past `end` and returns the parsed
// JavaScript value. The `size` is incremented by the number of characters the
// function has used in the string so that the calling side knows where to
// continue from.
v8::Local<v8::Value> ParseObject(v8::Isolate* isolate, const char* begin,
    const char* end, std::size_t* size);

// The table of parsing functions indexed with the values of the Type
// enumeration.
constexpr static v8::Local<v8::Value> (*kParseFunctions[])(v8::Isolate*,
    const char *, const char *, std::size_t *) = {
  &ParseUndefined,
  &ParseNull,
  &ParseBool,
  &ParseNumber,
  &ParseString,
  &ParseArray,
  &ParseObject
};

// The maximum length of object keys.
static const std::size_t kMaxKeyLength = 256;

// Returns true if `str` points to a valid Line Terminator Sequence code point,
// false otherwise. `size` will receive the number of bytes used by this
// code point (1, 2, 3).
bool IsLineTerminatorSequence(const char* str, std::size_t* size);

// Returns true if `str` points to a valid White space code point,
// false otherwise. `size` will receive the number of bytes used by this
// code point (1, 2, 3).
bool IsWhiteSpaceCharacter(const char* str, std::size_t* size);

// Prepares a source string for parsing throwing out whitespace and comments.
const char* PrepareString(v8::Isolate* isolate, const char* str,
    std::size_t length, std::size_t* new_length);

// Parses the type of the serialized JavaScript value at the position `begin`
// and before `end`. Returns true if it was able to detect the type, false
// otherwise.
bool GetType(const char* begin, const char* end, Type* type);

// Encodes a Unicode code point in UTF-8. `size` will receive the number of
// bytes used (1, 2, 3 or 4).
char* CodePointsToUtf8(unsigned int c, std::size_t* size);

// Parses a hexadecimal number into unsigned int. Whether the parsing
// was successful is determined by the value of `ok`.
unsigned int ReadHexNumber(const char* str, std::size_t len, bool* ok);

// Parses a part of a JavaScript string representation after the backslash
// character (i.e., an escape sequence without \) into an unescaped control
// character.
char* GetControlChar(v8::Isolate* isolate, const char* str,
                     std::size_t* res_len, std::size_t* size);

// Checks if a character is an octal digit.
inline bool IsOctalDigit(char character) {
  return character >= '0' && character <= '7';
}

// Parses a decimal number, either integer or float.
v8::Local<v8::Value> ParseDecimalNumber(v8::Isolate* isolate, const char* begin,
                                        const char* end, std::size_t* size);

// Parses an integer number in arbitrary base without prefixes.
v8::Local<v8::Value> ParseIntegerNumber(v8::Isolate* isolate, const char* begin,
                                        const char* end, std::size_t* size,
                                        int base, bool negate_result);

}  // namespace deserializer

}  // namespace jsrs

}  // namespace jstp

#endif  // JSRS_IMPL_H_
