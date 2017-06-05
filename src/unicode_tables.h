// Copyright (c) 2017 JSTP project authors. Use of this source code is
// governed by the MIT license that can be found in the LICENSE file.
//
//
// This file contains data derived from the Unicode Data Files.
// The following license applies to this data:
//
// COPYRIGHT AND PERMISSION NOTICE
//
// Copyright © 1991-2017 Unicode, Inc. All rights reserved.
// Distributed under the Terms of Use in http://www.unicode.org/copyright.html.
//
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of the Unicode data files and any associated documentation
// (the "Data Files") or Unicode software and any associated documentation
// (the "Software") to deal in the Data Files or Software
// without restriction, including without limitation the rights to use,
// copy, modify, merge, publish, distribute, and/or sell copies of
// the Data Files or Software, and to permit persons to whom the Data Files
// or Software are furnished to do so, provided that either
// (a) this copyright and permission notice appear with all copies
// of the Data Files or Software, or
// (b) this copyright and permission notice appear in associated
// Documentation.
//
// THE DATA FILES AND SOFTWARE ARE PROVIDED "AS IS", WITHOUT WARRANTY OF
// ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
// WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT OF THIRD PARTY RIGHTS.
// IN NO EVENT SHALL THE COPYRIGHT HOLDER OR HOLDERS INCLUDED IN THIS
// NOTICE BE LIABLE FOR ANY CLAIM, OR ANY SPECIAL INDIRECT OR CONSEQUENTIAL
// DAMAGES, OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE,
// DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER
// TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
// PERFORMANCE OF THE DATA FILES OR SOFTWARE.
//
// Except as contained in this notice, the name of a copyright holder
// shall not be used in advertising or otherwise to promote the sale,
// use or other dealings in these Data Files or Software without prior
// written authorization of the copyright holder.
//
//
// This file is automatically generated by tools/make-unicode-tables.js.
// Unicode version 9.0.0.
//
// Do not edit this file manually!

#ifndef SRC_UNICODE_TABLES_H_
#define SRC_UNICODE_TABLES_H_

#include <cstddef>
#include <cstdint>

using std::size_t;
using std::uint32_t;

typedef struct {
  uint32_t start;
  uint32_t end;
} unicode_range;

