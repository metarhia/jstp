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

#include "jsrs.h"
#include "jsrs-impl.h"

#include <cctype>
#include <clocale>
#include <cstring>
#include <cstdlib>
#include <cstdio>

#include <vector>

namespace jstp {

namespace jsrs {

v8::Local<v8::String> Stringify(v8::Isolate* isolate,
    v8::Local<v8::Value> value) {
  if (value->IsFunction()) {
    return v8::Local<v8::String>();
  }
  if (value->IsNumber()    ||
      value->IsBoolean()   ||
      value->IsUndefined() ||
      value->IsNull()) {
    return value->ToString(isolate->GetCurrentContext()).ToLocalChecked();
  } else if (value->IsDate()) {
    return serializer::StringifyDate(isolate, value.As<v8::Date>());
  } else if (value->IsString()) {
    return serializer::StringifyString(isolate, value.As<v8::String>());
  } else if (value->IsArray()) {
    return serializer::StringifyArray(isolate, value.As<v8::Array>());
  } else if (value->IsObject()) {
    return serializer::StringifyObject(isolate, value.As<v8::Object>());
  } else {
    return v8::Local<v8::String>();
  }
}

namespace serializer {

v8::Local<v8::String> StringifyDate(v8::Isolate* isolate,
    v8::Local<v8::Date> date) {
  v8::Local<v8::Context> context = isolate->GetCurrentContext();
  v8::Local<v8::Value> toISOString = date->Get(context,
      v8::String::NewFromUtf8(isolate, "toISOString")).ToLocalChecked();
  v8::Local<v8::Value> result = toISOString.As<v8::Function>()->Call(context,
      date, 0, nullptr).ToLocalChecked();
  v8::Local<v8::String> quotes = v8::String::NewFromUtf8(isolate, "\'");
  v8::Local<v8::String> res_str = result->ToString();
  res_str = v8::String::Concat(quotes, v8::String::Concat(res_str, quotes));
  return res_str->ToString();
}

v8::Local<v8::String> StringifyArray(v8::Isolate* isolate,
    v8::Local<v8::Array> array) {
  v8::Local<v8::String> comma =
      v8::String::NewFromUtf8(isolate, ",");

  v8::Local<v8::String> result =
      v8::String::NewFromUtf8(isolate, "[");

  uint32_t length = array->Length();

  for (uint32_t index = 0; index < length; index++) {
    v8::Local<v8::Value> value = array->Get(index);
    if (!value->IsUndefined()) {
      v8::Local<v8::String> chunk = jstp::jsrs::Stringify(isolate, value);
      if (chunk.IsEmpty()) continue;
      result = v8::String::Concat(result, chunk);
    }
    if (index != length - 1) {
      result = v8::String::Concat(result, comma);
    }
  }

  result = v8::String::Concat(result,
      v8::String::NewFromUtf8(isolate, "]"));

  return result;
}

v8::Local<v8::String> StringifyString(v8::Isolate* isolate,
    v8::Local<v8::String> string) {
  uint32_t length = string->Length();
  std::vector<char> result_str;
  result_str.reserve((length + 1) * 2);
  result_str.push_back('\'');
  v8::String::Utf8Value utf8string(string);
  const char* c_string = *utf8string;
  for (uint32_t i = 0; i < length; i++) {
    std::size_t offset;
    const char* ch = GetEscapedControlChar(c_string[i], &offset);
    if (ch) {
      for (std::size_t k = 0; k < offset; k++) {
        result_str.push_back(ch[k]);
      }
    } else {
      result_str.push_back(c_string[i]);
    }
  }

  result_str.push_back('\'');

  return v8::String::NewFromUtf8(isolate, result_str.data(),
      v8::NewStringType::kNormal, result_str.size()).ToLocalChecked();
}

const char* GetEscapedControlChar(char str, std::size_t* size) {
  constexpr static const char* control_chars[0x20] = {
    "\\u0000", "\\u0001", "\\u0002",
    "\\u0003", "\\u0004", "\\u0005",
    "\\u0006", "\\u0007", "\\u0008",
    "\\u0009", "\\u000a", "\\u000b",
    "\\u000c", "\\u000d", "\\u000e",
    "\\u000f", "\\u0010", "\\u0011",
    "\\u0012", "\\u0013", "\\u0014",
    "\\u0015", "\\u0016", "\\u0017",
    "\\u0018", "\\u0019", "\\u001a",
    "\\u001b", "\\u001c", "\\u001d",
    "\\u001e", "\\u001f"
  };

  *size = 2;

  switch (str) {
    case '\b': return "\\b";
    case '\f': return "\\f";
    case '\n': return "\\n";
    case '\r': return "\\r";
    case '\t': return "\\t";
    case '\v': return "\\v";
    case '\\': return "\\\\";
    case '\'': return "\\'";
    case 0x7F: return "\\u007f";
    default:
      if (str < 0x20) {
        *size = 6;
        return control_chars[static_cast<std::size_t>(str)];
      } else {
        return nullptr;
      }
  }
}

v8::Local<v8::String> StringifyObject(v8::Isolate* isolate,
    v8::Local<v8::Object> object) {
  v8::Local<v8::String> comma = v8::String::NewFromUtf8(isolate, ",");
  v8::Local<v8::String> colon = v8::String::NewFromUtf8(isolate, ":");

  v8::Local<v8::String> result = v8::String::NewFromUtf8(isolate, "{");

  v8::Local<v8::Context> context = isolate->GetCurrentContext();

  v8::Local<v8::Array> keys = object->GetOwnPropertyNames(context)
                                      .ToLocalChecked();
  v8::Local<v8::String> chunk;
  bool first_defined = true;
  for (uint32_t i = 0; i < keys->Length(); i++) {
    v8::Local<v8::Value> key = keys->Get(context, i).ToLocalChecked();
    v8::Local<v8::Value> value = object->Get(context, key).ToLocalChecked();
    chunk = jstp::jsrs::Stringify(isolate, value);
    if (!value->IsUndefined() && !chunk.IsEmpty()) {
      if (i != 0 && first_defined) {
        result = v8::String::Concat(result, comma);
      }
      first_defined = true;
      result = v8::String::Concat(result,
          StringifyKey(isolate, key->ToString()));
      result = v8::String::Concat(result, colon);
      result = v8::String::Concat(result, chunk);
    } else {
      if (i == 0) first_defined = false;
    }
  }
  result = v8::String::Concat(result, v8::String::NewFromUtf8(isolate, "}"));
  return result;
}

v8::Local<v8::String> StringifyKey(v8::Isolate* isolate,
    v8::Local<v8::String> key) {
  v8::String::Utf8Value key_str(key.As<v8::Value>());
  if (!IsValidKey(isolate, key_str)) {
    return StringifyString(isolate, key);
  }
  return key;
}

bool IsValidKey(v8::Isolate* isolate, const v8::String::Utf8Value& key) {
  bool result = true;
  const char* key_str = *key;
  for (int i = 0; i < key.length(); i++) {
    if (key_str[i] == '_') continue;
    if ((i == 0 && !isalpha(key_str[i])) || !isalnum(key_str[i])) {
      result = false;
      break;
    }
  }
  return result;
}

}  // namespace serializer

v8::Local<v8::Value> Parse(v8::Isolate* isolate,
      const v8::String::Utf8Value& in) {
  std::size_t size;
  const char* to_parse = deserializer::PrepareString(isolate, *in, in.length(),
                                                     &size);
  if (!to_parse) {
    return v8::Undefined(isolate);
  }

  deserializer::Type type;
  if (!deserializer::GetType(to_parse, to_parse + size, &type)) {
    isolate->ThrowException(v8::Exception::TypeError(
        v8::String::NewFromUtf8(isolate, "Invalid type")));
    return v8::Undefined(isolate);
  }

  std::size_t parsed_size = 0;
  v8::Local<v8::Value> result =
      (deserializer::kParseFunctions[type])(isolate, to_parse,
                                            to_parse + size, &parsed_size);
  if (size != parsed_size) {
    isolate->ThrowException(v8::Exception::SyntaxError(
        v8::String::NewFromUtf8(isolate, "Invalid format")));
    return v8::Undefined(isolate);
  }

  delete []to_parse;
  return result;
}

v8::Local<v8::String> ParseNetworkPackets(v8::Isolate* isolate,
    const v8::String::Utf8Value& in, v8::Local<v8::Array> out) {
  std::size_t total_size = 0;
  std::size_t parsed_size = 0;
  const char* source = deserializer::PrepareString(isolate, *in, in.length(),
                                                   &total_size);
  const char* curr_chunk = source;
  int index = 0;

  while (parsed_size < total_size) {
    auto chunk_size = strlen(curr_chunk);
    parsed_size += chunk_size + 1;

    if (parsed_size <= total_size) {
      std::size_t parsed_chunk_size = 0;
      auto result = deserializer::ParseObject(isolate, curr_chunk,
          curr_chunk + chunk_size, &parsed_chunk_size);

      if (parsed_chunk_size != chunk_size) {
        delete []source;
        isolate->ThrowException(v8::Exception::SyntaxError(
            v8::String::NewFromUtf8(isolate, "Invalid format")));
        return v8::String::Empty(isolate);
      }

      out->Set(index++, result);
      curr_chunk += chunk_size + 1;
    }
  }

  auto rest = v8::String::NewFromUtf8(isolate, curr_chunk);
  delete []source;
  return rest;
}

namespace deserializer {

bool IsLineTerminatorSequence(const char* str, std::size_t* size) {
  if (str[0] == '\x0D' && str[1] == '\x0A') {
    *size = 2;
    return true;
  } else if (str[0] == '\x0D' || str[0] == '\x0A') {
    *size = 1;
    return true;
  } else if (str[0] == '\xE2' &&
             str[1] == '\x80' &&
            (str[2] == '\xA8' ||
             str[2] == '\xA9')) {
    *size = 3;
    return true;
  }
  return false;
}

bool IsWhiteSpaceCharacter(const char* str, std::size_t* size) {
  if (str[0] == '\x09' ||
      str[0] == '\x0B' ||
      str[0] == '\x0C' ||
      str[0] == '\x20' ||
      str[0] == '\xA0') {
    *size = 1;
    return true;
  } else if (str[0] == '\xC2' && str[1] == '\xA0') {
    *size = 2;
    return true;
  } else {
    bool is_multibyte_space = false;
    switch (str[0]) {
      case '\xE1':
        if (str[1] == '\xBB' && str[2] == '\xBF') {
          is_multibyte_space = true;
        }
        break;
      case '\xE2':
        if ((str[1] == '\x80' &&
              ((static_cast<unsigned char>(str[2]) & 0x7F) <= 0xA ||
                                           str[2] == '\xAF'))      ||
            (str[1] == '\x81' && str[2] == '\x9F')) {
          is_multibyte_space = true;
        }
        break;
      case '\xE3':
        if (str[1] == '\x80' && str[2] == '\x80') {
          is_multibyte_space = true;
        }
        break;
      case '\xEF':
        if (str[1] == '\xBB' && str[2] == '\xBF') {
          is_multibyte_space = true;
        }
        break;
    }
    if (is_multibyte_space) {
      *size = 3;
      return true;
    }
  }
  return false;
}

const char* PrepareString(v8::Isolate* isolate, const char* str,
    std::size_t length, std::size_t* new_length) {
  char* result = new char[length + 1];
  bool string_mode = false;
  enum { kDisabled = 0, kOneline, kMultiline } comment_mode = kDisabled;
  std::size_t j = 0;
  std::size_t size = 0;

  for (std::size_t i = 0; i < length; i++) {
    if ((comment_mode == kDisabled) &&
        (str[i] == '\"' || str[i] == '\'') &&
        (i == 0 || str[i - 1] != '\\')) {
      string_mode = !string_mode;
    }

    if (!string_mode) {
      if (comment_mode == kDisabled && str[i] == '/') {
        switch (str[i + 1]) {
          case '/':
            comment_mode = kOneline;
            break;
          case '*':
            comment_mode = kMultiline;
            break;
        }
      }

      if (comment_mode == kDisabled) {
        if (IsWhiteSpaceCharacter(str + i, &size) ||
            IsLineTerminatorSequence(str + i, &size)) {
          i += size - 1;
        } else {
          result[j++] = str[i];
        }
      }

      if ((comment_mode == kOneline && IsLineTerminatorSequence(str + i, &size))
      ||  (comment_mode == kMultiline && str[i - 1] == '*' && str[i] == '/')) {
        comment_mode = kDisabled;
      }
    } else if (str[i] == '\\' && IsLineTerminatorSequence(str + i + 1, &size)) {
      i += size;
    } else if (IsLineTerminatorSequence(str + i, &size)) {
      isolate->ThrowException(v8::Exception::SyntaxError(
          v8::String::NewFromUtf8(isolate, "Unexpected line end in string")));
      delete []result;
      return nullptr;
    } else {
      result[j++] = str[i];
    }
  }

  result[j] = '\0';
  *new_length = j;

  return result;
}

v8::Local<v8::Value> ParseUndefined(v8::Isolate* isolate, const char* begin,
                                    const char* end, std::size_t* size) {
  if (*begin == ',' || *begin == ']') {
    *size = 0;
  } else if (*begin == 'u') {
    *size = 9;
  } else {
    isolate->ThrowException(v8::Exception::TypeError(
        v8::String::NewFromUtf8(isolate, "Invalid format of undefined value")));
  }
  return v8::Undefined(isolate);
}

v8::Local<v8::Value> ParseNull(v8::Isolate* isolate, const char* begin,
                               const char* end, std::size_t* size) {
  *size = 4;
  return v8::Null(isolate);
}

v8::Local<v8::Value> ParseBool(v8::Isolate* isolate, const char* begin,
                               const char* end, std::size_t* size) {
  v8::Local<v8::Value> result;
  if (begin + 4 <= end && strncmp(begin, "true", 4) == 0) {
    result = v8::True(isolate);
    *size = 4;
  } else if (begin + 5 <= end && strncmp(begin, "false", 5) == 0) {
    result = v8::False(isolate);
    *size = 5;
  } else {
    isolate->ThrowException(v8::Exception::TypeError(
        v8::String::NewFromUtf8(isolate,
            "Invalid format: expected boolean")));
    result = v8::Undefined(isolate);
  }
  return result;
}

v8::Local<v8::Value> ParseNumber(v8::Isolate* isolate, const char* begin,
                                 const char* end, std::size_t* size) {
  bool negate_result = false;
  const char* number_start = begin;

  if (*begin == '+' || *begin == '-') {
    negate_result = *begin == '-';
    number_start++;
  }

  int base = 10;

  if (*number_start == '0') {
    number_start++;

    if (IsOctalDigit(*number_start)) {
      return isolate->ThrowException(v8::Exception::SyntaxError(
          v8::String::NewFromUtf8(isolate, "Use new octal literal syntax")));
    } else if (*number_start == 'b') {
      base = 2;
      number_start++;
    } else if (*number_start == 'o') {
      base = 8;
      number_start++;
    } else if (*number_start == 'x') {
      base = 16;
      number_start++;
    } else {
      number_start--;
    }
  }

  if (base == 10) {
    return ParseDecimalNumber(isolate, begin, end, size);
  } else {
    auto value = ParseIntegerNumber(isolate, number_start, end, size,
                                    base, negate_result);
    std::size_t offset = static_cast<std::size_t>(number_start - begin);
    *size += offset;
    return value;
  }
}

v8::Local<v8::Value> ParseDecimalNumber(v8::Isolate* isolate, const char* begin,
                                        const char* end, std::size_t* size) {
  v8::Local<v8::Number> result = v8::Number::New(isolate, std::atof(begin));
  *size = end - begin;
  std::size_t i = 0;
  while (begin[i] != ',' && begin[i] != '}' && begin[i] != ']' &&
         i < *size) i++;
  *size = i;
  return result;
}

v8::Local<v8::Value> ParseIntegerNumber(v8::Isolate* isolate, const char* begin,
                                        const char* end, std::size_t* size,
                                        int base, bool negate_result) {
  char* number_end;
  int32_t value = std::strtol(begin, &number_end, base);
  if (negate_result) {
    value = -value;
  }

  *size = static_cast<std::size_t>(number_end - begin);

  return v8::Integer::New(isolate, value);
}

v8::Local<v8::Value> ParseString(v8::Isolate* isolate, const char* begin,
                                 const char* end, std::size_t* size) {
  *size = end - begin;
  char* result = new char[*size + 1];
  std::memset(result, 0, *size + 1);
  enum { kApostrophe = 0, kQMarks} string_mode =
       (*begin == '\'') ? kApostrophe : kQMarks;
  bool is_ended = false;
  std::size_t res_index = 0;
  std::size_t out_offset, in_offset;
  for (std::size_t i = 1; i < *size; i++) {
    if ((string_mode == kQMarks && begin[i] == '\"') ||
        (string_mode == kApostrophe && begin[i] == '\'')) {
      is_ended = true;
      *size = i + 1;
      result[res_index] = '\0';
      break;
    }
    if (begin[i] == '\\') {
      char* symb = GetControlChar(isolate, begin + ++i, &out_offset,
          &in_offset);
      if (!symb) {
        return v8::String::Empty(isolate);
      }
      std::strncpy(result + res_index, symb, out_offset);
      delete []symb;
      i += in_offset - 1;
      res_index += out_offset;
    } else {
      result[res_index++] = begin[i];
    }
  }
  if (!is_ended) {
    isolate->ThrowException(v8::Exception::SyntaxError(
        v8::String::NewFromUtf8(isolate, "Error while parsing string")));
    return v8::String::Empty(isolate);
  }
  v8::Local<v8::String> result_str = v8::String::NewFromUtf8(isolate, result,
      v8::NewStringType::kNormal, res_index).ToLocalChecked();
  delete []result;
  return result_str;
}

char* CodePointsToUtf8(unsigned int c, std::size_t* size) {
  char* result = new char[4];
  char* b = result;
  if (c < 0x80) {
    *b++ = c;
    *size = 1;
  } else if (c < 0x800) {
    *b++ = 192 + c / 64;
    *b++ = 128 + c % 64;
    *size = 2;
  } else if (c - 0xd800u < 0x800) {
    delete []result;
    return CodePointsToUtf8(0xFFFD, size);
  } else if (c < 0x10000) {
     *b++ = 224 + c / 4096;
     *b++ = 128 + c / 64 % 64;
     *b++ = 128 + c % 64;
     *size = 3;
  } else if (c < 0x110000) {
     *b++ = 240 + c / 262144;
     *b++ = 128 + c / 4096 % 64;
     *b++ = 128 + c / 64 % 64;
     *b++ = 128 + c % 64;
     *size = 4;
  } else {
    delete []result;
    return CodePointsToUtf8(0xFFFD, size);
  }
  return result;
}

unsigned int ReadHexNumber(const char* str, int len, bool* ok) {
  char t[5];
  char* end;
  std::strncpy(t, str, len);
  t[len] = '\0';
  unsigned int result = std::strtol(t, &end, 16);
  if (end - t != len) {
    *ok = false;
  } else {
    *ok = true;
  }
  return result;
}

char* GetControlChar(v8::Isolate* isolate, const char* str,
                     std::size_t* res_len, std::size_t* size) {
  char* result = new char[5];
  *size = 1;
  *res_len = 1;
  bool ok;
  switch (str[0]) {
    case 'b': *result = '\b'; break;
    case 'f': *result = '\f'; break;
    case 'n': *result = '\n'; break;
    case 'r': *result = '\r'; break;
    case 't': *result = '\t'; break;
    case 'v': *result = '\v'; break;
    case '0': *result = '\0'; break;
    case 'x': {
      *result = ReadHexNumber(str + 1, 2, &ok);
      if (!ok) {
        delete []result;
        isolate->ThrowException(v8::Exception::SyntaxError(
            v8::String::NewFromUtf8(isolate,
                "Invalid hexadecimal escape sequence")));
        return nullptr;
      }
      *size = 3;
      break;
    }
    case 'u': {
      unsigned int symb_code;
      if (isxdigit(str[1])) {
        symb_code = ReadHexNumber(str + 1, 4, &ok);
        *size = 5;
      } else if (str[1] == '{') {
        std::size_t hex_size;  // maximal hex is 10FFFF
        for (hex_size = 1; str[hex_size + 2] != '}' && hex_size <= 6;
            hex_size++) continue;
        symb_code = ReadHexNumber(str + 2, hex_size, &ok);
        *size = hex_size + 3;
      } else {
        ok = false;
      }
      if (!ok) {
        delete []result;
        isolate->ThrowException(v8::Exception::SyntaxError(
            v8::String::NewFromUtf8(isolate,
                "Invalid Unicode escape sequence")));
        return nullptr;
      }
      char* unicode_symbol = CodePointsToUtf8(symb_code, res_len);
      delete []result;
      return unicode_symbol;
    }
    default:
      *result = str[0];
  }

  return result;
}

v8::Local<v8::String> ParseKeyInObject(v8::Isolate* isolate, const char* begin,
                                       const char* end, std::size_t* size) {
  *size = end - begin;
  v8::Local<v8::String> result;
  if (begin[0] == '\'' || begin[0] == '"') {
    Type current_type;
    bool valid = GetType(begin, end, &current_type);
    if (valid && current_type == Type::kString) {
      std::size_t offset;
      result = ParseString(isolate, begin, end,
          &offset).As<v8::String>();
      *size = offset;
      return result;
    } else {
      isolate->ThrowException(v8::Exception::SyntaxError(
          v8::String::NewFromUtf8(isolate,
              "Invalid format in object: key is invalid string")));
      return v8::Local<v8::String>();
    }
  } else {
    std::size_t current_length = 0;
    for (std::size_t i = 0; i < *size; i++) {
      if (begin[i] == ':') {
        if (current_length != 0) {
          result = v8::String::NewFromUtf8(isolate, begin,
                                           v8::NewStringType::kInternalized,
                                           current_length).ToLocalChecked();
          break;
        } else {
          isolate->ThrowException(v8::Exception::SyntaxError(
              v8::String::NewFromUtf8(isolate,
                  "Unexpected token :")));
          return v8::Local<v8::String>();
        }
      } else if (begin[i] == '_' ||
                (i != 0 ? isalnum(begin[i]) : isalpha(begin[i]))) {
        current_length++;
      } else {
        isolate->ThrowException(v8::Exception::SyntaxError(
            v8::String::NewFromUtf8(isolate,
                "Invalid format in object: key has invalid type")));
        return v8::Local<v8::String>();
      }
    }
    *size = current_length;
    return result;
  }
}

v8::Local<v8::Value> ParseValueInObject(v8::Isolate* isolate, const char* begin,
                                        const char* end, std::size_t* size) {
  v8::Local<v8::Value> value;
  Type current_type;
  bool valid = GetType(begin, end, &current_type);
  if (valid) {
    value = (kParseFunctions[current_type])(isolate, begin, end, size);
    return value;
  } else {
    isolate->ThrowException(v8::Exception::TypeError(
        v8::String::NewFromUtf8(isolate, "Invalid type in object")));
    return v8::Object::New(isolate);
  }
}

v8::Local<v8::Value> ParseObject(v8::Isolate* isolate, const char* begin,
                                 const char* end, std::size_t* size) {
  bool key_mode = true;
  *size = end - begin;
  v8::Local<v8::String> current_key;
  v8::Local<v8::Value> current_value;
  std::size_t current_length = 0;
  v8::Local<v8::Object> result = v8::Object::New(isolate);

  for (std::size_t i = 1; i < *size; i++) {
    if (key_mode) {
      if (begin[i] == '}') {
        if (begin[i - 1] != ',') {  // In case of empty object
          *size = 2;
        } else {                    // In case of trailing comma
          *size = i + 1;
        }
        break;
      }
      current_key = ParseKeyInObject(isolate, begin + i, end,
                                     &current_length);
      i += current_length;
    } else {
      current_value = ParseValueInObject(isolate, begin + i, end,
                                         &current_length);
      if (!current_value->IsUndefined()) {
        v8::Maybe<bool> is_ok = result->Set(isolate->GetCurrentContext(),
            current_key, current_value);
        if (is_ok.IsNothing()) {
          isolate->ThrowException(
              v8::Exception::Error(v8::String::NewFromUtf8(isolate,
                  "Cannot add property to object")));
        }
      }
      i += current_length;
      if (begin[i] != ',' && begin[i] != '}') {
        isolate->ThrowException(v8::Exception::SyntaxError(
            v8::String::NewFromUtf8(isolate,
                "Invalid format in object")));
        return v8::Object::New(isolate);
      } else if (begin[i] == '}') {
        *size = i + 1;
        break;
      }
    }
    key_mode = !key_mode;
  }
  return result;
}

bool GetType(const char* begin, const char* end, Type* type) {
  bool result = true;
  switch (*begin) {
    case ',':
    case ']':
      *type = Type::kUndefined;
      break;
    case '{':
      *type = Type::kObject;
      break;
    case '[':
      *type = Type::kArray;
      break;
    case '\"':
    case '\'':
      *type = Type::kString;
      break;
    case 't':
    case 'f':
      *type = Type::kBool;
      break;
    case 'n':
      *type = Type::kNull;
      if (begin + 4 <= end) {
        result = (std::strncmp(begin, "null", 4) == 0);
      }
      break;
    case 'u':
      *type = Type::kUndefined;
      if (begin + 9 <= end) {
        result = (std::strncmp(begin, "undefined", 9) == 0);
      }
      break;
    default:
      result = false;
      if (isdigit(*begin) || *begin == '.' || *begin == '+' || *begin == '-') {
        *type = Type::kNumber;
        result = true;
      }
  }
  return result;
}

v8::Local<v8::Value> ParseArray(v8::Isolate* isolate, const char* begin,
                                const char* end, std::size_t* size) {
  Type current_type;
  v8::Local<v8::Array> array = v8::Array::New(isolate);
  std::size_t current_length = 0;
  *size = end - begin;
  if (*begin == '[' && *(begin + 1) == ']') {  // In case of empty array
    *size = 2;
    return array;
  }
  v8::Local<v8::Value> t;
  std::size_t current_element = 0;
  for (std::size_t i = 1; i < *size; i++) {
    bool valid = GetType(begin + i, end, &current_type);
    if (valid) {
      t = kParseFunctions[current_type](isolate,
          begin + i, end, &current_length);
      if (!(current_type == Type::kUndefined &&
            begin[i] == ']')) {
        array->Set(current_element++, t);
      }
      i += current_length;

      current_length = 0;
      if (begin[i] != ',' && begin[i] != ']') {
        isolate->ThrowException(v8::Exception::SyntaxError(
            v8::String::NewFromUtf8(isolate,
                "Invalid format in array: missed comma")));
        return v8::Array::New(isolate);
      } else if (begin[i] == ']') {
        *size = i + 1;
        break;
      }
    } else {
      isolate->ThrowException(v8::Exception::TypeError(
          v8::String::NewFromUtf8(isolate, "Invalid type in array")));
      return v8::Array::New(isolate);
    }
  }

  return array;
}

}  // namespace deserializer

namespace bindings {

void Stringify(const v8::FunctionCallbackInfo<v8::Value>& args) {
  v8::Isolate* isolate = args.GetIsolate();

  if (args.Length() != 1) {
    isolate->ThrowException(v8::Exception::TypeError(
        v8::String::NewFromUtf8(isolate, "Wrong number of arguments")));
    return;
  }

  v8::HandleScope scope(isolate);

  v8::Local<v8::String> result = jstp::jsrs::Stringify(isolate, args[0]);
  args.GetReturnValue().Set(result);
}

void Parse(const v8::FunctionCallbackInfo<v8::Value>& args) {
  v8::Isolate* isolate = args.GetIsolate();

  if (args.Length() != 1) {
    isolate->ThrowException(v8::Exception::TypeError(
        v8::String::NewFromUtf8(isolate, "Wrong number of arguments")));
    return;
  }
  if (!args[0]->IsString() && !args[0]->IsUint8Array()) {
    isolate->ThrowException(v8::Exception::TypeError(
        v8::String::NewFromUtf8(isolate, "Wrong argument type")));
    return;
  }

  v8::HandleScope scope(isolate);

  v8::String::Utf8Value str(args[0]->ToString());

  v8::Local<v8::Value> result = jstp::jsrs::Parse(isolate, str);
  args.GetReturnValue().Set(result);
}

void ParseNetworkPackets(const v8::FunctionCallbackInfo<v8::Value>& args) {
  v8::Isolate* isolate = args.GetIsolate();

  if (args.Length() != 2) {
    isolate->ThrowException(v8::Exception::TypeError(
        v8::String::NewFromUtf8(isolate, "Wrong number of arguments")));
    return;
  }

  if (!args[0]->IsString() || !args[1]->IsArray()) {
    isolate->ThrowException(v8::Exception::TypeError(
        v8::String::NewFromUtf8(isolate, "Wrong argument type")));
    return;
  }

  v8::HandleScope scope(isolate);

  v8::String::Utf8Value str(args[0]->ToString());
  auto array = v8::Local<v8::Array>::Cast(args[1]);
  auto result = jstp::jsrs::ParseNetworkPackets(isolate, str, array);

  args.GetReturnValue().Set(result);
}

void Init(v8::Local<v8::Object> target) {
  NODE_SET_METHOD(target, "stringify", Stringify);
  NODE_SET_METHOD(target, "parse", Parse);
  NODE_SET_METHOD(target, "parseNetworkPackets", ParseNetworkPackets);
}

NODE_MODULE(jsrs, Init);

}  // namespace bindings

}  // namespace jsrs

}  // namespace jstp
