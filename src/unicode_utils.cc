// Copyright (c) 2016-2017 JSTP project authors. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.

#include "unicode_utils.h"

#include <cstddef>

using std::size_t;

namespace jstp {

namespace unicode_utils {

bool IsLineTerminatorSequence(const char* str, size_t* size) {
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

bool IsWhiteSpaceCharacter(const char* str, size_t* size) {
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
                                         str[2] == '\xAF'))     ||
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

char* CodePointToUtf8(unsigned int c, size_t* size) {
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
    delete[] result;
    return CodePointToUtf8(0xFFFD, size);
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
    delete[] result;
    return CodePointToUtf8(0xFFFD, size);
  }
  return result;
}

}  // namespace unicode_utils

}  // namespace jstp