const unicode_range ID_START_RANGES[] = {
  {0x41, 0x5a}, {0x61, 0x7a}, {0xaa, 0xaa},
  {0xb5, 0xb5}, {0xba, 0xba}, {0xc0, 0xd6},
  {0xd8, 0xf6}, {0xf8, 0x1ba}, {0x1bb, 0x1bb},
  {0x1bc, 0x1bf}, {0x1c0, 0x1c3}, {0x1c4, 0x293},
  {0x294, 0x294}, {0x295, 0x2af}, {0x2b0, 0x2c1},
  {0x2c6, 0x2d1}, {0x2e0, 0x2e4}, {0x2ec, 0x2ec},
  {0x2ee, 0x2ee}, {0x370, 0x373}, {0x374, 0x374},
  {0x376, 0x377}, {0x37a, 0x37a}, {0x37b, 0x37d},
  {0x37f, 0x37f}, {0x386, 0x386}, {0x388, 0x38a},
  {0x38c, 0x38c}, {0x38e, 0x3a1}, {0x3a3, 0x3f5},
  {0x3f7, 0x481}, {0x48a, 0x52f}, {0x531, 0x556},
  {0x559, 0x559}, {0x561, 0x587}, {0x5d0, 0x5ea},
  {0x5f0, 0x5f2}, {0x620, 0x63f}, {0x640, 0x640},
  {0x641, 0x64a}, {0x66e, 0x66f}, {0x671, 0x6d3},
  {0x6d5, 0x6d5}, {0x6e5, 0x6e6}, {0x6ee, 0x6ef},
  {0x6fa, 0x6fc}, {0x6ff, 0x6ff}, {0x710, 0x710},
  {0x712, 0x72f}, {0x74d, 0x7a5}, {0x7b1, 0x7b1},
  {0x7ca, 0x7ea}, {0x7f4, 0x7f5}, {0x7fa, 0x7fa},
  {0x800, 0x815}, {0x81a, 0x81a}, {0x824, 0x824},
  {0x828, 0x828}, {0x840, 0x858}, {0x8a0, 0x8b4},
  {0x8b6, 0x8bd}, {0x904, 0x939}, {0x93d, 0x93d},
  {0x950, 0x950}, {0x958, 0x961}, {0x971, 0x971},
  {0x972, 0x980}, {0x985, 0x98c}, {0x98f, 0x990},
  {0x993, 0x9a8}, {0x9aa, 0x9b0}, {0x9b2, 0x9b2},
  {0x9b6, 0x9b9}, {0x9bd, 0x9bd}, {0x9ce, 0x9ce},
  {0x9dc, 0x9dd}, {0x9df, 0x9e1}, {0x9f0, 0x9f1},
  {0xa05, 0xa0a}, {0xa0f, 0xa10}, {0xa13, 0xa28},
  {0xa2a, 0xa30}, {0xa32, 0xa33}, {0xa35, 0xa36},
  {0xa38, 0xa39}, {0xa59, 0xa5c}, {0xa5e, 0xa5e},
  {0xa72, 0xa74}, {0xa85, 0xa8d}, {0xa8f, 0xa91},
  {0xa93, 0xaa8}, {0xaaa, 0xab0}, {0xab2, 0xab3},
  {0xab5, 0xab9}, {0xabd, 0xabd}, {0xad0, 0xad0},
  {0xae0, 0xae1}, {0xaf9, 0xaf9}, {0xb05, 0xb0c},
  {0xb0f, 0xb10}, {0xb13, 0xb28}, {0xb2a, 0xb30},
  {0xb32, 0xb33}, {0xb35, 0xb39}, {0xb3d, 0xb3d},
  {0xb5c, 0xb5d}, {0xb5f, 0xb61}, {0xb71, 0xb71},
  {0xb83, 0xb83}, {0xb85, 0xb8a}, {0xb8e, 0xb90},
  {0xb92, 0xb95}, {0xb99, 0xb9a}, {0xb9c, 0xb9c},
  {0xb9e, 0xb9f}, {0xba3, 0xba4}, {0xba8, 0xbaa},
  {0xbae, 0xbb9}, {0xbd0, 0xbd0}, {0xc05, 0xc0c},
  {0xc0e, 0xc10}, {0xc12, 0xc28}, {0xc2a, 0xc39},
  {0xc3d, 0xc3d}, {0xc58, 0xc5a}, {0xc60, 0xc61},
  {0xc80, 0xc80}, {0xc85, 0xc8c}, {0xc8e, 0xc90},
  {0xc92, 0xca8}, {0xcaa, 0xcb3}, {0xcb5, 0xcb9},
  {0xcbd, 0xcbd}, {0xcde, 0xcde}, {0xce0, 0xce1},
  {0xcf1, 0xcf2}, {0xd05, 0xd0c}, {0xd0e, 0xd10},
  {0xd12, 0xd3a}, {0xd3d, 0xd3d}, {0xd4e, 0xd4e},
  {0xd54, 0xd56}, {0xd5f, 0xd61}, {0xd7a, 0xd7f},
  {0xd85, 0xd96}, {0xd9a, 0xdb1}, {0xdb3, 0xdbb},
  {0xdbd, 0xdbd}, {0xdc0, 0xdc6}, {0xe01, 0xe30},
  {0xe32, 0xe33}, {0xe40, 0xe45}, {0xe46, 0xe46},
  {0xe81, 0xe82}, {0xe84, 0xe84}, {0xe87, 0xe88},
  {0xe8a, 0xe8a}, {0xe8d, 0xe8d}, {0xe94, 0xe97},
  {0xe99, 0xe9f}, {0xea1, 0xea3}, {0xea5, 0xea5},
  {0xea7, 0xea7}, {0xeaa, 0xeab}, {0xead, 0xeb0},
  {0xeb2, 0xeb3}, {0xebd, 0xebd}, {0xec0, 0xec4},
  {0xec6, 0xec6}, {0xedc, 0xedf}, {0xf00, 0xf00},
  {0xf40, 0xf47}, {0xf49, 0xf6c}, {0xf88, 0xf8c},
  {0x1000, 0x102a}, {0x103f, 0x103f}, {0x1050, 0x1055},
  {0x105a, 0x105d}, {0x1061, 0x1061}, {0x1065, 0x1066},
  {0x106e, 0x1070}, {0x1075, 0x1081}, {0x108e, 0x108e},
  {0x10a0, 0x10c5}, {0x10c7, 0x10c7}, {0x10cd, 0x10cd},
  {0x10d0, 0x10fa}, {0x10fc, 0x10fc}, {0x10fd, 0x1248},
  {0x124a, 0x124d}, {0x1250, 0x1256}, {0x1258, 0x1258},
  {0x125a, 0x125d}, {0x1260, 0x1288}, {0x128a, 0x128d},
  {0x1290, 0x12b0}, {0x12b2, 0x12b5}, {0x12b8, 0x12be},
  {0x12c0, 0x12c0}, {0x12c2, 0x12c5}, {0x12c8, 0x12d6},
  {0x12d8, 0x1310}, {0x1312, 0x1315}, {0x1318, 0x135a},
  {0x1380, 0x138f}, {0x13a0, 0x13f5}, {0x13f8, 0x13fd},
  {0x1401, 0x166c}, {0x166f, 0x167f}, {0x1681, 0x169a},
  {0x16a0, 0x16ea}, {0x16ee, 0x16f0}, {0x16f1, 0x16f8},
  {0x1700, 0x170c}, {0x170e, 0x1711}, {0x1720, 0x1731},
  {0x1740, 0x1751}, {0x1760, 0x176c}, {0x176e, 0x1770},
  {0x1780, 0x17b3}, {0x17d7, 0x17d7}, {0x17dc, 0x17dc},
  {0x1820, 0x1842}, {0x1843, 0x1843}, {0x1844, 0x1877},
  {0x1880, 0x1884}, {0x1885, 0x1886}, {0x1887, 0x18a8},
  {0x18aa, 0x18aa}, {0x18b0, 0x18f5}, {0x1900, 0x191e},
  {0x1950, 0x196d}, {0x1970, 0x1974}, {0x1980, 0x19ab},
  {0x19b0, 0x19c9}, {0x1a00, 0x1a16}, {0x1a20, 0x1a54},
  {0x1aa7, 0x1aa7}, {0x1b05, 0x1b33}, {0x1b45, 0x1b4b},
  {0x1b83, 0x1ba0}, {0x1bae, 0x1baf}, {0x1bba, 0x1be5},
  {0x1c00, 0x1c23}, {0x1c4d, 0x1c4f}, {0x1c5a, 0x1c77},
  {0x1c78, 0x1c7d}, {0x1c80, 0x1c88}, {0x1ce9, 0x1cec},
  {0x1cee, 0x1cf1}, {0x1cf5, 0x1cf6}, {0x1d00, 0x1d2b},
  {0x1d2c, 0x1d6a}, {0x1d6b, 0x1d77}, {0x1d78, 0x1d78},
  {0x1d79, 0x1d9a}, {0x1d9b, 0x1dbf}, {0x1e00, 0x1f15},
  {0x1f18, 0x1f1d}, {0x1f20, 0x1f45}, {0x1f48, 0x1f4d},
  {0x1f50, 0x1f57}, {0x1f59, 0x1f59}, {0x1f5b, 0x1f5b},
  {0x1f5d, 0x1f5d}, {0x1f5f, 0x1f7d}, {0x1f80, 0x1fb4},
  {0x1fb6, 0x1fbc}, {0x1fbe, 0x1fbe}, {0x1fc2, 0x1fc4},
  {0x1fc6, 0x1fcc}, {0x1fd0, 0x1fd3}, {0x1fd6, 0x1fdb},
  {0x1fe0, 0x1fec}, {0x1ff2, 0x1ff4}, {0x1ff6, 0x1ffc},
  {0x2071, 0x2071}, {0x207f, 0x207f}, {0x2090, 0x209c},
  {0x2102, 0x2102}, {0x2107, 0x2107}, {0x210a, 0x2113},
  {0x2115, 0x2115}, {0x2118, 0x2118}, {0x2119, 0x211d},
  {0x2124, 0x2124}, {0x2126, 0x2126}, {0x2128, 0x2128},
  {0x212a, 0x212d}, {0x212e, 0x212e}, {0x212f, 0x2134},
  {0x2135, 0x2138}, {0x2139, 0x2139}, {0x213c, 0x213f},
  {0x2145, 0x2149}, {0x214e, 0x214e}, {0x2160, 0x2182},
  {0x2183, 0x2184}, {0x2185, 0x2188}, {0x2c00, 0x2c2e},
  {0x2c30, 0x2c5e}, {0x2c60, 0x2c7b}, {0x2c7c, 0x2c7d},
  {0x2c7e, 0x2ce4}, {0x2ceb, 0x2cee}, {0x2cf2, 0x2cf3},
  {0x2d00, 0x2d25}, {0x2d27, 0x2d27}, {0x2d2d, 0x2d2d},
  {0x2d30, 0x2d67}, {0x2d6f, 0x2d6f}, {0x2d80, 0x2d96},
  {0x2da0, 0x2da6}, {0x2da8, 0x2dae}, {0x2db0, 0x2db6},
  {0x2db8, 0x2dbe}, {0x2dc0, 0x2dc6}, {0x2dc8, 0x2dce},
  {0x2dd0, 0x2dd6}, {0x2dd8, 0x2dde}, {0x3005, 0x3005},
  {0x3006, 0x3006}, {0x3007, 0x3007}, {0x3021, 0x3029},
  {0x3031, 0x3035}, {0x3038, 0x303a}, {0x303b, 0x303b},
  {0x303c, 0x303c}, {0x3041, 0x3096}, {0x309b, 0x309c},
  {0x309d, 0x309e}, {0x309f, 0x309f}, {0x30a1, 0x30fa},
  {0x30fc, 0x30fe}, {0x30ff, 0x30ff}, {0x3105, 0x312d},
  {0x3131, 0x318e}, {0x31a0, 0x31ba}, {0x31f0, 0x31ff},
  {0x3400, 0x4db5}, {0x4e00, 0x9fd5}, {0xa000, 0xa014},
  {0xa015, 0xa015}, {0xa016, 0xa48c}, {0xa4d0, 0xa4f7},
  {0xa4f8, 0xa4fd}, {0xa500, 0xa60b}, {0xa60c, 0xa60c},
  {0xa610, 0xa61f}, {0xa62a, 0xa62b}, {0xa640, 0xa66d},
  {0xa66e, 0xa66e}, {0xa67f, 0xa67f}, {0xa680, 0xa69b},
  {0xa69c, 0xa69d}, {0xa6a0, 0xa6e5}, {0xa6e6, 0xa6ef},
  {0xa717, 0xa71f}, {0xa722, 0xa76f}, {0xa770, 0xa770},
  {0xa771, 0xa787}, {0xa788, 0xa788}, {0xa78b, 0xa78e},
  {0xa78f, 0xa78f}, {0xa790, 0xa7ae}, {0xa7b0, 0xa7b7},
  {0xa7f7, 0xa7f7}, {0xa7f8, 0xa7f9}, {0xa7fa, 0xa7fa},
  {0xa7fb, 0xa801}, {0xa803, 0xa805}, {0xa807, 0xa80a},
  {0xa80c, 0xa822}, {0xa840, 0xa873}, {0xa882, 0xa8b3},
  {0xa8f2, 0xa8f7}, {0xa8fb, 0xa8fb}, {0xa8fd, 0xa8fd},
  {0xa90a, 0xa925}, {0xa930, 0xa946}, {0xa960, 0xa97c},
  {0xa984, 0xa9b2}, {0xa9cf, 0xa9cf}, {0xa9e0, 0xa9e4},
  {0xa9e6, 0xa9e6}, {0xa9e7, 0xa9ef}, {0xa9fa, 0xa9fe},
  {0xaa00, 0xaa28}, {0xaa40, 0xaa42}, {0xaa44, 0xaa4b},
  {0xaa60, 0xaa6f}, {0xaa70, 0xaa70}, {0xaa71, 0xaa76},
  {0xaa7a, 0xaa7a}, {0xaa7e, 0xaaaf}, {0xaab1, 0xaab1},
  {0xaab5, 0xaab6}, {0xaab9, 0xaabd}, {0xaac0, 0xaac0},
  {0xaac2, 0xaac2}, {0xaadb, 0xaadc}, {0xaadd, 0xaadd},
  {0xaae0, 0xaaea}, {0xaaf2, 0xaaf2}, {0xaaf3, 0xaaf4},
  {0xab01, 0xab06}, {0xab09, 0xab0e}, {0xab11, 0xab16},
  {0xab20, 0xab26}, {0xab28, 0xab2e}, {0xab30, 0xab5a},
  {0xab5c, 0xab5f}, {0xab60, 0xab65}, {0xab70, 0xabbf},
  {0xabc0, 0xabe2}, {0xac00, 0xd7a3}, {0xd7b0, 0xd7c6},
  {0xd7cb, 0xd7fb}, {0xf900, 0xfa6d}, {0xfa70, 0xfad9},
  {0xfb00, 0xfb06}, {0xfb13, 0xfb17}, {0xfb1d, 0xfb1d},
  {0xfb1f, 0xfb28}, {0xfb2a, 0xfb36}, {0xfb38, 0xfb3c},
  {0xfb3e, 0xfb3e}, {0xfb40, 0xfb41}, {0xfb43, 0xfb44},
  {0xfb46, 0xfbb1}, {0xfbd3, 0xfd3d}, {0xfd50, 0xfd8f},
  {0xfd92, 0xfdc7}, {0xfdf0, 0xfdfb}, {0xfe70, 0xfe74},
  {0xfe76, 0xfefc}, {0xff21, 0xff3a}, {0xff41, 0xff5a},
  {0xff66, 0xff6f}, {0xff70, 0xff70}, {0xff71, 0xff9d},
  {0xff9e, 0xff9f}, {0xffa0, 0xffbe}, {0xffc2, 0xffc7},
  {0xffca, 0xffcf}, {0xffd2, 0xffd7}, {0xffda, 0xffdc},
  {0x10000, 0x1000b}, {0x1000d, 0x10026}, {0x10028, 0x1003a},
  {0x1003c, 0x1003d}, {0x1003f, 0x1004d}, {0x10050, 0x1005d},
  {0x10080, 0x100fa}, {0x10140, 0x10174}, {0x10280, 0x1029c},
  {0x102a0, 0x102d0}, {0x10300, 0x1031f}, {0x10330, 0x10340},
  {0x10341, 0x10341}, {0x10342, 0x10349}, {0x1034a, 0x1034a},
  {0x10350, 0x10375}, {0x10380, 0x1039d}, {0x103a0, 0x103c3},
  {0x103c8, 0x103cf}, {0x103d1, 0x103d5}, {0x10400, 0x1044f},
  {0x10450, 0x1049d}, {0x104b0, 0x104d3}, {0x104d8, 0x104fb},
  {0x10500, 0x10527}, {0x10530, 0x10563}, {0x10600, 0x10736},
  {0x10740, 0x10755}, {0x10760, 0x10767}, {0x10800, 0x10805},
  {0x10808, 0x10808}, {0x1080a, 0x10835}, {0x10837, 0x10838},
  {0x1083c, 0x1083c}, {0x1083f, 0x10855}, {0x10860, 0x10876},
  {0x10880, 0x1089e}, {0x108e0, 0x108f2}, {0x108f4, 0x108f5},
  {0x10900, 0x10915}, {0x10920, 0x10939}, {0x10980, 0x109b7},
  {0x109be, 0x109bf}, {0x10a00, 0x10a00}, {0x10a10, 0x10a13},
  {0x10a15, 0x10a17}, {0x10a19, 0x10a33}, {0x10a60, 0x10a7c},
  {0x10a80, 0x10a9c}, {0x10ac0, 0x10ac7}, {0x10ac9, 0x10ae4},
  {0x10b00, 0x10b35}, {0x10b40, 0x10b55}, {0x10b60, 0x10b72},
  {0x10b80, 0x10b91}, {0x10c00, 0x10c48}, {0x10c80, 0x10cb2},
  {0x10cc0, 0x10cf2}, {0x11003, 0x11037}, {0x11083, 0x110af},
  {0x110d0, 0x110e8}, {0x11103, 0x11126}, {0x11150, 0x11172},
  {0x11176, 0x11176}, {0x11183, 0x111b2}, {0x111c1, 0x111c4},
  {0x111da, 0x111da}, {0x111dc, 0x111dc}, {0x11200, 0x11211},
  {0x11213, 0x1122b}, {0x11280, 0x11286}, {0x11288, 0x11288},
  {0x1128a, 0x1128d}, {0x1128f, 0x1129d}, {0x1129f, 0x112a8},
  {0x112b0, 0x112de}, {0x11305, 0x1130c}, {0x1130f, 0x11310},
  {0x11313, 0x11328}, {0x1132a, 0x11330}, {0x11332, 0x11333},
  {0x11335, 0x11339}, {0x1133d, 0x1133d}, {0x11350, 0x11350},
  {0x1135d, 0x11361}, {0x11400, 0x11434}, {0x11447, 0x1144a},
  {0x11480, 0x114af}, {0x114c4, 0x114c5}, {0x114c7, 0x114c7},
  {0x11580, 0x115ae}, {0x115d8, 0x115db}, {0x11600, 0x1162f},
  {0x11644, 0x11644}, {0x11680, 0x116aa}, {0x11700, 0x11719},
  {0x118a0, 0x118df}, {0x118ff, 0x118ff}, {0x11ac0, 0x11af8},
  {0x11c00, 0x11c08}, {0x11c0a, 0x11c2e}, {0x11c40, 0x11c40},
  {0x11c72, 0x11c8f}, {0x12000, 0x12399}, {0x12400, 0x1246e},
  {0x12480, 0x12543}, {0x13000, 0x1342e}, {0x14400, 0x14646},
  {0x16800, 0x16a38}, {0x16a40, 0x16a5e}, {0x16ad0, 0x16aed},
  {0x16b00, 0x16b2f}, {0x16b40, 0x16b43}, {0x16b63, 0x16b77},
  {0x16b7d, 0x16b8f}, {0x16f00, 0x16f44}, {0x16f50, 0x16f50},
  {0x16f93, 0x16f9f}, {0x16fe0, 0x16fe0}, {0x17000, 0x187ec},
  {0x18800, 0x18af2}, {0x1b000, 0x1b001}, {0x1bc00, 0x1bc6a},
  {0x1bc70, 0x1bc7c}, {0x1bc80, 0x1bc88}, {0x1bc90, 0x1bc99},
  {0x1d400, 0x1d454}, {0x1d456, 0x1d49c}, {0x1d49e, 0x1d49f},
  {0x1d4a2, 0x1d4a2}, {0x1d4a5, 0x1d4a6}, {0x1d4a9, 0x1d4ac},
  {0x1d4ae, 0x1d4b9}, {0x1d4bb, 0x1d4bb}, {0x1d4bd, 0x1d4c3},
  {0x1d4c5, 0x1d505}, {0x1d507, 0x1d50a}, {0x1d50d, 0x1d514},
  {0x1d516, 0x1d51c}, {0x1d51e, 0x1d539}, {0x1d53b, 0x1d53e},
  {0x1d540, 0x1d544}, {0x1d546, 0x1d546}, {0x1d54a, 0x1d550},
  {0x1d552, 0x1d6a5}, {0x1d6a8, 0x1d6c0}, {0x1d6c2, 0x1d6da},
  {0x1d6dc, 0x1d6fa}, {0x1d6fc, 0x1d714}, {0x1d716, 0x1d734},
  {0x1d736, 0x1d74e}, {0x1d750, 0x1d76e}, {0x1d770, 0x1d788},
  {0x1d78a, 0x1d7a8}, {0x1d7aa, 0x1d7c2}, {0x1d7c4, 0x1d7cb},
  {0x1e800, 0x1e8c4}, {0x1e900, 0x1e943}, {0x1ee00, 0x1ee03},
  {0x1ee05, 0x1ee1f}, {0x1ee21, 0x1ee22}, {0x1ee24, 0x1ee24},
  {0x1ee27, 0x1ee27}, {0x1ee29, 0x1ee32}, {0x1ee34, 0x1ee37},
  {0x1ee39, 0x1ee39}, {0x1ee3b, 0x1ee3b}, {0x1ee42, 0x1ee42},
  {0x1ee47, 0x1ee47}, {0x1ee49, 0x1ee49}, {0x1ee4b, 0x1ee4b},
  {0x1ee4d, 0x1ee4f}, {0x1ee51, 0x1ee52}, {0x1ee54, 0x1ee54},
  {0x1ee57, 0x1ee57}, {0x1ee59, 0x1ee59}, {0x1ee5b, 0x1ee5b},
  {0x1ee5d, 0x1ee5d}, {0x1ee5f, 0x1ee5f}, {0x1ee61, 0x1ee62},
  {0x1ee64, 0x1ee64}, {0x1ee67, 0x1ee6a}, {0x1ee6c, 0x1ee72},
  {0x1ee74, 0x1ee77}, {0x1ee79, 0x1ee7c}, {0x1ee7e, 0x1ee7e},
  {0x1ee80, 0x1ee89}, {0x1ee8b, 0x1ee9b}, {0x1eea1, 0x1eea3},
  {0x1eea5, 0x1eea9}, {0x1eeab, 0x1eebb}, {0x20000, 0x2a6d6},
  {0x2a700, 0x2b734}, {0x2b740, 0x2b81d}, {0x2b820, 0x2cea1},
  {0x2f800, 0x2fa1d}
};

