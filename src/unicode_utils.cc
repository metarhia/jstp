// Copyright (c) 2016-2017 JSTP project authors. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.

#include "unicode_utils.h"

#include <cstddef>
#include <cstdint>

#ifdef _JSTP_USE_FULL_TABLES_
#include "unicode_tables.h"
#else
#include "unicode_range_tables.h"
#endif

using std::size_t;
using std::uint32_t;

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
      case '\xE1': {
        if (str[1] == '\xBB' && str[2] == '\xBF') {
          is_multibyte_space = true;
        }
        break;
      }
      case '\xE2': {
        if ((str[1] == '\x80' &&
            ((static_cast<unsigned char>(str[2]) & 0x7F) <= 0xA ||
                                         str[2] == '\xAF'))     ||
            (str[1] == '\x81' && str[2] == '\x9F')) {
          is_multibyte_space = true;
        }
        break;
      }
      case '\xE3': {
        if (str[1] == '\x80' && str[2] == '\x80') {
          is_multibyte_space = true;
        }
        break;
      }
      case '\xEF': {
        if (str[1] == '\xBB' && str[2] == '\xBF') {
          is_multibyte_space = true;
        }
        break;
      }
    }
    if (is_multibyte_space) {
      *size = 3;
      return true;
    }
  }
  return false;
}

void CodePointToUtf8(unsigned int c, size_t* size, char* write_to) {
  char* b = write_to;
  if (c < 0x80) {
    *b++ = c;
    *size = 1;
  } else if (c < 0x800) {
    *b++ = 192 + c / 64;
    *b++ = 128 + c % 64;
    *size = 2;
  } else if (c - 0xd800u < 0x800) {
    CodePointToUtf8(0xFFFD, size, write_to);
    return;
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
    CodePointToUtf8(0xFFFD, size, write_to);
    return;
  }
}

uint32_t Utf8ToCodePoint(const char* begin, size_t* size) {
  auto str = reinterpret_cast<const unsigned char*>(begin);
  uint32_t result = 0;
  *size = 1;
  if (*str < 0x80) {
    return *str;
  } else if ((*str & 0xE0) == 0xC0) {
    *size = 2;
    result += (*str & 0x1F) << 6;
  } else if ((*str & 0xF0) == 0xE0) {
    *size = 3;
    result += (*str & 0x0F) << 12;
  } else if ((*str & 0xF8) == 0xF0) {
    *size = 4;
    result += (*str & 0x07) << 18;
  } else {
    return 0xFFFD;
  }
  for (size_t i = 2; i <= *size; i++) {
    str++;
    if ((*str & 0xC0) != 0x80) {
      *size = i;
      return 0xFFFD;
    }
    result += (*str & 0x3F) << ((*size - i) * 6);
  }
  return result;
}

#ifdef _JSTP_USE_FULL_TABLES_

bool IsIdStartCodePoint(uint32_t cp) {
  return ID_START_FULL[cp];
}

bool IsIdPartCodePoint(uint32_t cp) {
  return ID_CONTINUE_FULL[cp];
}

#undef _JSTP_USE_FULL_TABLES_
#else

bool search_cp(uint32_t cp, const unicode_range* ranges, size_t size) {
  size_t low = 0;
  size_t high = size;
  while (high > low) {
    size_t mid = low + (high - low) / 2;
    unicode_range range = ranges[mid];
    if (range.start <= cp && cp <= range.end) {
      return true;
    }
    if (cp < range.start) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }
  return false;
}

bool IsIdStartCodePoint(uint32_t cp) {
  if (('a' <= cp && cp <= 'z') ||
      ('A' <= cp && cp <= 'Z') ||
      cp == '_' ||
      cp == '$') {
    return true;
  }
  return search_cp(cp, ID_START_RANGES, ID_START_RANGES_COUNT);
}

bool IsIdPartCodePoint(uint32_t cp) {
  if (('a' <= cp && cp <= 'z') ||
      ('A' <= cp && cp <= 'Z') ||
      ('0' <= cp && cp <= '9') ||
      cp == '_' ||
      cp == '$') {
    return true;
  }
  return search_cp(cp, ID_CONTINUE_RANGES, ID_CONTINUE_RANGES_COUNT) ||
                   cp == 0x200C || cp == 0x200D; // ZWNJ, ZWJ
}

#endif


}  // namespace unicode_utils

}  // namespace jstp
