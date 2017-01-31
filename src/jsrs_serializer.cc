// Copyright (c) 2016-2017 JSTP project authors. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.

#include "jsrs_serializer.h"
#include <cstddef>
#include <vector>
#include <v8.h>

using std::size_t;

using v8::Array;
using v8::Context;
using v8::Date;
using v8::Function;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::NewStringType;
using v8::String;
using v8::Value;

namespace jstp {

namespace serializer {

Local<String> Stringify(Isolate* isolate, Local<Value> value) {
  if (value->IsFunction()) {
    return Local<String>();
  }
  if (value->IsNumber()    ||
      value->IsBoolean()   ||
      value->IsUndefined() ||
      value->IsNull()) {
    return value->ToString(isolate->GetCurrentContext()).ToLocalChecked();
  } else if (value->IsDate()) {
    return StringifyDate(isolate, value.As<Date>());
  } else if (value->IsString()) {
    return StringifyString(isolate, value.As<String>());
  } else if (value->IsArray()) {
    return StringifyArray(isolate, value.As<Array>());
  } else if (value->IsObject()) {
    return StringifyObject(isolate, value.As<Object>());
  } else {
    return Local<String>();
  }
}

Local<String> StringifyDate(Isolate* isolate, Local<Date> date) {
  auto context = isolate->GetCurrentContext();
  auto toISOString = date->Get(context,
      String::NewFromUtf8(isolate, "toISOString")).ToLocalChecked();
  auto result = toISOString.As<Function>()->Call(context,
      date, 0, nullptr).ToLocalChecked();
  auto quotes = String::NewFromUtf8(isolate, "\'");
  auto res_str = result->ToString();
  res_str = String::Concat(quotes, String::Concat(res_str, quotes));
  return res_str->ToString();
}

Local<String> StringifyArray(Isolate* isolate, Local<Array> array) {
  auto comma = String::NewFromUtf8(isolate, ",");
  auto result = String::NewFromUtf8(isolate, "[");
  uint32_t length = array->Length();

  for (uint32_t index = 0; index < length; index++) {
    auto value = array->Get(index);
    if (!value->IsUndefined()) {
      auto chunk = Stringify(isolate, value);
      if (chunk.IsEmpty()) continue;
      result = String::Concat(result, chunk);
    }
    if (index != length - 1) {
      result = String::Concat(result, comma);
    }
  }

  result = String::Concat(result, String::NewFromUtf8(isolate, "]"));
  return result;
}

static const char* GetEscapedControlChar(char str, size_t* size);

Local<String> StringifyString(Isolate* isolate, Local<String> string) {
  uint32_t length = string->Length();

  std::vector<char> result_str;
  result_str.reserve((length + 1) * 2);
  result_str.push_back('\'');

  String::Utf8Value utf8string(string);
  const char* c_string = *utf8string;

  for (uint32_t i = 0; i < length; i++) {
    size_t offset;
    const char* ch = GetEscapedControlChar(c_string[i], &offset);
    if (ch) {
      for (size_t k = 0; k < offset; k++) {
        result_str.push_back(ch[k]);
      }
    } else {
      result_str.push_back(c_string[i]);
    }
  }

  result_str.push_back('\'');

  return String::NewFromUtf8(isolate, result_str.data(),
      NewStringType::kNormal,
      static_cast<int>(result_str.size())).ToLocalChecked();
}

// Returns a string representing an escaped control character.
// If the given character is not a control one, returns nullptr.
// The `size` is being incremented by the length of the resulting
// string, but always at least by two, even when the function
// returns nullptr.
static const char* GetEscapedControlChar(char str, size_t* size) {
  static const char* control_chars[0x20] = {
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
        return control_chars[static_cast<size_t>(str)];
      } else {
        return nullptr;
      }
  }
}

Local<String> StringifyObject(Isolate* isolate, Local<Object> object) {
  auto comma = String::NewFromUtf8(isolate, ",");
  auto colon = String::NewFromUtf8(isolate, ":");
  auto result = String::NewFromUtf8(isolate, "{");
  auto context = isolate->GetCurrentContext();
  auto keys = object->GetOwnPropertyNames(context).ToLocalChecked();

  bool first_defined = true;
  for (uint32_t i = 0; i < keys->Length(); i++) {
    auto key = keys->Get(context, i).ToLocalChecked();
    auto value = object->Get(context, key).ToLocalChecked();
    auto chunk = Stringify(isolate, value);
    if (!value->IsUndefined() && !chunk.IsEmpty()) {
      if (i != 0 && first_defined) {
        result = String::Concat(result, comma);
      }
      first_defined = true;
      result = String::Concat(result,
          StringifyKey(isolate, key->ToString()));
      result = String::Concat(result, colon);
      result = String::Concat(result, chunk);
    } else {
      if (i == 0) first_defined = false;
    }
  }

  result = String::Concat(result, String::NewFromUtf8(isolate, "}"));
  return result;
}

static bool IsValidKey(Isolate* isolate, const String::Utf8Value& key);

Local<String> StringifyKey(Isolate* isolate, Local<String> key) {
  String::Utf8Value key_str(key.As<Value>());
  if (!IsValidKey(isolate, key_str)) {
    return StringifyString(isolate, key);
  }
  return key;
}

// Checks if a string can be a non-quoted object key.
static bool IsValidKey(Isolate* isolate, const String::Utf8Value& key) {
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

}  // namespace jstp
