# `@metarhia/jstp` changelog

## Version 2.1.0 (2018-10-02, @belochub)

This release fixes and improves WebSocket transport.

All changes:

 * **ws,server:** fix server crash
   *(Mykola Bilochub)*
   [#380](https://github.com/metarhia/jstp/pull/380)
 * **test:** add regression test for GH-380
   *(Alexey Orlenko)*
   [#380](https://github.com/metarhia/jstp/pull/380)
 * **deps,lint:** update eslint-config-metarhia
   *(Mykola Bilochub)*
   [#382](https://github.com/metarhia/jstp/pull/382)
 * **ws,server:** change max frame and message size
   *(Mykola Bilochub)*
   [#383](https://github.com/metarhia/jstp/pull/383)
   **\[semver-minor\]**

## Version 2.0.1 (2018-09-05, @belochub)

This release fixes UMD browser build and updates links in README.

All changes:

 * **doc:** update package name in documentation
   *(Mykola Bilochub)*
   [#376](https://github.com/metarhia/jstp/pull/376)
 * **build:** tell Babel parser the correct source type
   *(Alexey Orlenko)*
   [#378](https://github.com/metarhia/jstp/pull/378)

## Version 2.0.0 (2018-08-30, @belochub)

Next major release of the package marks the addition of built-in reconnection
functionality, using UMD for browser bundle, support for asynchronous
SessionStorageProviders, support for custom logging on client-side and support
for custom authentication errors. CLI was also updated to support some of the
features above. Reconnection is enabled by default and uses the binary
exponential backoff algorithm; this is considered a breaking change.

The other breaking change is decoupling of the parser and serializer into the
separate package: <https://github.com/metarhia/mdsf>. This means that methods
`parse()`, `stringify()` and `parseNetworkMessages()` are no longer available
as part of the jstp package.

Starting with this release `metarhia-jstp` is being moved into the @metarhia
organization on npm, the new name of the package is `@metarhia/jstp`.

Notable changes:

 * **lib:** add support for async SessionStorageProvider
   *(Mykola Bilochub)*
   [#323](https://github.com/metarhia/jstp/pull/323)
   **\[semver-minor\]**
 * **lib:** realize reconnection by transport replacement
   *(Mykola Bilochub)*
   [#332](https://github.com/metarhia/jstp/pull/332)
   **\[semver-major\]**
 * **server:** enable returning errors from authPolicy
   *(Igor Gorodetskyy)*
   [#342](https://github.com/metarhia/jstp/pull/342)
   **\[semver-minor\]**
 * **lib:** add utility for call messages resending
   *(Mykola Bilochub)*
   [#320](https://github.com/metarhia/jstp/pull/320)
   **\[semver-minor\]**
 * **connection:** enable custom logging on client
   *(Mykola Bilochub)*
   [#354](https://github.com/metarhia/jstp/pull/354)
 * **build:** use UMD for browser bundle
   *(Alexey Orlenko)*
   [#355](https://github.com/metarhia/jstp/pull/355)
   **\[semver-minor\]**
 * **lib,build:** use Web Crypto API in browser
   *(Mykola Bilochub)*
   [#360](https://github.com/metarhia/jstp/pull/360)
 * **serde:** remove serde implementation and use mdsf
   *(Mykola Bilochub)*
   [#367](https://github.com/metarhia/jstp/pull/367)
   **\[semver-major\]**
 * **cli:** use new jstp features
   *(Dmytro Nechai)*
   [#366](https://github.com/metarhia/jstp/pull/366)

All changes:

 * **lib:** add support for async SessionStorageProvider
   *(Mykola Bilochub)*
   [#323](https://github.com/metarhia/jstp/pull/323)
   **\[semver-minor\]**
 * **lib:** add required functionality to common
   *(Mykola Bilochub)*
   [#332](https://github.com/metarhia/jstp/pull/332)
   **\[semver-minor\]**
 * **lib:** realize reconnection by transport replacement
   *(Mykola Bilochub)*
   [#332](https://github.com/metarhia/jstp/pull/332)
   **\[semver-major\]**
 * **test:** add tests for reconnection
   *(Dmytro Nechai)*
   [#335](https://github.com/metarhia/jstp/pull/335)
 * **server:** enable returning errors from authPolicy
   *(Igor Gorodetskyy)*
   [#342](https://github.com/metarhia/jstp/pull/342)
   **\[semver-minor\]**
 * **meta:** update AUTHORS
   *(Mykola Bilochub)*
   [#343](https://github.com/metarhia/jstp/pull/343)
 * **connection:** fix reconnect throwing in some cases
   *(Mykola Bilochub)*
   [#345](https://github.com/metarhia/jstp/pull/345)
 * **server:** fix call to async sessionStorageProvider
   *(Mykola Bilochub)*
   [#346](https://github.com/metarhia/jstp/pull/346)
 * **test:** increase timeout for heartbeat test to end
   *(Dmytro Nechai)*
   [#347](https://github.com/metarhia/jstp/pull/347)
 * **dist:** remove tern configuration file
   *(Mykola Bilochub)*
   [#351](https://github.com/metarhia/jstp/pull/351)
 * **dist:** remove bitHound configuration file
   *(Mykola Bilochub)*
   [#350](https://github.com/metarhia/jstp/pull/350)
 * **test:** fix flaky session test
   *(Dmytro Nechai)*
   [#352](https://github.com/metarhia/jstp/pull/352)
 * **lib:** add utility for call messages resending
   *(Mykola Bilochub)*
   [#320](https://github.com/metarhia/jstp/pull/320)
   **\[semver-minor\]**
 * **connection:** enable custom logging on client
   *(Mykola Bilochub)*
   [#354](https://github.com/metarhia/jstp/pull/354)
 * **deps,lint:** update eslint config
   *(Dmytro Nechai)*
   [#353](https://github.com/metarhia/jstp/pull/353)
 * **build:** use UMD for browser bundle
   *(Alexey Orlenko)*
   [#355](https://github.com/metarhia/jstp/pull/355)
   **\[semver-minor\]**
 * **test:** update Travis config to use the current Node
   *(Mykola Bilochub)*
   [#356](https://github.com/metarhia/jstp/pull/356)
 * **test:** add tests for SimpleSessionStorageProvider
   *(Dmytro Nechai)*
   [#358](https://github.com/metarhia/jstp/pull/358)
 * **test:** add a missing regression test for GH-329
   *(Alexey Orlenko)*
   [#359](https://github.com/metarhia/jstp/pull/359)
 * **build:** shorten npm error logs when build fails
   *(Alexey Orlenko)*
   [#362](https://github.com/metarhia/jstp/pull/362)
 * **lib,build:** use Web Crypto API in browser
   *(Mykola Bilochub)*
   [#360](https://github.com/metarhia/jstp/pull/360)
 * **npm:** add development related files to .npmignore
   *(Mykola Bilochub)*
   [#364](https://github.com/metarhia/jstp/pull/364)
 * **test:** fix typos s/recieve/receive
   *(Denys Otrishko)*
   [#365](https://github.com/metarhia/jstp/pull/365)
 * **test:** fix flaky tests
   *(Dmytro Nechai)*
   [#363](https://github.com/metarhia/jstp/pull/363)
 * **lib:** fix resendable calls being sent twice
   *(Mykola Bilochub)*
   [#369](https://github.com/metarhia/jstp/pull/369)
 * **test:** add test for async sessionStorageProvider
   *(Dmytro Nechai)*
   [#370](https://github.com/metarhia/jstp/pull/370)
 * **test:** simplify resendable call tests
   *(Dmytro Nechai)*
   [#368](https://github.com/metarhia/jstp/pull/368)
 * **serde:** remove serde implementation and use mdsf
   *(Mykola Bilochub)*
   [#367](https://github.com/metarhia/jstp/pull/367)
   **\[semver-major\]**
 * **cli:** use new jstp features
   *(Dmytro Nechai)*
   [#366](https://github.com/metarhia/jstp/pull/366)
 * **deps,lint:** update eslint-config-metarhia
   *(Mykola Bilochub)*
   [#371](https://github.com/metarhia/jstp/pull/371)
 * **deps:** update dependencies
   *(Mykola Bilochub)*
   [#372](https://github.com/metarhia/jstp/pull/372)
 * **deps:** update babel and webpack
   *(Mykola Bilochub)*
   [#373](https://github.com/metarhia/jstp/pull/373)
 * **build:** deduplicate Babel helpers
   *(Alexey Orlenko)*
   [#374](https://github.com/metarhia/jstp/pull/374)

## Version 1.1.1 (2018-06-09, @belochub)

This is a bugfix release.

Notable changes:

 * **lib:** add missing callback call
   *(Mykola Bilochub)*
   [#329](https://github.com/metarhia/jstp/pull/329)
 * **deps:** update dependencies
   *(Mykola Bilochub)*
   [#331](https://github.com/metarhia/jstp/pull/331)
 * **doc,deps:** remove gitbook dependency
   *(Mykola Bilochub)*
   [#336](https://github.com/metarhia/jstp/pull/336)
 * **deps:** update dependencies
   *(Mykola Bilochub)*
   [#337](https://github.com/metarhia/jstp/pull/337)
 * **connection:** fix incorrect client-side message IDs
   *(Mykola Bilochub)*
   [#339](https://github.com/metarhia/jstp/pull/339)

All changes:

 * **connection:** use Map for storing callbacks
   *(Mykola Bilochub)*
   [#319](https://github.com/metarhia/jstp/pull/319)
 * **test:** remove obsolete lines
   *(Dmytro Nechai)*
   [#321](https://github.com/metarhia/jstp/pull/321)
 * **test:** run node tests in parallel
   *(Dmytro Nechai)*
   [#322](https://github.com/metarhia/jstp/pull/322)
 * **build:** fix native addon building on AppVeyor
   *(Mykola Bilochub)*
   [#324](https://github.com/metarhia/jstp/pull/324)
 * **build:** fail CI if native addon build fails
   *(Dmytro Nechai)*
   [#325](https://github.com/metarhia/jstp/pull/325)
 * **test:** fix `connection-emit-actions` test
   *(Dmytro Nechai)*
   [#326](https://github.com/metarhia/jstp/pull/326)
 * **doc:** fix invalid documentation
   *(Dmytro Nechai)*
   [#328](https://github.com/metarhia/jstp/pull/328)
 * **lib:** add missing callback call
   *(Mykola Bilochub)*
   [#329](https://github.com/metarhia/jstp/pull/329)
 * **deps:** update dependencies
   *(Mykola Bilochub)*
   [#331](https://github.com/metarhia/jstp/pull/331)
 * **test:** fix AppVeyor builds on Node.js 6
   *(Mykola Bilochub)*
   [#334](https://github.com/metarhia/jstp/pull/334)
 * **doc,deps:** remove gitbook dependency
   *(Mykola Bilochub)*
   [#336](https://github.com/metarhia/jstp/pull/336)
 * **deps:** update dependencies
   *(Mykola Bilochub)*
   [#337](https://github.com/metarhia/jstp/pull/337)
 * **doc:** add AppVeyor and Coveralls badges to README
   *(Alexey Orlenko)*
   [#338](https://github.com/metarhia/jstp/pull/338)
 * **connection:** fix incorrect client-side message IDs
   *(Mykola Bilochub)*
   [#339](https://github.com/metarhia/jstp/pull/339)

## Version 1.1.0 (2018-01-30, @belochub)

This is mostly a bugfix release. Additionally, events for logging are
emitted on the server now.

Notable changes:

 * **connection:** fix remoteAddress being undefined
   *(Mykola Bilochub)*
   [#313](https://github.com/metarhia/jstp/pull/313)
 * **lib:** emit logging info from connection on a server
   *(Dmytro Nechai)*
   [#312](https://github.com/metarhia/jstp/pull/312)
   **\[semver-minor\]**
 * **connection:** reject invalid event message
   *(Mykola Bilochub)*
   [#315](https://github.com/metarhia/jstp/pull/315)

All changes:

 * **connection:** fix remoteAddress being undefined
   *(Mykola Bilochub)*
   [#313](https://github.com/metarhia/jstp/pull/313)
 * **meta:** update year in LICENSE
   *(Mykola Bilochub)*
   [#314](https://github.com/metarhia/jstp/pull/314)
 * **lib:** emit logging info from connection on a server
   *(Dmytro Nechai)*
   [#312](https://github.com/metarhia/jstp/pull/312)
   **\[semver-minor\]**
 * **connection:** reject invalid event message
   *(Mykola Bilochub)*
   [#315](https://github.com/metarhia/jstp/pull/315)
 * **lib:** fix incorrect comment
   *(Mykola Bilochub)*
   [#316](https://github.com/metarhia/jstp/pull/316)
 * **server:** fix comment explaining authPolicy argument
   *(Mykola Bilochub)*
   [#317](https://github.com/metarhia/jstp/pull/317)

## Version 1.0.0 (2018-01-22, @belochub)

This is a new and shiny first major release for `metarhia-jstp`.
Changes include API refactoring and improvements, implementations of
CLI, sessions, and application versions, native addon build optimizations,
lots of bug fixes, test coverage increase, and other, less notable changes.

This release also denotes the bump of the protocol version to v1.0.
The only difference from the previous version of the protocol is that
"old" heartbeat messages (`{}`) are now deprecated and `ping`/`pong`
messages must be used for this purpose instead.

Notable changes:

 * **src,build:** improve the native module subsystem
   *(Alexey Orlenko)*
   [#36](https://github.com/metarhia/JSTP/pull/36)
   **\[semver-minor\]**
 * **build:** compile in ISO C++11 mode
   *(Alexey Orlenko)*
   [#37](https://github.com/metarhia/JSTP/pull/37)
   **\[semver-minor\]**
 * **build:** improve error handling
   *(Alexey Orlenko)*
   [#40](https://github.com/metarhia/JSTP/pull/40)
   **\[semver-minor\]**
 * **lib:** refactor record-serialization.js
   *(Alexey Orlenko)*
   [#41](https://github.com/metarhia/JSTP/pull/41)
 * **parser:** fix a possible memory leak
   *(Alexey Orlenko)*
   [#44](https://github.com/metarhia/JSTP/pull/44)
   **\[semver-minor\]**
 * **protocol:** change the format of handshake packets
   *(Alexey Orlenko)*
   [#54](https://github.com/metarhia/JSTP/pull/54)
   **\[semver-major\]**
 * **parser:** make parser single-pass
   *(Mykola Bilochub)*
   [#61](https://github.com/metarhia/JSTP/pull/61)
 * **parser:** remove special case for '\0' literal
   *(Mykola Bilochub)*
   [#68](https://github.com/metarhia/JSTP/pull/68)
   **\[semver-major\]**
 * **parser:** fix bug causing node to crash
   *(Mykola Bilochub)*
   [#75](https://github.com/metarhia/JSTP/pull/75)
 * **client:** drop redundant callback argument
   *(Alexey Orlenko)*
   [#104](https://github.com/metarhia/JSTP/pull/104)
   **\[semver-major\]**
 * **client:** handle errors in connectAndInspect
   *(Alexey Orlenko)*
   [#105](https://github.com/metarhia/JSTP/pull/105)
   **\[semver-major\]**
 * **socket,ws:** use socket.destroy() properly
   *(Alexey Orlenko)*
   [#84](https://github.com/metarhia/JSTP/pull/84)
   **\[semver-major\]**
 * **cli:** add basic implementation
   *(Mykola Bilochub)*
   [#107](https://github.com/metarhia/JSTP/pull/107)
   **\[semver-minor\]**
 * **connection:** fix error handling in optional cbs
   *(Alexey Orlenko)*
   [#147](https://github.com/metarhia/JSTP/pull/147)
   **\[semver-major\]**
 * **test:** add JSON5 specs test suite
   *(Alexey Orlenko)*
   [#158](https://github.com/metarhia/JSTP/pull/158)
 * **lib:** change event signature
   *(Denys Otrishko)*
   [#187](https://github.com/metarhia/jstp/pull/187)
   **\[semver-major\]**
 * **lib:** add address method to Server
   *(Denys Otrishko)*
   [#190](https://github.com/metarhia/jstp/pull/190)
   **\[semver-minor\]**
 * **parser:** implement NaN and Infinity parsing
   *(Mykola Bilochub)*
   [#201](https://github.com/metarhia/jstp/pull/201)
 * **parser:** improve string parsing performance
   *(Mykola Bilochub)*
   [#220](https://github.com/metarhia/jstp/pull/220)
 * **lib:** optimize connection events
   *(Denys Otrishko)*
   [#222](https://github.com/metarhia/jstp/pull/222)
   **\[semver-major\]**
 * **lib:** refactor server and client API
   *(Denys Otrishko)*
   [#209](https://github.com/metarhia/jstp/pull/209)
   **\[semver-major\]**
 * **lib,src:** rename term packet usages to message
   *(Denys Otrishko)*
   [#270](https://github.com/metarhia/jstp/pull/270)
   **\[semver-major\]**
 * **lib:** emit events about connection messages
   *(Denys Otrishko)*
   [#252](https://github.com/metarhia/jstp/pull/252)
   **\[semver-minor\]**
 * **lib:** implement API versioning
   *(Denys Otrishko)*
   [#231](https://github.com/metarhia/jstp/pull/231)
   **\[semver-minor\]**
 * **lib:** allow to set event handlers in application
   *(Denys Otrishko)*
   [#286](https://github.com/metarhia/jstp/pull/286)
   **\[semver-minor\]**
 * **lib:** allow to broadcast events from server
   *(Denys Otrishko)*
   [#287](https://github.com/metarhia/jstp/pull/287)
   **\[semver-minor\]**
 * **connection:** make callback method private
   *(Alexey Orlenko)*
   [#306](https://github.com/metarhia/jstp/pull/306)
   **\[semver-major\]**
 * **lib:** implement sessions
   *(Mykola Bilochub)*
   [#289](https://github.com/metarhia/jstp/pull/289)
   **\[semver-major\]**
 * **connection:** use ping-pong instead of heartbeat
   *(Dmytro Nechai)*
   [#303](https://github.com/metarhia/jstp/pull/303)
   **\[semver-major\]**

All changes:

 * **src,build:** improve the native module subsystem
   *(Alexey Orlenko)*
   [#36](https://github.com/metarhia/JSTP/pull/36)
   **\[semver-minor\]**
 * **build:** compile in ISO C++11 mode
   *(Alexey Orlenko)*
   [#37](https://github.com/metarhia/JSTP/pull/37)
   **\[semver-minor\]**
 * **build:** improve error handling
   *(Alexey Orlenko)*
   [#40](https://github.com/metarhia/JSTP/pull/40)
   **\[semver-minor\]**
 * **lib:** refactor record-serialization.js
   *(Alexey Orlenko)*
   [#41](https://github.com/metarhia/JSTP/pull/41)
   **\[semver-minor\]**
 * **doc:** document versioning policy
   *(Alexey Orlenko)*
   [#42](https://github.com/metarhia/JSTP/pull/42)
 * **doc:** fix mistyped repository name
   *(Alexey Orlenko)*
   [#45](https://github.com/metarhia/JSTP/pull/45)
 * **parser:** fix a possible memory leak
   *(Alexey Orlenko)*
   [#44](https://github.com/metarhia/JSTP/pull/44)
 * **test:** add Node.js 7.5 to .travis.yml
   *(Alexey Orlenko)*
   [#47](https://github.com/metarhia/JSTP/pull/47)
 * **test:** fix typos in connection.test.js
   *(Alexey Orlenko)*
   [#51](https://github.com/metarhia/JSTP/pull/51)
 * **doc:** fix a typo in protocol.md
   *(Alexey Orlenko)*
   [#55](https://github.com/metarhia/JSTP/pull/55)
 * **connection:** handle optional callbacks properly
   *(Alexey Orlenko)*
   [#52](https://github.com/metarhia/JSTP/pull/52)
 * **protocol:** change the format of handshake packets
   *(Alexey Orlenko)*
   [#54](https://github.com/metarhia/JSTP/pull/54)
   **\[semver-major\]**
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
 * **parser:** remove special case for '\0' literal
   *(Mykola Bilochub)*
   [#68](https://github.com/metarhia/JSTP/pull/68)
   **\[semver-major\]**
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
 * **doc:** fix linter warning in CHANGELOG.md
   *(Alexey Orlenko)*
   [#80](https://github.com/metarhia/JSTP/pull/80)
 * **tools:** remove crlf.js from dot-ignore files
   *(Alexey Orlenko)*
   [#83](https://github.com/metarhia/JSTP/pull/83)
 * **npm:** don't include doc/ and mkdocs.yml to package
   *(Alexey Orlenko)*
   [#82](https://github.com/metarhia/JSTP/pull/82)
 * **doc:** add session WG meeting
   *(Mykola Bilochub)*
   [#81](https://github.com/metarhia/JSTP/pull/81)
 * **lint:** update remark
   *(Alexey Orlenko)*
   [#87](https://github.com/metarhia/JSTP/pull/87)
 * **test:** add Node.js 6.10 and 7.6 to .travis.yml
   *(Alexey Orlenko)*
   [#86](https://github.com/metarhia/JSTP/pull/86)
 * **tools:** move build-native.js to tools
   *(Alexey Orlenko)*
   [#89](https://github.com/metarhia/JSTP/pull/89)
 * **lib:** make failed addon loading more informative
   *(Alexey Orlenko)*
   [#90](https://github.com/metarhia/JSTP/pull/90)
 * **w3c-ws:** emit missing error event
   *(Alexey Orlenko)*
   [#93](https://github.com/metarhia/JSTP/pull/93)
 * **w3c-ws:** fix invalid property access
   *(Alexey Orlenko)*
   [#94](https://github.com/metarhia/JSTP/pull/94)
 * **test:** add Node.js 7.7 to .travis.yml
   *(Alexey Orlenko)*
   [#95](https://github.com/metarhia/JSTP/pull/95)
 * **connection:** change style of a forward declaration
   *(Alexey Orlenko)*
   [#96](https://github.com/metarhia/JSTP/pull/96)
 * **lib:** change multiline function signatures style
   *(Alexey Orlenko)*
   [#97](https://github.com/metarhia/JSTP/pull/97)
 * **tools:** generate authors list automatically
   *(Alexey Orlenko)*
   [#88](https://github.com/metarhia/JSTP/pull/88)
 * **meta:** update AUTHORS and .mailmap
   *(Alexey Orlenko)*
   [#88](https://github.com/metarhia/JSTP/pull/88)
 * **meta:** fix misleading language in LICENSE
   *(Alexey Orlenko)*
   [#88](https://github.com/metarhia/JSTP/pull/88)
 * **connection:** check that method arguments exist
   *(Alexey Orlenko)*
   [#100](https://github.com/metarhia/JSTP/pull/100)
 * **src:** fix incorrect indentation in CodePointToUtf8
   *(Alexey Orlenko)*
   [#103](https://github.com/metarhia/JSTP/pull/103)
 * **client:** drop redundant callback argument
   *(Alexey Orlenko)*
   [#104](https://github.com/metarhia/JSTP/pull/104)
   **\[semver-major\]**
 * **client:** handle errors in connectAndInspect
   *(Alexey Orlenko)*
   [#105](https://github.com/metarhia/JSTP/pull/105)
   **\[semver-major\]**
 * **socket,ws:** use socket.destroy() properly
   *(Alexey Orlenko)*
   [#84](https://github.com/metarhia/JSTP/pull/84)
   **\[semver-major\]**
 * **test:** add Node.js 7.8 to .travis.yml
   *(Alexey Orlenko)*
   [#119](https://github.com/metarhia/JSTP/pull/119)
 * **lint:** add arrow-parens rule to eslint
   *(Denys Otrishko)*
   [#122](https://github.com/metarhia/JSTP/pull/122)
 * **meta:** update AUTHORS
   *(Alexey Orlenko)*
   [#123](https://github.com/metarhia/JSTP/pull/123)
 * **cli:** add basic implementation
   *(Mykola Bilochub)*
   [#107](https://github.com/metarhia/JSTP/pull/107)
   **\[semver-minor\]**
 * **cli:** refactor code and fix bugs
   *(Denys Otrishko)*
   [#107](https://github.com/metarhia/JSTP/pull/107)
   **\[semver-minor\]**
 * **cli:** add 'exit' command
   *(Denys Otrishko)*
   [#107](https://github.com/metarhia/JSTP/pull/107)
   **\[semver-minor\]**
 * **cli:** add server events support
   *(Mykola Bilochub)*
   [#107](https://github.com/metarhia/JSTP/pull/107)
   **\[semver-minor\]**
 * **cli:** display async results properly
   *(Denys Otrishko)*
   [#107](https://github.com/metarhia/JSTP/pull/107)
   **\[semver-minor\]**
 * **cli:** fix stylistic mistakes
   *(Denys Otrishko)*
   [#107](https://github.com/metarhia/JSTP/pull/107)
   **\[semver-minor\]**
 * **cli:** modify `_split` behaviour
   *(Mykola Bilochub)*
   [#107](https://github.com/metarhia/JSTP/pull/107)
   **\[semver-minor\]**
 * **cli:** move cli.js to tools and make it executable
   *(Alexey Orlenko)*
   [#107](https://github.com/metarhia/JSTP/pull/107)
   **\[semver-minor\]**
 * **cli:** fix prompt display bug
   *(Denys Otrishko)*
   [#107](https://github.com/metarhia/JSTP/pull/107)
   **\[semver-minor\]**
 * **cli:** fix 'disconnect' error handling bug
   *(Denys Otrishko)*
   [#107](https://github.com/metarhia/JSTP/pull/107)
   **\[semver-minor\]**
 * **test:** add Node.js 7.9 and 7.10 to .travis.yml
   *(Alexey Orlenko)*
   [#124](https://github.com/metarhia/JSTP/pull/124)
 * **tcp:** fix URL parsing in client creation
   *(Mykola Bilochub)*
   [#128](https://github.com/metarhia/JSTP/pull/128)
 * **cli:** fix jstp import statement
   *(Denys Otrishko)*
   [#130](https://github.com/metarhia/JSTP/pull/130)
 * **lint:** add import/no-unresolved ESLint rule
   *(Alexey Orlenko)*
   [#133](https://github.com/metarhia/JSTP/pull/133)
 * **cli:** modify split behaviour
   *(Denys Otrishko)*
   [#132](https://github.com/metarhia/JSTP/pull/132)
 * **cli:** implement autocompletion for cli commands
   *(Denys Otrishko)*
   [#132](https://github.com/metarhia/JSTP/pull/132)
 * **cli:** refine error messages
   *(Denys Otrishko)*
   [#135](https://github.com/metarhia/JSTP/pull/135)
 * **cli:** avoid crashing on incorrect user input
   *(Mykola Bilochub)*
   [#137](https://github.com/metarhia/JSTP/pull/137)
 * **ws:** fix emitting error when callback is provided
   *(Mykola Bilochub)*
   [#136](https://github.com/metarhia/JSTP/pull/136)
 * **cli:** support different transports for connection
   *(Mykola Bilochub)*
   [#138](https://github.com/metarhia/JSTP/pull/138)
 * **cli:** fix cli autocompletion
   *(Denys Otrishko)*
   [#140](https://github.com/metarhia/JSTP/pull/140)
 * **parser:** fix '[' being parsed as an empty array
   *(Mykola Bilochub)*
   [#144](https://github.com/metarhia/JSTP/pull/144)
 * **parser:** fix exceptions being ignored
   *(Mykola Bilochub)*
   [#143](https://github.com/metarhia/JSTP/pull/143)
 * **cli:** simplify cli autocompletion
   *(Denys Otrishko)*
   [#150](https://github.com/metarhia/JSTP/pull/150)
 * **test:** migrate serde tests to tap
   *(Dmytro Nechai)*
   [#153](https://github.com/metarhia/JSTP/pull/153)
 * **meta:** update AUTHORS
   *(Alexey Orlenko)*
   [#156](https://github.com/metarhia/JSTP/pull/156)
 * **test:** fix naming issues in serde test cases
   *(Dmytro Nechai)*
   [#161](https://github.com/metarhia/JSTP/pull/161)
 * **connection:** fix error handling in optional cbs
   *(Alexey Orlenko)*
   [#147](https://github.com/metarhia/JSTP/pull/147)
   **\[semver-major\]**
 * **test:** add JSON5 specs test suite
   *(Alexey Orlenko)*
   [#158](https://github.com/metarhia/JSTP/pull/158)
 * **doc:** modernize README.md and add CoC
   *(Alexey Orlenko)*
   [#166](https://github.com/metarhia/JSTP/pull/166)
 * **cli:** add method autocompletion
   *(Denys Otrishko)*
   [#141](https://github.com/metarhia/JSTP/pull/141)
 * **doc:** add notes for the 2017-04-11 meeting
   *(Alexey Orlenko)*
   [#165](https://github.com/metarhia/JSTP/pull/165)
 * **npm:** don't publish tests in the npm package
   *(Alexey Orlenko)*
   [#159](https://github.com/metarhia/JSTP/pull/159)
 * **test:** refactor serde tests a bit
   *(Dmytro Nechai)*
   [#169](https://github.com/metarhia/JSTP/pull/169)
 * **test:** migrate message parser tests to tap
   *(Dmytro Nechai)*
   [#168](https://github.com/metarhia/JSTP/pull/168)
 * **test:** fix using incorrect field in serde tests
   *(Mykola Bilochub)*
   [#172](https://github.com/metarhia/JSTP/pull/172)
 * **parser:** fix not throwing error in some cases
   *(Mykola Bilochub)*
   [#171](https://github.com/metarhia/JSTP/pull/171)
 * **lib, test:** remove JSOS
   *(Dmytro Nechai)*
   [#170](https://github.com/metarhia/JSTP/pull/170)
 * **cli:** fix crush on event reception
   *(Mykola Bilochub)*
   [#173](https://github.com/metarhia/JSTP/pull/173)
 * **cli:** fix crash on socket errors
   *(Mykola Bilochub)*
   [#174](https://github.com/metarhia/jstp/pull/174)
 * **doc:** update links to JSTP repos
   *(Alexey Orlenko)*
   [#177](https://github.com/metarhia/jstp/pull/177)
 * **test:** migrate remoteError tests to tap
   *(Dmytro Nechai)*
   [#167](https://github.com/metarhia/jstp/pull/167)
 * **parser:** rework error handling
   *(Mykola Bilochub)*
   [#178](https://github.com/metarhia/jstp/pull/178)
 * **parser:** disallow unterminated multiline comments
   *(Mykola Bilochub)*
   [#179](https://github.com/metarhia/jstp/pull/179)
 * **dist:** add nyc output files to dotignore files
   *(Alexey Orlenko)*
   [#180](https://github.com/metarhia/jstp/pull/180)
 * **cli:** refactor cli.js
   *(Denys Otrishko)*
   [#127](https://github.com/metarhia/jstp/pull/127)
 * **build:** run native addon build in parallel
   *(Mykola Bilochub)*
   [#185](https://github.com/metarhia/jstp/pull/185)
 * **test:** migrate common.js tests to tap
   *(Dmytro Nechai)*
   [#176](https://github.com/metarhia/jstp/pull/176)
 * **tcp:** fix listening on port 0
   *(Alexey Orlenko)*
   [#189](https://github.com/metarhia/jstp/pull/189)
 * **test:** refactor tests
   *(Dmytro Nechai)*
   [#182](https://github.com/metarhia/jstp/pull/182)
 * **tcp:** fixup "fix listening on port 0"
   *(Alexey Orlenko)*
   [#191](https://github.com/metarhia/jstp/pull/191)
 * **cli:** fix event handling
   *(Denys Otrishko)*
   [#196](https://github.com/metarhia/jstp/pull/196)
 * **lib:** change event signature
   *(Denys Otrishko)*
   [#187](https://github.com/metarhia/jstp/pull/187)
   **\[semver-major\]**
 * **deps:** update deps and add package-lock.json
   *(Alexey Orlenko)*
   [#186](https://github.com/metarhia/jstp/pull/186)
 * **lib:** add address method to Server
   *(Denys Otrishko)*
   [#190](https://github.com/metarhia/jstp/pull/190)
   **\[semver-minor\]**
 * **dist:** ignore clang autocompletion files
   *(Alexey Orlenko)*
   [#194](https://github.com/metarhia/jstp/pull/194)
 * **test:** add Node.js 8 to .travis.yml
   *(Alexey Orlenko)*
   [#195](https://github.com/metarhia/jstp/pull/195)
 * **test:** autodetect available browsers in karma
   *(Denys Otrishko)*
   [#193](https://github.com/metarhia/jstp/pull/193)
 * **tcp:** fix TLS server creation
   *(Alexey Orlenko)*
   [#197](https://github.com/metarhia/jstp/pull/197)
 * **test:** migrate handshake and server tests
   *(Dmytro Nechai)*
   [#183](https://github.com/metarhia/jstp/pull/183)
 * **doc:** update links to repos
   *(Timur Shemsedinov)*
   [#203](https://github.com/metarhia/jstp/pull/203)
 * **test:** migrate call and callback tests
   *(Dmytro Nechai)*
   [#200](https://github.com/metarhia/jstp/pull/200)
 * **test:** migrate event and remote-proxy tests
   *(Dmytro Nechai)*
   [#199](https://github.com/metarhia/jstp/pull/199)
 * **test:** migrate inspect and remote-proxy tests
   *(Dmytro Nechai)*
   [#198](https://github.com/metarhia/jstp/pull/198)
 * **doc:** fix extra spaces inside links in README.md
   *(Alexey Orlenko)*
   [#205](https://github.com/metarhia/jstp/pull/205)
 * **parser:** implement NaN and Infinity parsing
   *(Mykola Bilochub)*
   [#201](https://github.com/metarhia/jstp/pull/201)
 * **parser:** disallow empty hex, octal, binary literals
   *(Mykola Bilochub)*
   [#207](https://github.com/metarhia/jstp/pull/207)
 * **parser:** fix parsing of big integer values
   *(Mykola Bilochub)*
   [#208](https://github.com/metarhia/jstp/pull/208)
 * **cli:** fix exception on unestablished connection
   *(Denys Otrishko)*
   [#210](https://github.com/metarhia/jstp/pull/210)
 * **cli:** refactor disconnect command processor
   *(Mykola Bilochub)*
   [#212](https://github.com/metarhia/jstp/pull/212)
 * **test:** run lint first
   *(Dmytro Nechai)*
   [#215](https://github.com/metarhia/jstp/pull/215)
 * **dist:** update tap
   *(Dmytro Nechai)*
   [#214](https://github.com/metarhia/jstp/pull/214)
 * **dist:** add coverage task
   *(Dmytro Nechai)*
   [#214](https://github.com/metarhia/jstp/pull/214)
 * **test:** remove mocha and karma
   *(Dmytro Nechai)*
   [#213](https://github.com/metarhia/jstp/pull/213)
 * **dist:** rename test commands
   *(Dmytro Nechai)*
   [#213](https://github.com/metarhia/jstp/pull/213)
 * **parser:** parse noctal number literals
   *(Mykola Bilochub)*
   [#221](https://github.com/metarhia/jstp/pull/221)
 * **parser:** improve string parsing performance
   *(Mykola Bilochub)*
   [#220](https://github.com/metarhia/jstp/pull/220)
 * **parser:** allow numeric literals as object keys
   *(Mykola Bilochub)*
   [#223](https://github.com/metarhia/jstp/pull/223)
 * **test:** use lodash.isEqual instead of tap.strictSame
   *(Dmytro Nechai)*
   [#206](https://github.com/metarhia/jstp/pull/206)
 * **lib:** optimize connection events
   *(Denys Otrishko)*
   [#222](https://github.com/metarhia/jstp/pull/222)
   **\[semver-major\]**
 * **parser,tools:** parse Unicode identifiers
   *(Mykola Bilochub)*
   [#218](https://github.com/metarhia/jstp/pull/218)
 * **build:** choose the Unicode tables via env variable
   *(Alexey Orlenko)*
   [#218](https://github.com/metarhia/jstp/pull/218)
 * **lib:** refactor server and client API
   *(Denys Otrishko)*
   [#209](https://github.com/metarhia/jstp/pull/209)
   **\[semver-major\]**
 * **doc:** update examples according to the new API
   *(Denys Otrishko)*
   [#209](https://github.com/metarhia/jstp/pull/209)
   **\[semver-major\]**
 * **lib:** make `safeRequire()` return tuple
   *(Dmytro Nechai)*
   [#226](https://github.com/metarhia/jstp/pull/226)
 * **deps:** update deps and regenerate package-lock.json
   *(Alexey Orlenko)*
   [#225](https://github.com/metarhia/jstp/pull/225)
 * **deps:** update `tap`
   *(Dmytro Nechai)*
   [#227](https://github.com/metarhia/jstp/pull/227)
 * **doc:** fix indentation in README.md
   *(Denys Otrishko)*
   [#232](https://github.com/metarhia/jstp/pull/232)
 * **dist:** fix language statistics on GitHub
   *(Mykola Bilochub)*
   [#233](https://github.com/metarhia/jstp/pull/233)
 * **cli:** update cli according to api changes
   *(Denys Otrishko)*
   [#230](https://github.com/metarhia/jstp/pull/230)
 * **src:** remove native serializer
   *(Dmytro Nechai)*
   [#228](https://github.com/metarhia/jstp/pull/228)
 * **src,tools:** update Unicode version
   *(Mykola Bilochub)*
   [#234](https://github.com/metarhia/jstp/pull/234)
 * **test:** refactor fixtures for serde tests
   *(Dmytro Nechai)*
   [#236](https://github.com/metarhia/jstp/pull/236)
 * **parser:** parse Unicode escape sequences in keys
   *(Mykola Bilochub)*
   [#219](https://github.com/metarhia/jstp/pull/219)
 * **doc:** remove unused variable from README example
   *(Mykola Bilochub)*
   [#240](https://github.com/metarhia/jstp/pull/240)
 * **lib,test,tools:** fix linter errors with ESLint 4
   *(Alexey Orlenko)*
   [#242](https://github.com/metarhia/jstp/pull/242)
 * **deps:** update ESLint and eslint-plugin-import
   *(Alexey Orlenko)*
   [#242](https://github.com/metarhia/jstp/pull/242)
 * **parser:** allow uppercase letters in number literals
   *(Mykola Bilochub)*
   [#239](https://github.com/metarhia/jstp/pull/239)
 * **doc:** remove examples/data-formats
   *(Alexey Orlenko)*
   [#238](https://github.com/metarhia/jstp/pull/238)
 * **parser:** deprecate legacy octal integer literals
   *(Mykola Bilochub)*
   [#247](https://github.com/metarhia/jstp/pull/247)
 * **lib:** rewrite i-face introspection without promises
   *(Timur Shemsedinov)*
   [#245](https://github.com/metarhia/jstp/pull/245)
 * **test:** add tests for JSON5 stringify
   *(Dmytro Nechai)*
   [#237](https://github.com/metarhia/jstp/pull/237)
 * **test:** add tests for number parsing
   *(Dmytro Nechai)*
   [#241](https://github.com/metarhia/jstp/pull/241)
 * **deps:** update the dependencies and recreate lock
   *(Alexey Orlenko)*
   [#249](https://github.com/metarhia/jstp/pull/249)
 * **test:** add Node.js 6.11 and 8.1 to .travis.yml
   *(Alexey Orlenko)*
   [#248](https://github.com/metarhia/jstp/pull/248)
 * **cli:** support connections via Unix domain sockets
   *(Mykola Bilochub)*
   [#251](https://github.com/metarhia/jstp/pull/251)
 * **lib:** make the code style more consistent
   *(Timur Shemsedinov)*
   [#244](https://github.com/metarhia/jstp/pull/244)
 * **lib:** refactor return style
   *(Timur Shemsedinov)*
   [#256](https://github.com/metarhia/jstp/pull/256)
 * **test:** add handshake timeout test
   *(Dmytro Nechai)*
   [#255](https://github.com/metarhia/jstp/pull/255)
 * **lib,src:** rename record serialization to serde
   *(Dmytro Nechai)*
   [#229](https://github.com/metarhia/jstp/pull/229)
 * **lint:** add comma-dangle rule to eslint
   *(Dmytro Nechai)*
   [#257](https://github.com/metarhia/jstp/pull/257)
 * **tools:** disable history for `readline.Interface`
   *(Mykola Bilochub)*
   [#259](https://github.com/metarhia/jstp/pull/259)
 * **test:** fix race condition in connection-handshake
   *(Dmytro Nechai)*
   [#260](https://github.com/metarhia/jstp/pull/260)
 * **src:** fix building on the old gcc versions
   *(Mykola Bilochub)*
   [#264](https://github.com/metarhia/jstp/pull/264)
 * **test:** enable tests for js parser implementation
   *(Alexey Orlenko)*
   [#258](https://github.com/metarhia/jstp/pull/258)
 * **build:** fix building with Node.js 6 on macOS
   *(Alexey Orlenko)*
   [#265](https://github.com/metarhia/jstp/pull/265)
 * **test:** rewrite the Travis config
   *(Alexey Orlenko)*
   [#263](https://github.com/metarhia/jstp/pull/263)
 * **lib:** fix W3C WebSocket event forwarding
   *(Dmytro Nechai)*
   [#266](https://github.com/metarhia/jstp/pull/266)
 * **test:** add .appveyor.yml
   *(Alexey Orlenko)*
   [#261](https://github.com/metarhia/jstp/pull/261)
 * **test:** use tap's built-in todo test facilities
   *(Alexey Orlenko)*
   [#267](https://github.com/metarhia/jstp/pull/267)
 * **test:** add tests for websocket transport
   *(Dmytro Nechai)*
   [#268](https://github.com/metarhia/jstp/pull/268)
 * **dist:** add code coverage folders to .eslintignore
   *(Dmytro Nechai)*
   [#272](https://github.com/metarhia/jstp/pull/272)
 * **test:** add wss tests
   *(Dmytro Nechai)*
   [#271](https://github.com/metarhia/jstp/pull/271)
 * **lib,src:** rename term packet usages to message
   *(Denys Otrishko)*
   [#270](https://github.com/metarhia/jstp/pull/270)
   **\[semver-major\]**
 * **deps:** update devDependencies
   *(Alexey Orlenko)*
   [#275](https://github.com/metarhia/jstp/pull/275)
 * **deps:** add missing uuid dependency
   *(Alexey Orlenko)*
   [#280](https://github.com/metarhia/jstp/pull/280)
 * **doc:** fix a mistake in README.md
   *(Alexey Orlenko)*
   [#278](https://github.com/metarhia/jstp/pull/278)
 * **test:** fix a typo
   *(Dmytro Nechai)*
   [#276](https://github.com/metarhia/jstp/pull/276)
 * **bench:** add simple benchmark
   *(Dmytro Nechai)*
   [#253](https://github.com/metarhia/jstp/pull/253)
 * **lib:** emit events about connection messages
   *(Denys Otrishko)*
   [#252](https://github.com/metarhia/jstp/pull/252)
   **\[semver-minor\]**
 * **lint:** use handle-callback-err rule
   *(Alexey Orlenko)*
   [#279](https://github.com/metarhia/jstp/pull/279)
 * **lib:** implement API versioning
   *(Denys Otrishko)*
   [#231](https://github.com/metarhia/jstp/pull/231)
   **\[semver-minor\]**
 * **lib:** add handling of EAGAIN error on connection
   *(Mykola Bilochub)*
   [#281](https://github.com/metarhia/jstp/pull/281)
 * **lib:** fix server's `connect` event
   *(Mykola Bilochub)*
   [#284](https://github.com/metarhia/jstp/pull/284)
 * **lib:** disable update of messageId on callback send
   *(Mykola Bilochub)*
   [#285](https://github.com/metarhia/jstp/pull/285)
 * **test:** add transport tests
   *(Dmytro Nechai)*
   [#273](https://github.com/metarhia/jstp/pull/273)
 * **lib:** refactor server's getClients method
   *(Denys Otrishko)*
   [#288](https://github.com/metarhia/jstp/pull/288)
 * **lib:** allow to set event handlers in application
   *(Denys Otrishko)*
   [#286](https://github.com/metarhia/jstp/pull/286)
   **\[semver-minor\]**
 * **lib:** allow to broadcast events from server
   *(Denys Otrishko)*
   [#287](https://github.com/metarhia/jstp/pull/287)
   **\[semver-minor\]**
 * **server:** fix handshake timeout logic
   *(Alexey Orlenko)*
   [#290](https://github.com/metarhia/jstp/pull/290)
 * **connection:** refactor heartbeatCallback to a lambda
   *(Alexey Orlenko)*
   [#291](https://github.com/metarhia/jstp/pull/291)
 * **lib:** fix multiple calls of callback in connect
   *(Mykola Bilochub)*
   [#293](https://github.com/metarhia/jstp/pull/293)
 * **doc:** start working on new documentation
   *(Alexey Orlenko)*
   [#277](https://github.com/metarhia/jstp/pull/277)
 * **test:** rewrite ws, wss and W3C ws tests
   *(Dmytro Nechai)*
   [#295](https://github.com/metarhia/jstp/pull/295)
 * **test:** don't use tap's todo test annotation
   *(Dmytro Nechai)*
   [#299](https://github.com/metarhia/jstp/pull/299)
 * **test:** fix serialization todo test case
   *(Dmytro Nechai)*
   [#299](https://github.com/metarhia/jstp/pull/299)
 * **deps:** update dependencies
   *(Alexey Orlenko)*
   [#297](https://github.com/metarhia/jstp/pull/297)
 * **bench:** add distributed benchmark
   *(Dmytro Nechai)*
   [#292](https://github.com/metarhia/jstp/pull/292)
 * **doc:** fix linter errors in markdown files
   *(Alexey Orlenko)*
   [#301](https://github.com/metarhia/jstp/pull/301)
 * **lint:** revive markdown linting
   *(Alexey Orlenko)*
   [#301](https://github.com/metarhia/jstp/pull/301)
 * **lint,deps:** move ESLint config to separate package
   *(Alexey Orlenko)*
   [#302](https://github.com/metarhia/jstp/pull/302)
 * **lib:** refactor remoteProxy using classes
   *(Dmytro Nechai)*
   [#269](https://github.com/metarhia/jstp/pull/269)
 * **doc:** add connection API documentation
   *(Dmytro Nechai)*
   [#300](https://github.com/metarhia/jstp/pull/300)
 * **lib:** remove unnecessary spread operator
   *(Dmytro Nechai)*
   [#304](https://github.com/metarhia/jstp/pull/304)
 * **deps:** update dependencies
   *(Dmytro Nechai)*
   [#305](https://github.com/metarhia/jstp/pull/305)
 * **test:** update Travis config to use the current Node
   *(Alexey Orlenko)*
   [#307](https://github.com/metarhia/jstp/pull/307)
 * **connection:** make callback method private
   *(Alexey Orlenko)*
   [#306](https://github.com/metarhia/jstp/pull/306)
   **\[semver-major\]**
 * **server:** add a way to update API
   *(Dmytro Nechai)*
   [#309](https://github.com/metarhia/jstp/pull/309)
 * **application:** make `1.0.0` the default version
   *(Dmytro Nechai)*
   [#310](https://github.com/metarhia/jstp/pull/310)
 * **server:** add a way for updating API on connections
   *(Dmytro Nechai)*
   [#310](https://github.com/metarhia/jstp/pull/310)
 * **lib:** implement sessions
   *(Mykola Bilochub)*
   [#289](https://github.com/metarhia/jstp/pull/289)
   **\[semver-major\]**
 * **test:** add test for resending on connection drop
   *(Dmytro Nechai)*
   [#289](https://github.com/metarhia/jstp/pull/289)
   **\[semver-major\]**
 * **lib:** fix connection restore
   *(Dmytro Nechai)*
   [#289](https://github.com/metarhia/jstp/pull/289)
   **\[semver-major\]**
 * **connection:** use ping-pong instead of heartbeat
   *(Dmytro Nechai)*
   [#303](https://github.com/metarhia/jstp/pull/303)
   **\[semver-major\]**
 * **deps:** update dependencies
   *(Alexey Orlenko)*
   [#308](https://github.com/metarhia/jstp/pull/308)

## Version 0.6.8 (2017-03-03, @aqrln)

This is a tiny semver-patch release.

Notable changes:

 * **client:** handle errors in connectAndInspect
   *(Alexey Orlenko)*
   [#106](https://github.com/metarhia/JSTP/pull/106)

All changes:

 * **client:** handle errors in connectAndInspect
   *(Alexey Orlenko)*
   [#106](https://github.com/metarhia/JSTP/pull/106)
 * **src:** fix incorrect indentation in CodePointToUtf8
   *(Alexey Orlenko)*
   [#103](https://github.com/metarhia/JSTP/pull/103)
 * **test:** add Node.js 7.8 to .travis.yml
   *(Alexey Orlenko)*
   [#119](https://github.com/metarhia/JSTP/pull/119)

## Version 0.6.7 (2017-03-14, @aqrln)

This is a bugfix release.

Notable changes:

 * **lib:** make failed addon loading more informative
   *(Alexey Orlenko)*
   [#90](https://github.com/metarhia/JSTP/pull/90)
 * **w3c-ws:** emit missing error event
   *(Alexey Orlenko)*
   [#93](https://github.com/metarhia/JSTP/pull/93)
 * **w3c-ws:** fix invalid property access
   *(Alexey Orlenko)*
   [#94](https://github.com/metarhia/JSTP/pull/94)
 * **connection:** check that method arguments exist
   *(Alexey Orlenko)*
   [#100](https://github.com/metarhia/JSTP/pull/100)

All changes:

 * **doc:** fix linter warning in CHANGELOG.md
   *(Alexey Orlenko)*
   [#80](https://github.com/metarhia/JSTP/pull/80)
 * **tools:** remove crlf.js from dot-ignore files
   *(Alexey Orlenko)*
   [#83](https://github.com/metarhia/JSTP/pull/83)
 * **npm:** don't include doc/ and mkdocs.yml to package
   *(Alexey Orlenko)*
   [#82](https://github.com/metarhia/JSTP/pull/82)
 * **doc:** add session WG meeting
   *(Mykola Bilochub)*
   [#81](https://github.com/metarhia/JSTP/pull/81)
 * **lint:** update remark
   *(Alexey Orlenko)*
   [#87](https://github.com/metarhia/JSTP/pull/87)
 * **test:** add Node.js 6.10 and 7.6 to .travis.yml
   *(Alexey Orlenko)*
   [#86](https://github.com/metarhia/JSTP/pull/86)
 * **tools:** move build-native.js to tools
   *(Alexey Orlenko)*
   [#89](https://github.com/metarhia/JSTP/pull/89)
 * **lib:** make failed addon loading more informative
   *(Alexey Orlenko)*
   [#90](https://github.com/metarhia/JSTP/pull/90)
 * **w3c-ws:** emit missing error event
   *(Alexey Orlenko)*
   [#93](https://github.com/metarhia/JSTP/pull/93)
 * **w3c-ws:** fix invalid property access
   *(Alexey Orlenko)*
   [#94](https://github.com/metarhia/JSTP/pull/94)
 * **test:** add Node.js 7.7 to .travis.yml
   *(Alexey Orlenko)*
   [#95](https://github.com/metarhia/JSTP/pull/95)
 * **connection:** change style of a forward declaration
   *(Alexey Orlenko)*
   [#96](https://github.com/metarhia/JSTP/pull/96)
 * **lib:** change multiline function signatures style
   *(Alexey Orlenko)*
   [#97](https://github.com/metarhia/JSTP/pull/97)
 * **tools:** generate authors list automatically
   *(Alexey Orlenko)*
   [#88](https://github.com/metarhia/JSTP/pull/88)
 * **meta:** update AUTHORS and .mailmap
   *(Alexey Orlenko)*
   [#88](https://github.com/metarhia/JSTP/pull/88)
 * **meta:** fix misleading language in LICENSE
   *(Alexey Orlenko)*
   [#88](https://github.com/metarhia/JSTP/pull/88)
 * **connection:** check that method arguments exist
   *(Alexey Orlenko)*
   [#100](https://github.com/metarhia/JSTP/pull/100)

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

## Version 0.5.2 (2017-03-03, @aqrln)

This is a backport release that brings the most essential changes and bugfixes
from v0.6 to currently used in at least one real project v0.5.

Notable changes:

 * **parser:** fix memory leaks
   *(Alexey Orlenko)*
   [371f7dd](https://github.com/metarhia/JSTP/commit/371f7ddc79e1728a3139cfb1734aa2d11d8197e9)
 * **parser:** fix bugs in JSRS parser
   *(Alexey Orlenko)*
   [#109](https://github.com/metarhia/JSTP/pull/109)
 * **src,build:** improve the native module subsystem
   *(Alexey Orlenko)*
   [#110](https://github.com/metarhia/JSTP/pull/110)
   **\[semver-minor\]**
 * **build:** compile in ISO C++11 mode
   *(Alexey Orlenko)*
   [#37](https://github.com/metarhia/JSTP/pull/37)
   **\[semver-minor\]**
 * **parser:** fix a possible memory leak
   *(Alexey Orlenko)*
   [#44](https://github.com/metarhia/JSTP/pull/44)
 * **parser:** make parser single-pass
   *(Mykola Bilochub)*
   [#61](https://github.com/metarhia/JSTP/pull/61)
 * **parser:** improve string parsing
   *(Mykola Bilochub)*
   [#66](https://github.com/metarhia/JSTP/pull/66)
 * **parser:** fix bug causing node to crash
   *(Mykola Bilochub)*
   [#75](https://github.com/metarhia/JSTP/pull/75)
 * **connection:** check that method arguments exist
   *(Alexey Orlenko)*
   [#100](https://github.com/metarhia/JSTP/pull/100)

All changes:

 * **parser:** fix memory leaks
   *(Alexey Orlenko)*
   [371f7dd](https://github.com/metarhia/JSTP/commit/371f7ddc79e1728a3139cfb1734aa2d11d8197e9)
 * **parser:** fix bugs in JSRS parser
   *(Alexey Orlenko)*
   [#109](https://github.com/metarhia/JSTP/pull/109)
 * **parser:** fix compiler warnings
   *(Alexey Orlenko)*
   [851a2c6](https://github.com/metarhia/JSTP/commit/851a2c695ca48cc6d5f606756a54bdb571f94f59)
 * **examples:** fix inconsistency with specification
   *(Alexey Orlenko)*
   [05461bf](https://github.com/metarhia/JSTP/commit/05461bfb133e0adbb12e5db5338e9c0754213647)
 * **lint:** ignore Object Serialization examples
   *(Alexey Orlenko)*
   [94609f0](https://github.com/metarhia/JSTP/commit/94609f01e081e844fa66598ee2dea541368a733b)
 * **dist**: update LICENSE
   *(Alexey Orlenko)*
   [8c5f830](https://github.com/metarhia/JSTP/commit/8c5f83097e75a1af065e861b5453a684e33d1fc5)
 * **src:** simplify and update license boilerplates
   *(Alexey Orlenko)*
   [16b1e95](https://github.com/metarhia/JSTP/commit/16b1e9597133e85429be0cbaf3d3fe9e7ea58b15)
 * **test:** add Node.js 7.3 and 7.4 to .travis.yml
   *(Alexey Orlenko)*
   [fa722e7](https://github.com/metarhia/JSTP/commit/fa722e7ee0a36f65c985e9570d0f234503e70de4)
 * **src,build:** improve the native module subsystem
   *(Alexey Orlenko)*
   [#110](https://github.com/metarhia/JSTP/pull/110)
   **\[semver-minor\]**
 * **src,build:** add missing header
   *(Mykola Bilochub)*
   [#64](https://github.com/metarhia/JSTP/pull/64)
 * **build:** compile in ISO C++11 mode
   *(Alexey Orlenko)*
   [#37](https://github.com/metarhia/JSTP/pull/37)
   **\[semver-minor\]**
 * **doc:** document versioning policy
   *(Alexey Orlenko)*
   [#42](https://github.com/metarhia/JSTP/pull/42)
 * **parser:** fix a possible memory leak
   *(Alexey Orlenko)*
   [#44](https://github.com/metarhia/JSTP/pull/44)
 * **test:** add Node.js 7.5 to .travis.yml
   *(Alexey Orlenko)*
   [#47](https://github.com/metarhia/JSTP/pull/47)
 * **doc:** fix a typo in protocol.md
   *(Alexey Orlenko)*
   [#55](https://github.com/metarhia/JSTP/pull/55)
 * **server:** clean internal structures on close
   *(Alexey Orlenko)*
   [#59](https://github.com/metarhia/JSTP/pull/59)
 * **src:** add curly braces in `switch` statements
   *(Mykola Bilochub)*
   [#62](https://github.com/metarhia/JSTP/pull/62)
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
 * **parser:** fix bug causing node to crash
   *(Mykola Bilochub)*
   [#75](https://github.com/metarhia/JSTP/pull/75)
 * **connection:** close connection on transport error
   *(Alexey Orlenko)*
   [#78](https://github.com/metarhia/JSTP/pull/78)
 * **doc:** fix mistyped repository name
   *(Alexey Orlenko)*
   [#111](https://github.com/metarhia/JSTP/pull/111)
 * **test:** fix typos in connection.test.js
   *(Alexey Orlenko)*
   [#112](https://github.com/metarhia/JSTP/pull/112)
 * **tools:** remove crlf.js from dot-ignore files
   *(Alexey Orlenko)*
   [#83](https://github.com/metarhia/JSTP/pull/83)
 * **npm:** don't include doc/ and mkdocs.yml to package
   *(Alexey Orlenko)*
   [#82](https://github.com/metarhia/JSTP/pull/82)
 * **test:** add Node.js 6.10 and 7.6 to .travis.yml
   *(Alexey Orlenko)*
   [#86](https://github.com/metarhia/JSTP/pull/86)
 * **w3c-ws:** emit missing error event
   *(Alexey Orlenko)*
   [#93](https://github.com/metarhia/JSTP/pull/93)
 * **test:** add Node.js 7.7 to .travis.yml
   *(Alexey Orlenko)*
   [#95](https://github.com/metarhia/JSTP/pull/95)
 * **lib:** fix behavior with util.inspect
   *(Alexey Orlenko)*
   [#114](https://github.com/metarhia/JSTP/pull/114)
 * **server:** handle connection errors before handshake
   *(Alexey Orlenko)*
   [#115](https://github.com/metarhia/JSTP/pull/115)
 * **w3c-ws:** fix invalid property access
   *(Alexey Orlenko)*
   [#116](https://github.com/metarhia/JSTP/pull/116)
 * **src:** fix incorrect indentation in CodePointToUtf8
   *(Alexey Orlenko)*
   [#103](https://github.com/metarhia/JSTP/pull/103)
 * **connection:** check that method arguments exist
   *(Alexey Orlenko)*
   [#100](https://github.com/metarhia/JSTP/pull/100)
 * **meta:** update AUTHORS and .mailmap
   *(Alexey Orlenko)*
   [#117](https://github.com/metarhia/JSTP/pull/117)
 * **meta:** fix misleading language in LICENSE
   *(Alexey Orlenko)*
   [#117](https://github.com/metarhia/JSTP/pull/117)
 * **connection:** handle optional callbacks properly
   *(Alexey Orlenko)*
   [#113](https://github.com/metarhia/JSTP/pull/113)
 * **test:** add Node.js 7.8 to .travis.yml
   *(Alexey Orlenko)*
   [#119](https://github.com/metarhia/JSTP/pull/119)
 * **lint:** add bitHound config
   *(Alexey Orlenko)*
   [#120](https://github.com/metarhia/JSTP/pull/120)
 * **lib:** decouple ensureClientConnected()
   *(Alexey Orlenko)*
   [#120](https://github.com/metarhia/JSTP/pull/120)
 * **client:** handle errors in connectAndInspect
   *(Alexey Orlenko)*
   [#120](https://github.com/metarhia/JSTP/pull/120)
 * **test:** refactor RawServerMock
   *(Alexey Orlenko)*
   [#120](https://github.com/metarhia/JSTP/pull/120)
 * **deps:** update dependencies
   *(Alexey Orlenko)*
   [#120](https://github.com/metarhia/JSTP/pull/120)
