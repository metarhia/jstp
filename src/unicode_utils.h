// Copyright (c) 2016-2017 JSTP project authors. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.

#ifndef SRC_UNICODE_UTILS_H_
#define SRC_UNICODE_UTILS_H_

#include <cstddef>

namespace jstp {

namespace unicode_utils {

// Returns true if `str` points to a valid Line Terminator Sequence code point,
// false otherwise. `size` will receive the number of bytes used by this
// code point (1, 2, 3).
bool IsLineTerminatorSequence(const char* str, std::size_t* size);

// Returns true if `str` points to a valid White space code point,
// false otherwise. `size` will receive the number of bytes used by this
// code point (1, 2, 3).
bool IsWhiteSpaceCharacter(const char* str, std::size_t* size);

// Encodes a Unicode code point in UTF-8 and writes it to `write_to`.
// `size` will receive the number of bytes used (1, 2, 3 or 4).
void CodePointToUtf8(unsigned int c, std::size_t* size, char* write_to);

}  // namespace unicode_utils

}  // namespace jstp

#endif  // SRC_UNICODE_UTILS_H_