const size_t ID_START_RANGES_COUNT = 643;

const unicode_range ID_CONTINUE_RANGES[] = {
  {0x30, 0x39}, {0x41, 0x5a}, {0x5f, 0x5f},
  {0x61, 0x7a}, {0xaa, 0xaa}, {0xb5, 0xb5},
  {0xb7, 0xb7}, {0xba, 0xba}, {0xc0, 0xd6},
  {0xd8, 0xf6}, {0xf8, 0x1ba}, {0x1bb, 0x1bb},
  {0x1bc, 0x1bf}, {0x1c0, 0x1c3}, {0x1c4, 0x293},
  {0x294, 0x294}, {0x295, 0x2af}, {0x2b0, 0x2c1},
  {0x2c6, 0x2d1}, {0x2e0, 0x2e4}, {0x2ec, 0x2ec},
  {0x2ee, 0x2ee}, {0x300, 0x36f}, {0x370, 0x373},
  {0x374, 0x374}, {0x376, 0x377}, {0x37a, 0x37a},
  {0x37b, 0x37d}, {0x37f, 0x37f}, {0x386, 0x386},
  {0x387, 0x387}, {0x388, 0x38a}, {0x38c, 0x38c},
  {0x38e, 0x3a1}, {0x3a3, 0x3f5}, {0x3f7, 0x481},
  {0x483, 0x487}, {0x48a, 0x52f}, {0x531, 0x556},
  {0x559, 0x559}, {0x561, 0x587}, {0x591, 0x5bd},
  {0x5bf, 0x5bf}, {0x5c1, 0x5c2}, {0x5c4, 0x5c5},
  {0x5c7, 0x5c7}, {0x5d0, 0x5ea}, {0x5f0, 0x5f2},
  {0x610, 0x61a}, {0x620, 0x63f}, {0x640, 0x640},
  {0x641, 0x64a}, {0x64b, 0x65f}, {0x660, 0x669},
  {0x66e, 0x66f}, {0x670, 0x670}, {0x671, 0x6d3},
  {0x6d5, 0x6d5}, {0x6d6, 0x6dc}, {0x6df, 0x6e4},
  {0x6e5, 0x6e6}, {0x6e7, 0x6e8}, {0x6ea, 0x6ed},
  {0x6ee, 0x6ef}, {0x6f0, 0x6f9}, {0x6fa, 0x6fc},
  {0x6ff, 0x6ff}, {0x710, 0x710}, {0x711, 0x711},
  {0x712, 0x72f}, {0x730, 0x74a}, {0x74d, 0x7a5},
  {0x7a6, 0x7b0}, {0x7b1, 0x7b1}, {0x7c0, 0x7c9},
  {0x7ca, 0x7ea}, {0x7eb, 0x7f3}, {0x7f4, 0x7f5},
  {0x7fa, 0x7fa}, {0x800, 0x815}, {0x816, 0x819},
  {0x81a, 0x81a}, {0x81b, 0x823}, {0x824, 0x824},
  {0x825, 0x827}, {0x828, 0x828}, {0x829, 0x82d},
  {0x840, 0x858}, {0x859, 0x85b}, {0x8a0, 0x8b4},
  {0x8b6, 0x8bd}, {0x8d4, 0x8e1}, {0x8e3, 0x902},
  {0x903, 0x903}, {0x904, 0x939}, {0x93a, 0x93a},
  {0x93b, 0x93b}, {0x93c, 0x93c}, {0x93d, 0x93d},
  {0x93e, 0x940}, {0x941, 0x948}, {0x949, 0x94c},
  {0x94d, 0x94d}, {0x94e, 0x94f}, {0x950, 0x950},
  {0x951, 0x957}, {0x958, 0x961}, {0x962, 0x963},
  {0x966, 0x96f}, {0x971, 0x971}, {0x972, 0x980},
  {0x981, 0x981}, {0x982, 0x983}, {0x985, 0x98c},
  {0x98f, 0x990}, {0x993, 0x9a8}, {0x9aa, 0x9b0},
  {0x9b2, 0x9b2}, {0x9b6, 0x9b9}, {0x9bc, 0x9bc},
  {0x9bd, 0x9bd}, {0x9be, 0x9c0}, {0x9c1, 0x9c4},
  {0x9c7, 0x9c8}, {0x9cb, 0x9cc}, {0x9cd, 0x9cd},
  {0x9ce, 0x9ce}, {0x9d7, 0x9d7}, {0x9dc, 0x9dd},
  {0x9df, 0x9e1}, {0x9e2, 0x9e3}, {0x9e6, 0x9ef},
  {0x9f0, 0x9f1}, {0xa01, 0xa02}, {0xa03, 0xa03},
  {0xa05, 0xa0a}, {0xa0f, 0xa10}, {0xa13, 0xa28},
  {0xa2a, 0xa30}, {0xa32, 0xa33}, {0xa35, 0xa36},
  {0xa38, 0xa39}, {0xa3c, 0xa3c}, {0xa3e, 0xa40},
  {0xa41, 0xa42}, {0xa47, 0xa48}, {0xa4b, 0xa4d},
  {0xa51, 0xa51}, {0xa59, 0xa5c}, {0xa5e, 0xa5e},
  {0xa66, 0xa6f}, {0xa70, 0xa71}, {0xa72, 0xa74},
  {0xa75, 0xa75}, {0xa81, 0xa82}, {0xa83, 0xa83},
  {0xa85, 0xa8d}, {0xa8f, 0xa91}, {0xa93, 0xaa8},
  {0xaaa, 0xab0}, {0xab2, 0xab3}, {0xab5, 0xab9},
  {0xabc, 0xabc}, {0xabd, 0xabd}, {0xabe, 0xac0},
  {0xac1, 0xac5}, {0xac7, 0xac8}, {0xac9, 0xac9},
  {0xacb, 0xacc}, {0xacd, 0xacd}, {0xad0, 0xad0},
  {0xae0, 0xae1}, {0xae2, 0xae3}, {0xae6, 0xaef},
  {0xaf9, 0xaf9}, {0xb01, 0xb01}, {0xb02, 0xb03},
  {0xb05, 0xb0c}, {0xb0f, 0xb10}, {0xb13, 0xb28},
  {0xb2a, 0xb30}, {0xb32, 0xb33}, {0xb35, 0xb39},
  {0xb3c, 0xb3c}, {0xb3d, 0xb3d}, {0xb3e, 0xb3e},
  {0xb3f, 0xb3f}, {0xb40, 0xb40}, {0xb41, 0xb44},
  {0xb47, 0xb48}, {0xb4b, 0xb4c}, {0xb4d, 0xb4d},
  {0xb56, 0xb56}, {0xb57, 0xb57}, {0xb5c, 0xb5d},
  {0xb5f, 0xb61}, {0xb62, 0xb63}, {0xb66, 0xb6f},
  {0xb71, 0xb71}, {0xb82, 0xb82}, {0xb83, 0xb83},
  {0xb85, 0xb8a}, {0xb8e, 0xb90}, {0xb92, 0xb95},
  {0xb99, 0xb9a}, {0xb9c, 0xb9c}, {0xb9e, 0xb9f},
  {0xba3, 0xba4}, {0xba8, 0xbaa}, {0xbae, 0xbb9},
  {0xbbe, 0xbbf}, {0xbc0, 0xbc0}, {0xbc1, 0xbc2},
  {0xbc6, 0xbc8}, {0xbca, 0xbcc}, {0xbcd, 0xbcd},
  {0xbd0, 0xbd0}, {0xbd7, 0xbd7}, {0xbe6, 0xbef},
  {0xc00, 0xc00}, {0xc01, 0xc03}, {0xc05, 0xc0c},
  {0xc0e, 0xc10}, {0xc12, 0xc28}, {0xc2a, 0xc39},
  {0xc3d, 0xc3d}, {0xc3e, 0xc40}, {0xc41, 0xc44},
  {0xc46, 0xc48}, {0xc4a, 0xc4d}, {0xc55, 0xc56},
  {0xc58, 0xc5a}, {0xc60, 0xc61}, {0xc62, 0xc63},
  {0xc66, 0xc6f}, {0xc80, 0xc80}, {0xc81, 0xc81},
  {0xc82, 0xc83}, {0xc85, 0xc8c}, {0xc8e, 0xc90},
  {0xc92, 0xca8}, {0xcaa, 0xcb3}, {0xcb5, 0xcb9},
  {0xcbc, 0xcbc}, {0xcbd, 0xcbd}, {0xcbe, 0xcbe},
  {0xcbf, 0xcbf}, {0xcc0, 0xcc4}, {0xcc6, 0xcc6},
  {0xcc7, 0xcc8}, {0xcca, 0xccb}, {0xccc, 0xccd},
  {0xcd5, 0xcd6}, {0xcde, 0xcde}, {0xce0, 0xce1},
  {0xce2, 0xce3}, {0xce6, 0xcef}, {0xcf1, 0xcf2},
  {0xd01, 0xd01}, {0xd02, 0xd03}, {0xd05, 0xd0c},
  {0xd0e, 0xd10}, {0xd12, 0xd3a}, {0xd3d, 0xd3d},
  {0xd3e, 0xd40}, {0xd41, 0xd44}, {0xd46, 0xd48},
  {0xd4a, 0xd4c}, {0xd4d, 0xd4d}, {0xd4e, 0xd4e},
  {0xd54, 0xd56}, {0xd57, 0xd57}, {0xd5f, 0xd61},
  {0xd62, 0xd63}, {0xd66, 0xd6f}, {0xd7a, 0xd7f},
  {0xd82, 0xd83}, {0xd85, 0xd96}, {0xd9a, 0xdb1},
  {0xdb3, 0xdbb}, {0xdbd, 0xdbd}, {0xdc0, 0xdc6},
  {0xdca, 0xdca}, {0xdcf, 0xdd1}, {0xdd2, 0xdd4},
  {0xdd6, 0xdd6}, {0xdd8, 0xddf}, {0xde6, 0xdef},
  {0xdf2, 0xdf3}, {0xe01, 0xe30}, {0xe31, 0xe31},
  {0xe32, 0xe33}, {0xe34, 0xe3a}, {0xe40, 0xe45},
  {0xe46, 0xe46}, {0xe47, 0xe4e}, {0xe50, 0xe59},
  {0xe81, 0xe82}, {0xe84, 0xe84}, {0xe87, 0xe88},
  {0xe8a, 0xe8a}, {0xe8d, 0xe8d}, {0xe94, 0xe97},
  {0xe99, 0xe9f}, {0xea1, 0xea3}, {0xea5, 0xea5},
  {0xea7, 0xea7}, {0xeaa, 0xeab}, {0xead, 0xeb0},
  {0xeb1, 0xeb1}, {0xeb2, 0xeb3}, {0xeb4, 0xeb9},
  {0xebb, 0xebc}, {0xebd, 0xebd}, {0xec0, 0xec4},
  {0xec6, 0xec6}, {0xec8, 0xecd}, {0xed0, 0xed9},
  {0xedc, 0xedf}, {0xf00, 0xf00}, {0xf18, 0xf19},
  {0xf20, 0xf29}, {0xf35, 0xf35}, {0xf37, 0xf37},
  {0xf39, 0xf39}, {0xf3e, 0xf3f}, {0xf40, 0xf47},
  {0xf49, 0xf6c}, {0xf71, 0xf7e}, {0xf7f, 0xf7f},
  {0xf80, 0xf84}, {0xf86, 0xf87}, {0xf88, 0xf8c},
  {0xf8d, 0xf97}, {0xf99, 0xfbc}, {0xfc6, 0xfc6},
  {0x1000, 0x102a}, {0x102b, 0x102c}, {0x102d, 0x1030},
  {0x1031, 0x1031}, {0x1032, 0x1037}, {0x1038, 0x1038},
  {0x1039, 0x103a}, {0x103b, 0x103c}, {0x103d, 0x103e},
  {0x103f, 0x103f}, {0x1040, 0x1049}, {0x1050, 0x1055},
  {0x1056, 0x1057}, {0x1058, 0x1059}, {0x105a, 0x105d},
  {0x105e, 0x1060}, {0x1061, 0x1061}, {0x1062, 0x1064},
  {0x1065, 0x1066}, {0x1067, 0x106d}, {0x106e, 0x1070},
  {0x1071, 0x1074}, {0x1075, 0x1081}, {0x1082, 0x1082},
  {0x1083, 0x1084}, {0x1085, 0x1086}, {0x1087, 0x108c},
  {0x108d, 0x108d}, {0x108e, 0x108e}, {0x108f, 0x108f},
  {0x1090, 0x1099}, {0x109a, 0x109c}, {0x109d, 0x109d},
  {0x10a0, 0x10c5}, {0x10c7, 0x10c7}, {0x10cd, 0x10cd},
  {0x10d0, 0x10fa}, {0x10fc, 0x10fc}, {0x10fd, 0x1248},
  {0x124a, 0x124d}, {0x1250, 0x1256}, {0x1258, 0x1258},
  {0x125a, 0x125d}, {0x1260, 0x1288}, {0x128a, 0x128d},
  {0x1290, 0x12b0}, {0x12b2, 0x12b5}, {0x12b8, 0x12be},
  {0x12c0, 0x12c0}, {0x12c2, 0x12c5}, {0x12c8, 0x12d6},
  {0x12d8, 0x1310}, {0x1312, 0x1315}, {0x1318, 0x135a},
  {0x135d, 0x135f}, {0x1369, 0x1371}, {0x1380, 0x138f},
  {0x13a0, 0x13f5}, {0x13f8, 0x13fd}, {0x1401, 0x166c},
  {0x166f, 0x167f}, {0x1681, 0x169a}, {0x16a0, 0x16ea},
  {0x16ee, 0x16f0}, {0x16f1, 0x16f8}, {0x1700, 0x170c},
  {0x170e, 0x1711}, {0x1712, 0x1714}, {0x1720, 0x1731},
  {0x1732, 0x1734}, {0x1740, 0x1751}, {0x1752, 0x1753},
  {0x1760, 0x176c}, {0x176e, 0x1770}, {0x1772, 0x1773},
  {0x1780, 0x17b3}, {0x17b4, 0x17b5}, {0x17b6, 0x17b6},
  {0x17b7, 0x17bd}, {0x17be, 0x17c5}, {0x17c6, 0x17c6},
  {0x17c7, 0x17c8}, {0x17c9, 0x17d3}, {0x17d7, 0x17d7},
  {0x17dc, 0x17dc}, {0x17dd, 0x17dd}, {0x17e0, 0x17e9},
  {0x180b, 0x180d}, {0x1810, 0x1819}, {0x1820, 0x1842},
  {0x1843, 0x1843}, {0x1844, 0x1877}, {0x1880, 0x1884},
  {0x1885, 0x1886}, {0x1887, 0x18a8}, {0x18a9, 0x18a9},
  {0x18aa, 0x18aa}, {0x18b0, 0x18f5}, {0x1900, 0x191e},
  {0x1920, 0x1922}, {0x1923, 0x1926}, {0x1927, 0x1928},
  {0x1929, 0x192b}, {0x1930, 0x1931}, {0x1932, 0x1932},
  {0x1933, 0x1938}, {0x1939, 0x193b}, {0x1946, 0x194f},
  {0x1950, 0x196d}, {0x1970, 0x1974}, {0x1980, 0x19ab},
  {0x19b0, 0x19c9}, {0x19d0, 0x19d9}, {0x19da, 0x19da},
  {0x1a00, 0x1a16}, {0x1a17, 0x1a18}, {0x1a19, 0x1a1a},
  {0x1a1b, 0x1a1b}, {0x1a20, 0x1a54}, {0x1a55, 0x1a55},
  {0x1a56, 0x1a56}, {0x1a57, 0x1a57}, {0x1a58, 0x1a5e},
  {0x1a60, 0x1a60}, {0x1a61, 0x1a61}, {0x1a62, 0x1a62},
  {0x1a63, 0x1a64}, {0x1a65, 0x1a6c}, {0x1a6d, 0x1a72},
  {0x1a73, 0x1a7c}, {0x1a7f, 0x1a7f}, {0x1a80, 0x1a89},
  {0x1a90, 0x1a99}, {0x1aa7, 0x1aa7}, {0x1ab0, 0x1abd},
  {0x1b00, 0x1b03}, {0x1b04, 0x1b04}, {0x1b05, 0x1b33},
  {0x1b34, 0x1b34}, {0x1b35, 0x1b35}, {0x1b36, 0x1b3a},
  {0x1b3b, 0x1b3b}, {0x1b3c, 0x1b3c}, {0x1b3d, 0x1b41},
  {0x1b42, 0x1b42}, {0x1b43, 0x1b44}, {0x1b45, 0x1b4b},
  {0x1b50, 0x1b59}, {0x1b6b, 0x1b73}, {0x1b80, 0x1b81},
  {0x1b82, 0x1b82}, {0x1b83, 0x1ba0}, {0x1ba1, 0x1ba1},
  {0x1ba2, 0x1ba5}, {0x1ba6, 0x1ba7}, {0x1ba8, 0x1ba9},
  {0x1baa, 0x1baa}, {0x1bab, 0x1bad}, {0x1bae, 0x1baf},
  {0x1bb0, 0x1bb9}, {0x1bba, 0x1be5}, {0x1be6, 0x1be6},
  {0x1be7, 0x1be7}, {0x1be8, 0x1be9}, {0x1bea, 0x1bec},
  {0x1bed, 0x1bed}, {0x1bee, 0x1bee}, {0x1bef, 0x1bf1},
  {0x1bf2, 0x1bf3}, {0x1c00, 0x1c23}, {0x1c24, 0x1c2b},
  {0x1c2c, 0x1c33}, {0x1c34, 0x1c35}, {0x1c36, 0x1c37},
  {0x1c40, 0x1c49}, {0x1c4d, 0x1c4f}, {0x1c50, 0x1c59},
  {0x1c5a, 0x1c77}, {0x1c78, 0x1c7d}, {0x1c80, 0x1c88},
  {0x1cd0, 0x1cd2}, {0x1cd4, 0x1ce0}, {0x1ce1, 0x1ce1},
  {0x1ce2, 0x1ce8}, {0x1ce9, 0x1cec}, {0x1ced, 0x1ced},
  {0x1cee, 0x1cf1}, {0x1cf2, 0x1cf3}, {0x1cf4, 0x1cf4},
  {0x1cf5, 0x1cf6}, {0x1cf8, 0x1cf9}, {0x1d00, 0x1d2b},
  {0x1d2c, 0x1d6a}, {0x1d6b, 0x1d77}, {0x1d78, 0x1d78},
  {0x1d79, 0x1d9a}, {0x1d9b, 0x1dbf}, {0x1dc0, 0x1df5},
  {0x1dfb, 0x1dff}, {0x1e00, 0x1f15}, {0x1f18, 0x1f1d},
  {0x1f20, 0x1f45}, {0x1f48, 0x1f4d}, {0x1f50, 0x1f57},
  {0x1f59, 0x1f59}, {0x1f5b, 0x1f5b}, {0x1f5d, 0x1f5d},
  {0x1f5f, 0x1f7d}, {0x1f80, 0x1fb4}, {0x1fb6, 0x1fbc},
  {0x1fbe, 0x1fbe}, {0x1fc2, 0x1fc4}, {0x1fc6, 0x1fcc},
  {0x1fd0, 0x1fd3}, {0x1fd6, 0x1fdb}, {0x1fe0, 0x1fec},
  {0x1ff2, 0x1ff4}, {0x1ff6, 0x1ffc}, {0x203f, 0x2040},
  {0x2054, 0x2054}, {0x2071, 0x2071}, {0x207f, 0x207f},
  {0x2090, 0x209c}, {0x20d0, 0x20dc}, {0x20e1, 0x20e1},
  {0x20e5, 0x20f0}, {0x2102, 0x2102}, {0x2107, 0x2107},
  {0x210a, 0x2113}, {0x2115, 0x2115}, {0x2118, 0x2118},
  {0x2119, 0x211d}, {0x2124, 0x2124}, {0x2126, 0x2126},
  {0x2128, 0x2128}, {0x212a, 0x212d}, {0x212e, 0x212e},
  {0x212f, 0x2134}, {0x2135, 0x2138}, {0x2139, 0x2139},
  {0x213c, 0x213f}, {0x2145, 0x2149}, {0x214e, 0x214e},
  {0x2160, 0x2182}, {0x2183, 0x2184}, {0x2185, 0x2188},
  {0x2c00, 0x2c2e}, {0x2c30, 0x2c5e}, {0x2c60, 0x2c7b},
  {0x2c7c, 0x2c7d}, {0x2c7e, 0x2ce4}, {0x2ceb, 0x2cee},
  {0x2cef, 0x2cf1}, {0x2cf2, 0x2cf3}, {0x2d00, 0x2d25},
  {0x2d27, 0x2d27}, {0x2d2d, 0x2d2d}, {0x2d30, 0x2d67},
  {0x2d6f, 0x2d6f}, {0x2d7f, 0x2d7f}, {0x2d80, 0x2d96},
  {0x2da0, 0x2da6}, {0x2da8, 0x2dae}, {0x2db0, 0x2db6},
  {0x2db8, 0x2dbe}, {0x2dc0, 0x2dc6}, {0x2dc8, 0x2dce},
  {0x2dd0, 0x2dd6}, {0x2dd8, 0x2dde}, {0x2de0, 0x2dff},
  {0x3005, 0x3005}, {0x3006, 0x3006}, {0x3007, 0x3007},
  {0x3021, 0x3029}, {0x302a, 0x302d}, {0x302e, 0x302f},
  {0x3031, 0x3035}, {0x3038, 0x303a}, {0x303b, 0x303b},
  {0x303c, 0x303c}, {0x3041, 0x3096}, {0x3099, 0x309a},
  {0x309b, 0x309c}, {0x309d, 0x309e}, {0x309f, 0x309f},
  {0x30a1, 0x30fa}, {0x30fc, 0x30fe}, {0x30ff, 0x30ff},
  {0x3105, 0x312d}, {0x3131, 0x318e}, {0x31a0, 0x31ba},
  {0x31f0, 0x31ff}, {0x3400, 0x4db5}, {0x4e00, 0x9fd5},
  {0xa000, 0xa014}, {0xa015, 0xa015}, {0xa016, 0xa48c},
  {0xa4d0, 0xa4f7}, {0xa4f8, 0xa4fd}, {0xa500, 0xa60b},
  {0xa60c, 0xa60c}, {0xa610, 0xa61f}, {0xa620, 0xa629},
  {0xa62a, 0xa62b}, {0xa640, 0xa66d}, {0xa66e, 0xa66e},
  {0xa66f, 0xa66f}, {0xa674, 0xa67d}, {0xa67f, 0xa67f},
  {0xa680, 0xa69b}, {0xa69c, 0xa69d}, {0xa69e, 0xa69f},
  {0xa6a0, 0xa6e5}, {0xa6e6, 0xa6ef}, {0xa6f0, 0xa6f1},
  {0xa717, 0xa71f}, {0xa722, 0xa76f}, {0xa770, 0xa770},
  {0xa771, 0xa787}, {0xa788, 0xa788}, {0xa78b, 0xa78e},
  {0xa78f, 0xa78f}, {0xa790, 0xa7ae}, {0xa7b0, 0xa7b7},
  {0xa7f7, 0xa7f7}, {0xa7f8, 0xa7f9}, {0xa7fa, 0xa7fa},
  {0xa7fb, 0xa801}, {0xa802, 0xa802}, {0xa803, 0xa805},
  {0xa806, 0xa806}, {0xa807, 0xa80a}, {0xa80b, 0xa80b},
  {0xa80c, 0xa822}, {0xa823, 0xa824}, {0xa825, 0xa826},
  {0xa827, 0xa827}, {0xa840, 0xa873}, {0xa880, 0xa881},
  {0xa882, 0xa8b3}, {0xa8b4, 0xa8c3}, {0xa8c4, 0xa8c5},
  {0xa8d0, 0xa8d9}, {0xa8e0, 0xa8f1}, {0xa8f2, 0xa8f7},
  {0xa8fb, 0xa8fb}, {0xa8fd, 0xa8fd}, {0xa900, 0xa909},
  {0xa90a, 0xa925}, {0xa926, 0xa92d}, {0xa930, 0xa946},
  {0xa947, 0xa951}, {0xa952, 0xa953}, {0xa960, 0xa97c},
  {0xa980, 0xa982}, {0xa983, 0xa983}, {0xa984, 0xa9b2},
  {0xa9b3, 0xa9b3}, {0xa9b4, 0xa9b5}, {0xa9b6, 0xa9b9},
  {0xa9ba, 0xa9bb}, {0xa9bc, 0xa9bc}, {0xa9bd, 0xa9c0},
  {0xa9cf, 0xa9cf}, {0xa9d0, 0xa9d9}, {0xa9e0, 0xa9e4},
  {0xa9e5, 0xa9e5}, {0xa9e6, 0xa9e6}, {0xa9e7, 0xa9ef},
  {0xa9f0, 0xa9f9}, {0xa9fa, 0xa9fe}, {0xaa00, 0xaa28},
  {0xaa29, 0xaa2e}, {0xaa2f, 0xaa30}, {0xaa31, 0xaa32},
  {0xaa33, 0xaa34}, {0xaa35, 0xaa36}, {0xaa40, 0xaa42},
  {0xaa43, 0xaa43}, {0xaa44, 0xaa4b}, {0xaa4c, 0xaa4c},
  {0xaa4d, 0xaa4d}, {0xaa50, 0xaa59}, {0xaa60, 0xaa6f},
  {0xaa70, 0xaa70}, {0xaa71, 0xaa76}, {0xaa7a, 0xaa7a},
  {0xaa7b, 0xaa7b}, {0xaa7c, 0xaa7c}, {0xaa7d, 0xaa7d},
  {0xaa7e, 0xaaaf}, {0xaab0, 0xaab0}, {0xaab1, 0xaab1},
  {0xaab2, 0xaab4}, {0xaab5, 0xaab6}, {0xaab7, 0xaab8},
  {0xaab9, 0xaabd}, {0xaabe, 0xaabf}, {0xaac0, 0xaac0},
  {0xaac1, 0xaac1}, {0xaac2, 0xaac2}, {0xaadb, 0xaadc},
  {0xaadd, 0xaadd}, {0xaae0, 0xaaea}, {0xaaeb, 0xaaeb},
  {0xaaec, 0xaaed}, {0xaaee, 0xaaef}, {0xaaf2, 0xaaf2},
  {0xaaf3, 0xaaf4}, {0xaaf5, 0xaaf5}, {0xaaf6, 0xaaf6},
  {0xab01, 0xab06}, {0xab09, 0xab0e}, {0xab11, 0xab16},
  {0xab20, 0xab26}, {0xab28, 0xab2e}, {0xab30, 0xab5a},
  {0xab5c, 0xab5f}, {0xab60, 0xab65}, {0xab70, 0xabbf},
  {0xabc0, 0xabe2}, {0xabe3, 0xabe4}, {0xabe5, 0xabe5},
  {0xabe6, 0xabe7}, {0xabe8, 0xabe8}, {0xabe9, 0xabea},
  {0xabec, 0xabec}, {0xabed, 0xabed}, {0xabf0, 0xabf9},
  {0xac00, 0xd7a3}, {0xd7b0, 0xd7c6}, {0xd7cb, 0xd7fb},
  {0xf900, 0xfa6d}, {0xfa70, 0xfad9}, {0xfb00, 0xfb06},
  {0xfb13, 0xfb17}, {0xfb1d, 0xfb1d}, {0xfb1e, 0xfb1e},
  {0xfb1f, 0xfb28}, {0xfb2a, 0xfb36}, {0xfb38, 0xfb3c},
  {0xfb3e, 0xfb3e}, {0xfb40, 0xfb41}, {0xfb43, 0xfb44},
  {0xfb46, 0xfbb1}, {0xfbd3, 0xfd3d}, {0xfd50, 0xfd8f},
  {0xfd92, 0xfdc7}, {0xfdf0, 0xfdfb}, {0xfe00, 0xfe0f},
  {0xfe20, 0xfe2f}, {0xfe33, 0xfe34}, {0xfe4d, 0xfe4f},
  {0xfe70, 0xfe74}, {0xfe76, 0xfefc}, {0xff10, 0xff19},
  {0xff21, 0xff3a}, {0xff3f, 0xff3f}, {0xff41, 0xff5a},
  {0xff66, 0xff6f}, {0xff70, 0xff70}, {0xff71, 0xff9d},
  {0xff9e, 0xff9f}, {0xffa0, 0xffbe}, {0xffc2, 0xffc7},
  {0xffca, 0xffcf}, {0xffd2, 0xffd7}, {0xffda, 0xffdc},
  {0x10000, 0x1000b}, {0x1000d, 0x10026}, {0x10028, 0x1003a},
  {0x1003c, 0x1003d}, {0x1003f, 0x1004d}, {0x10050, 0x1005d},
  {0x10080, 0x100fa}, {0x10140, 0x10174}, {0x101fd, 0x101fd},
  {0x10280, 0x1029c}, {0x102a0, 0x102d0}, {0x102e0, 0x102e0},
  {0x10300, 0x1031f}, {0x10330, 0x10340}, {0x10341, 0x10341},
  {0x10342, 0x10349}, {0x1034a, 0x1034a}, {0x10350, 0x10375},
  {0x10376, 0x1037a}, {0x10380, 0x1039d}, {0x103a0, 0x103c3},
  {0x103c8, 0x103cf}, {0x103d1, 0x103d5}, {0x10400, 0x1044f},
  {0x10450, 0x1049d}, {0x104a0, 0x104a9}, {0x104b0, 0x104d3},
  {0x104d8, 0x104fb}, {0x10500, 0x10527}, {0x10530, 0x10563},
  {0x10600, 0x10736}, {0x10740, 0x10755}, {0x10760, 0x10767},
  {0x10800, 0x10805}, {0x10808, 0x10808}, {0x1080a, 0x10835},
  {0x10837, 0x10838}, {0x1083c, 0x1083c}, {0x1083f, 0x10855},
  {0x10860, 0x10876}, {0x10880, 0x1089e}, {0x108e0, 0x108f2},
  {0x108f4, 0x108f5}, {0x10900, 0x10915}, {0x10920, 0x10939},
  {0x10980, 0x109b7}, {0x109be, 0x109bf}, {0x10a00, 0x10a00},
  {0x10a01, 0x10a03}, {0x10a05, 0x10a06}, {0x10a0c, 0x10a0f},
  {0x10a10, 0x10a13}, {0x10a15, 0x10a17}, {0x10a19, 0x10a33},
  {0x10a38, 0x10a3a}, {0x10a3f, 0x10a3f}, {0x10a60, 0x10a7c},
  {0x10a80, 0x10a9c}, {0x10ac0, 0x10ac7}, {0x10ac9, 0x10ae4},
  {0x10ae5, 0x10ae6}, {0x10b00, 0x10b35}, {0x10b40, 0x10b55},
  {0x10b60, 0x10b72}, {0x10b80, 0x10b91}, {0x10c00, 0x10c48},
  {0x10c80, 0x10cb2}, {0x10cc0, 0x10cf2}, {0x11000, 0x11000},
  {0x11001, 0x11001}, {0x11002, 0x11002}, {0x11003, 0x11037},
  {0x11038, 0x11046}, {0x11066, 0x1106f}, {0x1107f, 0x11081},
  {0x11082, 0x11082}, {0x11083, 0x110af}, {0x110b0, 0x110b2},
  {0x110b3, 0x110b6}, {0x110b7, 0x110b8}, {0x110b9, 0x110ba},
  {0x110d0, 0x110e8}, {0x110f0, 0x110f9}, {0x11100, 0x11102},
  {0x11103, 0x11126}, {0x11127, 0x1112b}, {0x1112c, 0x1112c},
  {0x1112d, 0x11134}, {0x11136, 0x1113f}, {0x11150, 0x11172},
  {0x11173, 0x11173}, {0x11176, 0x11176}, {0x11180, 0x11181},
  {0x11182, 0x11182}, {0x11183, 0x111b2}, {0x111b3, 0x111b5},
  {0x111b6, 0x111be}, {0x111bf, 0x111c0}, {0x111c1, 0x111c4},
  {0x111ca, 0x111cc}, {0x111d0, 0x111d9}, {0x111da, 0x111da},
  {0x111dc, 0x111dc}, {0x11200, 0x11211}, {0x11213, 0x1122b},
  {0x1122c, 0x1122e}, {0x1122f, 0x11231}, {0x11232, 0x11233},
  {0x11234, 0x11234}, {0x11235, 0x11235}, {0x11236, 0x11237},
  {0x1123e, 0x1123e}, {0x11280, 0x11286}, {0x11288, 0x11288},
  {0x1128a, 0x1128d}, {0x1128f, 0x1129d}, {0x1129f, 0x112a8},
  {0x112b0, 0x112de}, {0x112df, 0x112df}, {0x112e0, 0x112e2},
  {0x112e3, 0x112ea}, {0x112f0, 0x112f9}, {0x11300, 0x11301},
  {0x11302, 0x11303}, {0x11305, 0x1130c}, {0x1130f, 0x11310},
  {0x11313, 0x11328}, {0x1132a, 0x11330}, {0x11332, 0x11333},
  {0x11335, 0x11339}, {0x1133c, 0x1133c}, {0x1133d, 0x1133d},
  {0x1133e, 0x1133f}, {0x11340, 0x11340}, {0x11341, 0x11344},
  {0x11347, 0x11348}, {0x1134b, 0x1134d}, {0x11350, 0x11350},
  {0x11357, 0x11357}, {0x1135d, 0x11361}, {0x11362, 0x11363},
  {0x11366, 0x1136c}, {0x11370, 0x11374}, {0x11400, 0x11434},
  {0x11435, 0x11437}, {0x11438, 0x1143f}, {0x11440, 0x11441},
  {0x11442, 0x11444}, {0x11445, 0x11445}, {0x11446, 0x11446},
  {0x11447, 0x1144a}, {0x11450, 0x11459}, {0x11480, 0x114af},
  {0x114b0, 0x114b2}, {0x114b3, 0x114b8}, {0x114b9, 0x114b9},
  {0x114ba, 0x114ba}, {0x114bb, 0x114be}, {0x114bf, 0x114c0},
  {0x114c1, 0x114c1}, {0x114c2, 0x114c3}, {0x114c4, 0x114c5},
  {0x114c7, 0x114c7}, {0x114d0, 0x114d9}, {0x11580, 0x115ae},
  {0x115af, 0x115b1}, {0x115b2, 0x115b5}, {0x115b8, 0x115bb},
  {0x115bc, 0x115bd}, {0x115be, 0x115be}, {0x115bf, 0x115c0},
  {0x115d8, 0x115db}, {0x115dc, 0x115dd}, {0x11600, 0x1162f},
  {0x11630, 0x11632}, {0x11633, 0x1163a}, {0x1163b, 0x1163c},
  {0x1163d, 0x1163d}, {0x1163e, 0x1163e}, {0x1163f, 0x11640},
  {0x11644, 0x11644}, {0x11650, 0x11659}, {0x11680, 0x116aa},
  {0x116ab, 0x116ab}, {0x116ac, 0x116ac}, {0x116ad, 0x116ad},
  {0x116ae, 0x116af}, {0x116b0, 0x116b5}, {0x116b6, 0x116b6},
  {0x116b7, 0x116b7}, {0x116c0, 0x116c9}, {0x11700, 0x11719},
  {0x1171d, 0x1171f}, {0x11720, 0x11721}, {0x11722, 0x11725},
  {0x11726, 0x11726}, {0x11727, 0x1172b}, {0x11730, 0x11739},
  {0x118a0, 0x118df}, {0x118e0, 0x118e9}, {0x118ff, 0x118ff},
  {0x11ac0, 0x11af8}, {0x11c00, 0x11c08}, {0x11c0a, 0x11c2e},
  {0x11c2f, 0x11c2f}, {0x11c30, 0x11c36}, {0x11c38, 0x11c3d},
  {0x11c3e, 0x11c3e}, {0x11c3f, 0x11c3f}, {0x11c40, 0x11c40},
  {0x11c50, 0x11c59}, {0x11c72, 0x11c8f}, {0x11c92, 0x11ca7},
  {0x11ca9, 0x11ca9}, {0x11caa, 0x11cb0}, {0x11cb1, 0x11cb1},
  {0x11cb2, 0x11cb3}, {0x11cb4, 0x11cb4}, {0x11cb5, 0x11cb6},
  {0x12000, 0x12399}, {0x12400, 0x1246e}, {0x12480, 0x12543},
  {0x13000, 0x1342e}, {0x14400, 0x14646}, {0x16800, 0x16a38},
  {0x16a40, 0x16a5e}, {0x16a60, 0x16a69}, {0x16ad0, 0x16aed},
  {0x16af0, 0x16af4}, {0x16b00, 0x16b2f}, {0x16b30, 0x16b36},
  {0x16b40, 0x16b43}, {0x16b50, 0x16b59}, {0x16b63, 0x16b77},
  {0x16b7d, 0x16b8f}, {0x16f00, 0x16f44}, {0x16f50, 0x16f50},
  {0x16f51, 0x16f7e}, {0x16f8f, 0x16f92}, {0x16f93, 0x16f9f},
  {0x16fe0, 0x16fe0}, {0x17000, 0x187ec}, {0x18800, 0x18af2},
  {0x1b000, 0x1b001}, {0x1bc00, 0x1bc6a}, {0x1bc70, 0x1bc7c},
  {0x1bc80, 0x1bc88}, {0x1bc90, 0x1bc99}, {0x1bc9d, 0x1bc9e},
  {0x1d165, 0x1d166}, {0x1d167, 0x1d169}, {0x1d16d, 0x1d172},
  {0x1d17b, 0x1d182}, {0x1d185, 0x1d18b}, {0x1d1aa, 0x1d1ad},
  {0x1d242, 0x1d244}, {0x1d400, 0x1d454}, {0x1d456, 0x1d49c},
  {0x1d49e, 0x1d49f}, {0x1d4a2, 0x1d4a2}, {0x1d4a5, 0x1d4a6},
  {0x1d4a9, 0x1d4ac}, {0x1d4ae, 0x1d4b9}, {0x1d4bb, 0x1d4bb},
  {0x1d4bd, 0x1d4c3}, {0x1d4c5, 0x1d505}, {0x1d507, 0x1d50a},
  {0x1d50d, 0x1d514}, {0x1d516, 0x1d51c}, {0x1d51e, 0x1d539},
  {0x1d53b, 0x1d53e}, {0x1d540, 0x1d544}, {0x1d546, 0x1d546},
  {0x1d54a, 0x1d550}, {0x1d552, 0x1d6a5}, {0x1d6a8, 0x1d6c0},
  {0x1d6c2, 0x1d6da}, {0x1d6dc, 0x1d6fa}, {0x1d6fc, 0x1d714},
  {0x1d716, 0x1d734}, {0x1d736, 0x1d74e}, {0x1d750, 0x1d76e},
  {0x1d770, 0x1d788}, {0x1d78a, 0x1d7a8}, {0x1d7aa, 0x1d7c2},
  {0x1d7c4, 0x1d7cb}, {0x1d7ce, 0x1d7ff}, {0x1da00, 0x1da36},
  {0x1da3b, 0x1da6c}, {0x1da75, 0x1da75}, {0x1da84, 0x1da84},
  {0x1da9b, 0x1da9f}, {0x1daa1, 0x1daaf}, {0x1e000, 0x1e006},
  {0x1e008, 0x1e018}, {0x1e01b, 0x1e021}, {0x1e023, 0x1e024},
  {0x1e026, 0x1e02a}, {0x1e800, 0x1e8c4}, {0x1e8d0, 0x1e8d6},
  {0x1e900, 0x1e943}, {0x1e944, 0x1e94a}, {0x1e950, 0x1e959},
  {0x1ee00, 0x1ee03}, {0x1ee05, 0x1ee1f}, {0x1ee21, 0x1ee22},
  {0x1ee24, 0x1ee24}, {0x1ee27, 0x1ee27}, {0x1ee29, 0x1ee32},
  {0x1ee34, 0x1ee37}, {0x1ee39, 0x1ee39}, {0x1ee3b, 0x1ee3b},
  {0x1ee42, 0x1ee42}, {0x1ee47, 0x1ee47}, {0x1ee49, 0x1ee49},
  {0x1ee4b, 0x1ee4b}, {0x1ee4d, 0x1ee4f}, {0x1ee51, 0x1ee52},
  {0x1ee54, 0x1ee54}, {0x1ee57, 0x1ee57}, {0x1ee59, 0x1ee59},
  {0x1ee5b, 0x1ee5b}, {0x1ee5d, 0x1ee5d}, {0x1ee5f, 0x1ee5f},
  {0x1ee61, 0x1ee62}, {0x1ee64, 0x1ee64}, {0x1ee67, 0x1ee6a},
  {0x1ee6c, 0x1ee72}, {0x1ee74, 0x1ee77}, {0x1ee79, 0x1ee7c},
  {0x1ee7e, 0x1ee7e}, {0x1ee80, 0x1ee89}, {0x1ee8b, 0x1ee9b},
  {0x1eea1, 0x1eea3}, {0x1eea5, 0x1eea9}, {0x1eeab, 0x1eebb},
  {0x20000, 0x2a6d6}, {0x2a700, 0x2b734}, {0x2b740, 0x2b81d},
  {0x2b820, 0x2cea1}, {0x2f800, 0x2fa1d}, {0xe0100, 0xe01ef},
  };

const size_t ID_CONTINUE_RANGES_COUNT = 1146;

#endif  // SRC_UNICODE_TABLES_H_
