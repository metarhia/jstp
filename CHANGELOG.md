# `metarhia-jstp` changelog

## Version 0.6.6 (2017-02-20, @aqrln)

This is mostly a bugfix release. Additionally, parser performance is improved.

Notable changes:

 * **server:** clean internal structures on close
   *(Alexey Orlenko)*
   [#59](https://github.com/metarhia/JSTP/pull/59)
 * **src,build:** add missing header
   *(Mykola Bilochub)*
   [#64](https://github.com/metarhia/JSTP/pull/64)
 * **parser:** make parser single-pass
   *(Mykola Bilochub)*
   [#61](https://github.com/metarhia/JSTP/pull/61)
 * **lib:** fix behavior with util.inspect
   *(Alexey Orlenko)*
   [#72](https://github.com/metarhia/JSTP/pull/72)
 * **parser:** fix bug causing node to crash
   *(Mykola Bilochub)*
   [#75](https://github.com/metarhia/JSTP/pull/75)
 * **server:** handle connection errors before handshake
   *(Alexey Orlenko)*
   [#78](https://github.com/metarhia/JSTP/pull/78)
 * **connection:** close connection on transport error
   *(Alexey Orlenko)*
   [#78](https://github.com/metarhia/JSTP/pull/78)

All changes:

 * **server:** clean internal structures on close
   *(Alexey Orlenko)*
   [#59](https://github.com/metarhia/JSTP/pull/59)
 * **src,build:** add missing header
   *(Mykola Bilochub)*
   [#64](https://github.com/metarhia/JSTP/pull/64)
 * **src:** add curly braces in `switch` statements
   *(Mykola Bilochub)*
   [#62](https://github.com/metarhia/JSTP/pull/62)
 * **build:** fail CI if native addon build fails
   *(Alexey Orlenko)*
   [#65](https://github.com/metarhia/JSTP/pull/65)
 * **parser:** make parser single-pass
   *(Mykola Bilochub)*
   [#61](https://github.com/metarhia/JSTP/pull/61)
 * **src:** fix single-line comment spacing
   *(Mykola Bilochub)*
   [#67](https://github.com/metarhia/JSTP/pull/67)
 * **parser:** improve string parsing
   *(Mykola Bilochub)*
   [#66](https://github.com/metarhia/JSTP/pull/66)
 * **src:** fix inconsistency in empty string creation
   *(Mykola Bilochub)*
   [#70](https://github.com/metarhia/JSTP/pull/70)
 * **doc:** document protocol versioning policy
   *(Alexey Orlenko)*
   [#56](https://github.com/metarhia/JSTP/pull/56)
 * **lib:** fix behavior with util.inspect
   *(Alexey Orlenko)*
   [#72](https://github.com/metarhia/JSTP/pull/72)
 * **deps,build:** update webpack to 2.x
   *(Alexey Orlenko)*
   [#73](https://github.com/metarhia/JSTP/pull/73)
 * **build,test:** avoid unnecessary recompiling
   *(Alexey Orlenko)*
   [#74](https://github.com/metarhia/JSTP/pull/74)
 * **doc:** update badges in README.md and doc/index.md
   *(Alexey Orlenko)*
   [#71](https://github.com/metarhia/JSTP/pull/71)
 * **parser:** fix bug causing node to crash
   *(Mykola Bilochub)*
   [#75](https://github.com/metarhia/JSTP/pull/75)
 * **tools:** automate the release preparation
   *(Alexey Orlenko)*
   [#77](https://github.com/metarhia/JSTP/pull/77)
 * **server:** handle connection errors before handshake
   *(Alexey Orlenko)*
   [#78](https://github.com/metarhia/JSTP/pull/78)
 * **connection:** close connection on transport error
   *(Alexey Orlenko)*
   [#78](https://github.com/metarhia/JSTP/pull/78)
