# `@metarhia/jstp` changelog

## Version 2.2.0 (2018-12-26, @belochub)

This minor version release features multiple fixes and improvements to the
client implementation and the CLI, including the addition of the persistent
history, pretty-printing, and man page. It also features a fix for a potential
WebSocket server vulnerability.

All changes:

- **lib:** move RemoteError to es6 class
  _(Denys Otrishko)_
  [#385](https://github.com/metarhia/jstp/pull/385)
- **conn:** make reconnection consistent
  _(Mykola Bilochub)_
  [#386](https://github.com/metarhia/jstp/pull/386)
- **lib:** fix unhandled error events on connection
  _(Mykola Bilochub)_
  [#389](https://github.com/metarhia/jstp/pull/389)
- **conn:** return error when handshake is not received
  _(Mykola Bilochub)_
  [#387](https://github.com/metarhia/jstp/pull/387)
  **\[semver-minor\]**
- **test:** fix invalid test
  _(Dmytro Nechai)_
  [#388](https://github.com/metarhia/jstp/pull/388)
- **cli:** add persistent history implementation
  _(Mykola Bilochub)_
  [#390](https://github.com/metarhia/jstp/pull/390)
  **\[semver-minor\]**
- **cli:** enable reconnection reporting
  _(Mykola Bilochub)_
  [#391](https://github.com/metarhia/jstp/pull/391)
  **\[semver-minor\]**
- **ws,server:** avoid forwarding 'clientError' event
  _(Mykola Bilochub)_
  [#392](https://github.com/metarhia/jstp/pull/392)
- **lib:** change the default reconnector behavior
  _(Mykola Bilochub)_
  [#393](https://github.com/metarhia/jstp/pull/393)
- **deps,lint:** update dependencies
  _(Mykola Bilochub)_
  [#394](https://github.com/metarhia/jstp/pull/394)
- **cli:** add pretty-print option
  _(Mykola Bilochub)_
  [#395](https://github.com/metarhia/jstp/pull/395)
  **\[semver-minor\]**
- **cli:** fix incorrect --verbose option behavior
  _(Mykola Bilochub)_
  [#397](https://github.com/metarhia/jstp/pull/397)
- **cli:** add --version option, print version in help
  _(Mykola Bilochub)_
  [#398](https://github.com/metarhia/jstp/pull/398)
  **\[semver-minor\]**
- **cli,doc:** add man page for jstp-cli
  _(Mykola Bilochub)_
  [#396](https://github.com/metarhia/jstp/pull/396)
  **\[semver-minor\]**
- **cli:** add --help option to the man page
  _(Mykola Bilochub)_
  [#401](https://github.com/metarhia/jstp/pull/401)
  **\[semver-minor\]**
- **doc:** add a notice about the CLI to the README.md
  _(Mykola Bilochub)_
  [#400](https://github.com/metarhia/jstp/pull/400)

## Version 2.1.0 (2018-10-02, @belochub)

This release fixes and improves WebSocket transport.

All changes:

- **ws,server:** fix server crash
  _(Mykola Bilochub)_
  [#380](https://github.com/metarhia/jstp/pull/380)
- **test:** add regression test for GH-380
  _(Alexey Orlenko)_
  [#380](https://github.com/metarhia/jstp/pull/380)
- **deps,lint:** update eslint-config-metarhia
  _(Mykola Bilochub)_
  [#382](https://github.com/metarhia/jstp/pull/382)
- **ws,server:** change max frame and message size
  _(Mykola Bilochub)_
  [#383](https://github.com/metarhia/jstp/pull/383)
  **\[semver-minor\]**

## Version 2.0.1 (2018-09-05, @belochub)

This release fixes UMD browser build and updates links in README.

All changes:

- **doc:** update package name in documentation
  _(Mykola Bilochub)_
  [#376](https://github.com/metarhia/jstp/pull/376)
- **build:** tell Babel parser the correct source type
  _(Alexey Orlenko)_
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

- **lib:** add support for async SessionStorageProvider
  _(Mykola Bilochub)_
  [#323](https://github.com/metarhia/jstp/pull/323)
  **\[semver-minor\]**
- **lib:** realize reconnection by transport replacement
  _(Mykola Bilochub)_
  [#332](https://github.com/metarhia/jstp/pull/332)
  **\[semver-major\]**
- **server:** enable returning errors from authPolicy
  _(Igor Gorodetskyy)_
  [#342](https://github.com/metarhia/jstp/pull/342)
  **\[semver-minor\]**
- **lib:** add utility for call messages resending
  _(Mykola Bilochub)_
  [#320](https://github.com/metarhia/jstp/pull/320)
  **\[semver-minor\]**
- **connection:** enable custom logging on client
  _(Mykola Bilochub)_
  [#354](https://github.com/metarhia/jstp/pull/354)
- **build:** use UMD for browser bundle
  _(Alexey Orlenko)_
  [#355](https://github.com/metarhia/jstp/pull/355)
  **\[semver-minor\]**
- **lib,build:** use Web Crypto API in browser
  _(Mykola Bilochub)_
  [#360](https://github.com/metarhia/jstp/pull/360)
- **serde:** remove serde implementation and use mdsf
  _(Mykola Bilochub)_
  [#367](https://github.com/metarhia/jstp/pull/367)
  **\[semver-major\]**
- **cli:** use new jstp features
  _(Dmytro Nechai)_
  [#366](https://github.com/metarhia/jstp/pull/366)

All changes:

- **lib:** add support for async SessionStorageProvider
  _(Mykola Bilochub)_
  [#323](https://github.com/metarhia/jstp/pull/323)
  **\[semver-minor\]**
- **lib:** add required functionality to common
  _(Mykola Bilochub)_
  [#332](https://github.com/metarhia/jstp/pull/332)
  **\[semver-minor\]**
- **lib:** realize reconnection by transport replacement
  _(Mykola Bilochub)_
  [#332](https://github.com/metarhia/jstp/pull/332)
  **\[semver-major\]**
- **test:** add tests for reconnection
  _(Dmytro Nechai)_
  [#335](https://github.com/metarhia/jstp/pull/335)
- **server:** enable returning errors from authPolicy
  _(Igor Gorodetskyy)_
  [#342](https://github.com/metarhia/jstp/pull/342)
  **\[semver-minor\]**
- **meta:** update AUTHORS
  _(Mykola Bilochub)_
  [#343](https://github.com/metarhia/jstp/pull/343)
- **connection:** fix reconnect throwing in some cases
  _(Mykola Bilochub)_
  [#345](https://github.com/metarhia/jstp/pull/345)
- **server:** fix call to async sessionStorageProvider
  _(Mykola Bilochub)_
  [#346](https://github.com/metarhia/jstp/pull/346)
- **test:** increase timeout for heartbeat test to end
  _(Dmytro Nechai)_
  [#347](https://github.com/metarhia/jstp/pull/347)
- **dist:** remove tern configuration file
  _(Mykola Bilochub)_
  [#351](https://github.com/metarhia/jstp/pull/351)
- **dist:** remove bitHound configuration file
  _(Mykola Bilochub)_
  [#350](https://github.com/metarhia/jstp/pull/350)
- **test:** fix flaky session test
  _(Dmytro Nechai)_
  [#352](https://github.com/metarhia/jstp/pull/352)
- **lib:** add utility for call messages resending
  _(Mykola Bilochub)_
  [#320](https://github.com/metarhia/jstp/pull/320)
  **\[semver-minor\]**
- **connection:** enable custom logging on client
  _(Mykola Bilochub)_
  [#354](https://github.com/metarhia/jstp/pull/354)
- **deps,lint:** update eslint config
  _(Dmytro Nechai)_
  [#353](https://github.com/metarhia/jstp/pull/353)
- **build:** use UMD for browser bundle
  _(Alexey Orlenko)_
  [#355](https://github.com/metarhia/jstp/pull/355)
  **\[semver-minor\]**
- **test:** update Travis config to use the current Node
  _(Mykola Bilochub)_
  [#356](https://github.com/metarhia/jstp/pull/356)
- **test:** add tests for SimpleSessionStorageProvider
  _(Dmytro Nechai)_
  [#358](https://github.com/metarhia/jstp/pull/358)
- **test:** add a missing regression test for GH-329
  _(Alexey Orlenko)_
  [#359](https://github.com/metarhia/jstp/pull/359)
- **build:** shorten npm error logs when build fails
  _(Alexey Orlenko)_
  [#362](https://github.com/metarhia/jstp/pull/362)
- **lib,build:** use Web Crypto API in browser
  _(Mykola Bilochub)_
  [#360](https://github.com/metarhia/jstp/pull/360)
- **npm:** add development related files to .npmignore
  _(Mykola Bilochub)_
  [#364](https://github.com/metarhia/jstp/pull/364)
- **test:** fix typos s/recieve/receive
  _(Denys Otrishko)_
  [#365](https://github.com/metarhia/jstp/pull/365)
- **test:** fix flaky tests
  _(Dmytro Nechai)_
  [#363](https://github.com/metarhia/jstp/pull/363)
- **lib:** fix resendable calls being sent twice
  _(Mykola Bilochub)_
  [#369](https://github.com/metarhia/jstp/pull/369)
- **test:** add test for async sessionStorageProvider
  _(Dmytro Nechai)_
  [#370](https://github.com/metarhia/jstp/pull/370)
- **test:** simplify resendable call tests
  _(Dmytro Nechai)_
  [#368](https://github.com/metarhia/jstp/pull/368)
- **serde:** remove serde implementation and use mdsf
  _(Mykola Bilochub)_
  [#367](https://github.com/metarhia/jstp/pull/367)
  **\[semver-major\]**
- **cli:** use new jstp features
  _(Dmytro Nechai)_
  [#366](https://github.com/metarhia/jstp/pull/366)
- **deps,lint:** update eslint-config-metarhia
  _(Mykola Bilochub)_
  [#371](https://github.com/metarhia/jstp/pull/371)
- **deps:** update dependencies
  _(Mykola Bilochub)_
  [#372](https://github.com/metarhia/jstp/pull/372)
- **deps:** update babel and webpack
  _(Mykola Bilochub)_
  [#373](https://github.com/metarhia/jstp/pull/373)
- **build:** deduplicate Babel helpers
  _(Alexey Orlenko)_
  [#374](https://github.com/metarhia/jstp/pull/374)

## Version 1.1.1 (2018-06-09, @belochub)

This is a bugfix release.

Notable changes:

- **lib:** add missing callback call
  _(Mykola Bilochub)_
  [#329](https://github.com/metarhia/jstp/pull/329)
- **deps:** update dependencies
  _(Mykola Bilochub)_
  [#331](https://github.com/metarhia/jstp/pull/331)
- **doc,deps:** remove gitbook dependency
  _(Mykola Bilochub)_
  [#336](https://github.com/metarhia/jstp/pull/336)
- **deps:** update dependencies
  _(Mykola Bilochub)_
  [#337](https://github.com/metarhia/jstp/pull/337)
- **connection:** fix incorrect client-side message IDs
  _(Mykola Bilochub)_
  [#339](https://github.com/metarhia/jstp/pull/339)

All changes:

- **connection:** use Map for storing callbacks
  _(Mykola Bilochub)_
  [#319](https://github.com/metarhia/jstp/pull/319)
- **test:** remove obsolete lines
  _(Dmytro Nechai)_
  [#321](https://github.com/metarhia/jstp/pull/321)
- **test:** run node tests in parallel
  _(Dmytro Nechai)_
  [#322](https://github.com/metarhia/jstp/pull/322)
- **build:** fix native addon building on AppVeyor
  _(Mykola Bilochub)_
  [#324](https://github.com/metarhia/jstp/pull/324)
- **build:** fail CI if native addon build fails
  _(Dmytro Nechai)_
  [#325](https://github.com/metarhia/jstp/pull/325)
- **test:** fix `connection-emit-actions` test
  _(Dmytro Nechai)_
  [#326](https://github.com/metarhia/jstp/pull/326)
- **doc:** fix invalid documentation
  _(Dmytro Nechai)_
  [#328](https://github.com/metarhia/jstp/pull/328)
- **lib:** add missing callback call
  _(Mykola Bilochub)_
  [#329](https://github.com/metarhia/jstp/pull/329)
- **deps:** update dependencies
  _(Mykola Bilochub)_
  [#331](https://github.com/metarhia/jstp/pull/331)
- **test:** fix AppVeyor builds on Node.js 6
  _(Mykola Bilochub)_
  [#334](https://github.com/metarhia/jstp/pull/334)
- **doc,deps:** remove gitbook dependency
  _(Mykola Bilochub)_
  [#336](https://github.com/metarhia/jstp/pull/336)
- **deps:** update dependencies
  _(Mykola Bilochub)_
  [#337](https://github.com/metarhia/jstp/pull/337)
- **doc:** add AppVeyor and Coveralls badges to README
  _(Alexey Orlenko)_
  [#338](https://github.com/metarhia/jstp/pull/338)
- **connection:** fix incorrect client-side message IDs
  _(Mykola Bilochub)_
  [#339](https://github.com/metarhia/jstp/pull/339)

## Version 1.1.0 (2018-01-30, @belochub)

This is mostly a bugfix release. Additionally, events for logging are
emitted on the server now.

Notable changes:

- **connection:** fix remoteAddress being undefined
  _(Mykola Bilochub)_
  [#313](https://github.com/metarhia/jstp/pull/313)
- **lib:** emit logging info from connection on a server
  _(Dmytro Nechai)_
  [#312](https://github.com/metarhia/jstp/pull/312)
  **\[semver-minor\]**
- **connection:** reject invalid event message
  _(Mykola Bilochub)_
  [#315](https://github.com/metarhia/jstp/pull/315)

All changes:

- **connection:** fix remoteAddress being undefined
  _(Mykola Bilochub)_
  [#313](https://github.com/metarhia/jstp/pull/313)
- **meta:** update year in LICENSE
  _(Mykola Bilochub)_
  [#314](https://github.com/metarhia/jstp/pull/314)
- **lib:** emit logging info from connection on a server
  _(Dmytro Nechai)_
  [#312](https://github.com/metarhia/jstp/pull/312)
  **\[semver-minor\]**
- **connection:** reject invalid event message
  _(Mykola Bilochub)_
  [#315](https://github.com/metarhia/jstp/pull/315)
- **lib:** fix incorrect comment
  _(Mykola Bilochub)_
  [#316](https://github.com/metarhia/jstp/pull/316)
- **server:** fix comment explaining authPolicy argument
  _(Mykola Bilochub)_
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

- **src,build:** improve the native module subsystem
  _(Alexey Orlenko)_
  [#36](https://github.com/metarhia/JSTP/pull/36)
  **\[semver-minor\]**
- **build:** compile in ISO C++11 mode
  _(Alexey Orlenko)_
  [#37](https://github.com/metarhia/JSTP/pull/37)
  **\[semver-minor\]**
- **build:** improve error handling
  _(Alexey Orlenko)_
  [#40](https://github.com/metarhia/JSTP/pull/40)
  **\[semver-minor\]**
- **lib:** refactor record-serialization.js
  _(Alexey Orlenko)_
  [#41](https://github.com/metarhia/JSTP/pull/41)
- **parser:** fix a possible memory leak
  _(Alexey Orlenko)_
  [#44](https://github.com/metarhia/JSTP/pull/44)
  **\[semver-minor\]**
- **protocol:** change the format of handshake packets
  _(Alexey Orlenko)_
  [#54](https://github.com/metarhia/JSTP/pull/54)
  **\[semver-major\]**
- **parser:** make parser single-pass
  _(Mykola Bilochub)_
  [#61](https://github.com/metarhia/JSTP/pull/61)
- **parser:** remove special case for '\0' literal
  _(Mykola Bilochub)_
  [#68](https://github.com/metarhia/JSTP/pull/68)
  **\[semver-major\]**
- **parser:** fix bug causing node to crash
  _(Mykola Bilochub)_
  [#75](https://github.com/metarhia/JSTP/pull/75)
- **client:** drop redundant callback argument
  _(Alexey Orlenko)_
  [#104](https://github.com/metarhia/JSTP/pull/104)
  **\[semver-major\]**
- **client:** handle errors in connectAndInspect
  _(Alexey Orlenko)_
  [#105](https://github.com/metarhia/JSTP/pull/105)
  **\[semver-major\]**
- **socket,ws:** use socket.destroy() properly
  _(Alexey Orlenko)_
  [#84](https://github.com/metarhia/JSTP/pull/84)
  **\[semver-major\]**
- **cli:** add basic implementation
  _(Mykola Bilochub)_
  [#107](https://github.com/metarhia/JSTP/pull/107)
  **\[semver-minor\]**
- **connection:** fix error handling in optional cbs
  _(Alexey Orlenko)_
  [#147](https://github.com/metarhia/JSTP/pull/147)
  **\[semver-major\]**
- **test:** add JSON5 specs test suite
  _(Alexey Orlenko)_
  [#158](https://github.com/metarhia/JSTP/pull/158)
- **lib:** change event signature
  _(Denys Otrishko)_
  [#187](https://github.com/metarhia/jstp/pull/187)
  **\[semver-major\]**
- **lib:** add address method to Server
  _(Denys Otrishko)_
  [#190](https://github.com/metarhia/jstp/pull/190)
  **\[semver-minor\]**
- **parser:** implement NaN and Infinity parsing
  _(Mykola Bilochub)_
  [#201](https://github.com/metarhia/jstp/pull/201)
- **parser:** improve string parsing performance
  _(Mykola Bilochub)_
  [#220](https://github.com/metarhia/jstp/pull/220)
- **lib:** optimize connection events
  _(Denys Otrishko)_
  [#222](https://github.com/metarhia/jstp/pull/222)
  **\[semver-major\]**
- **lib:** refactor server and client API
  _(Denys Otrishko)_
  [#209](https://github.com/metarhia/jstp/pull/209)
  **\[semver-major\]**
- **lib,src:** rename term packet usages to message
  _(Denys Otrishko)_
  [#270](https://github.com/metarhia/jstp/pull/270)
  **\[semver-major\]**
- **lib:** emit events about connection messages
  _(Denys Otrishko)_
  [#252](https://github.com/metarhia/jstp/pull/252)
  **\[semver-minor\]**
- **lib:** implement API versioning
  _(Denys Otrishko)_
  [#231](https://github.com/metarhia/jstp/pull/231)
  **\[semver-minor\]**
- **lib:** allow to set event handlers in application
  _(Denys Otrishko)_
  [#286](https://github.com/metarhia/jstp/pull/286)
  **\[semver-minor\]**
- **lib:** allow to broadcast events from server
  _(Denys Otrishko)_
  [#287](https://github.com/metarhia/jstp/pull/287)
  **\[semver-minor\]**
- **connection:** make callback method private
  _(Alexey Orlenko)_
  [#306](https://github.com/metarhia/jstp/pull/306)
  **\[semver-major\]**
- **lib:** implement sessions
  _(Mykola Bilochub)_
  [#289](https://github.com/metarhia/jstp/pull/289)
  **\[semver-major\]**
- **connection:** use ping-pong instead of heartbeat
  _(Dmytro Nechai)_
  [#303](https://github.com/metarhia/jstp/pull/303)
  **\[semver-major\]**

All changes:

- **src,build:** improve the native module subsystem
  _(Alexey Orlenko)_
  [#36](https://github.com/metarhia/JSTP/pull/36)
  **\[semver-minor\]**
- **build:** compile in ISO C++11 mode
  _(Alexey Orlenko)_
  [#37](https://github.com/metarhia/JSTP/pull/37)
  **\[semver-minor\]**
- **build:** improve error handling
  _(Alexey Orlenko)_
  [#40](https://github.com/metarhia/JSTP/pull/40)
  **\[semver-minor\]**
- **lib:** refactor record-serialization.js
  _(Alexey Orlenko)_
  [#41](https://github.com/metarhia/JSTP/pull/41)
  **\[semver-minor\]**
- **doc:** document versioning policy
  _(Alexey Orlenko)_
  [#42](https://github.com/metarhia/JSTP/pull/42)
- **doc:** fix mistyped repository name
  _(Alexey Orlenko)_
  [#45](https://github.com/metarhia/JSTP/pull/45)
- **parser:** fix a possible memory leak
  _(Alexey Orlenko)_
  [#44](https://github.com/metarhia/JSTP/pull/44)
- **test:** add Node.js 7.5 to .travis.yml
  _(Alexey Orlenko)_
  [#47](https://github.com/metarhia/JSTP/pull/47)
- **test:** fix typos in connection.test.js
  _(Alexey Orlenko)_
  [#51](https://github.com/metarhia/JSTP/pull/51)
- **doc:** fix a typo in protocol.md
  _(Alexey Orlenko)_
  [#55](https://github.com/metarhia/JSTP/pull/55)
- **connection:** handle optional callbacks properly
  _(Alexey Orlenko)_
  [#52](https://github.com/metarhia/JSTP/pull/52)
- **protocol:** change the format of handshake packets
  _(Alexey Orlenko)_
  [#54](https://github.com/metarhia/JSTP/pull/54)
  **\[semver-major\]**
- **server:** clean internal structures on close
  _(Alexey Orlenko)_
  [#59](https://github.com/metarhia/JSTP/pull/59)
- **src,build:** add missing header
  _(Mykola Bilochub)_
  [#64](https://github.com/metarhia/JSTP/pull/64)
- **src:** add curly braces in `switch` statements
  _(Mykola Bilochub)_
  [#62](https://github.com/metarhia/JSTP/pull/62)
- **build:** fail CI if native addon build fails
  _(Alexey Orlenko)_
  [#65](https://github.com/metarhia/JSTP/pull/65)
- **parser:** make parser single-pass
  _(Mykola Bilochub)_
  [#61](https://github.com/metarhia/JSTP/pull/61)
- **src:** fix single-line comment spacing
  _(Mykola Bilochub)_
  [#67](https://github.com/metarhia/JSTP/pull/67)
- **parser:** improve string parsing
  _(Mykola Bilochub)_
  [#66](https://github.com/metarhia/JSTP/pull/66)
- **parser:** remove special case for '\0' literal
  _(Mykola Bilochub)_
  [#68](https://github.com/metarhia/JSTP/pull/68)
  **\[semver-major\]**
- **src:** fix inconsistency in empty string creation
  _(Mykola Bilochub)_
  [#70](https://github.com/metarhia/JSTP/pull/70)
- **doc:** document protocol versioning policy
  _(Alexey Orlenko)_
  [#56](https://github.com/metarhia/JSTP/pull/56)
- **lib:** fix behavior with util.inspect
  _(Alexey Orlenko)_
  [#72](https://github.com/metarhia/JSTP/pull/72)
- **deps,build:** update webpack to 2.x
  _(Alexey Orlenko)_
  [#73](https://github.com/metarhia/JSTP/pull/73)
- **build,test:** avoid unnecessary recompiling
  _(Alexey Orlenko)_
  [#74](https://github.com/metarhia/JSTP/pull/74)
- **doc:** update badges in README.md and doc/index.md
  _(Alexey Orlenko)_
  [#71](https://github.com/metarhia/JSTP/pull/71)
- **parser:** fix bug causing node to crash
  _(Mykola Bilochub)_
  [#75](https://github.com/metarhia/JSTP/pull/75)
- **tools:** automate the release preparation
  _(Alexey Orlenko)_
  [#77](https://github.com/metarhia/JSTP/pull/77)
- **server:** handle connection errors before handshake
  _(Alexey Orlenko)_
  [#78](https://github.com/metarhia/JSTP/pull/78)
- **connection:** close connection on transport error
  _(Alexey Orlenko)_
  [#78](https://github.com/metarhia/JSTP/pull/78)
- **doc:** fix linter warning in CHANGELOG.md
  _(Alexey Orlenko)_
  [#80](https://github.com/metarhia/JSTP/pull/80)
- **tools:** remove crlf.js from dot-ignore files
  _(Alexey Orlenko)_
  [#83](https://github.com/metarhia/JSTP/pull/83)
- **npm:** don't include doc/ and mkdocs.yml to package
  _(Alexey Orlenko)_
  [#82](https://github.com/metarhia/JSTP/pull/82)
- **doc:** add session WG meeting
  _(Mykola Bilochub)_
  [#81](https://github.com/metarhia/JSTP/pull/81)
- **lint:** update remark
  _(Alexey Orlenko)_
  [#87](https://github.com/metarhia/JSTP/pull/87)
- **test:** add Node.js 6.10 and 7.6 to .travis.yml
  _(Alexey Orlenko)_
  [#86](https://github.com/metarhia/JSTP/pull/86)
- **tools:** move build-native.js to tools
  _(Alexey Orlenko)_
  [#89](https://github.com/metarhia/JSTP/pull/89)
- **lib:** make failed addon loading more informative
  _(Alexey Orlenko)_
  [#90](https://github.com/metarhia/JSTP/pull/90)
- **w3c-ws:** emit missing error event
  _(Alexey Orlenko)_
  [#93](https://github.com/metarhia/JSTP/pull/93)
- **w3c-ws:** fix invalid property access
  _(Alexey Orlenko)_
  [#94](https://github.com/metarhia/JSTP/pull/94)
- **test:** add Node.js 7.7 to .travis.yml
  _(Alexey Orlenko)_
  [#95](https://github.com/metarhia/JSTP/pull/95)
- **connection:** change style of a forward declaration
  _(Alexey Orlenko)_
  [#96](https://github.com/metarhia/JSTP/pull/96)
- **lib:** change multiline function signatures style
  _(Alexey Orlenko)_
  [#97](https://github.com/metarhia/JSTP/pull/97)
- **tools:** generate authors list automatically
  _(Alexey Orlenko)_
  [#88](https://github.com/metarhia/JSTP/pull/88)
- **meta:** update AUTHORS and .mailmap
  _(Alexey Orlenko)_
  [#88](https://github.com/metarhia/JSTP/pull/88)
- **meta:** fix misleading language in LICENSE
  _(Alexey Orlenko)_
  [#88](https://github.com/metarhia/JSTP/pull/88)
- **connection:** check that method arguments exist
  _(Alexey Orlenko)_
  [#100](https://github.com/metarhia/JSTP/pull/100)
- **src:** fix incorrect indentation in CodePointToUtf8
  _(Alexey Orlenko)_
  [#103](https://github.com/metarhia/JSTP/pull/103)
- **client:** drop redundant callback argument
  _(Alexey Orlenko)_
  [#104](https://github.com/metarhia/JSTP/pull/104)
  **\[semver-major\]**
- **client:** handle errors in connectAndInspect
  _(Alexey Orlenko)_
  [#105](https://github.com/metarhia/JSTP/pull/105)
  **\[semver-major\]**
- **socket,ws:** use socket.destroy() properly
  _(Alexey Orlenko)_
  [#84](https://github.com/metarhia/JSTP/pull/84)
  **\[semver-major\]**
- **test:** add Node.js 7.8 to .travis.yml
  _(Alexey Orlenko)_
  [#119](https://github.com/metarhia/JSTP/pull/119)
- **lint:** add arrow-parens rule to eslint
  _(Denys Otrishko)_
  [#122](https://github.com/metarhia/JSTP/pull/122)
- **meta:** update AUTHORS
  _(Alexey Orlenko)_
  [#123](https://github.com/metarhia/JSTP/pull/123)
- **cli:** add basic implementation
  _(Mykola Bilochub)_
  [#107](https://github.com/metarhia/JSTP/pull/107)
  **\[semver-minor\]**
- **cli:** refactor code and fix bugs
  _(Denys Otrishko)_
  [#107](https://github.com/metarhia/JSTP/pull/107)
  **\[semver-minor\]**
- **cli:** add 'exit' command
  _(Denys Otrishko)_
  [#107](https://github.com/metarhia/JSTP/pull/107)
  **\[semver-minor\]**
- **cli:** add server events support
  _(Mykola Bilochub)_
  [#107](https://github.com/metarhia/JSTP/pull/107)
  **\[semver-minor\]**
- **cli:** display async results properly
  _(Denys Otrishko)_
  [#107](https://github.com/metarhia/JSTP/pull/107)
  **\[semver-minor\]**
- **cli:** fix stylistic mistakes
  _(Denys Otrishko)_
  [#107](https://github.com/metarhia/JSTP/pull/107)
  **\[semver-minor\]**
- **cli:** modify `_split` behaviour
  _(Mykola Bilochub)_
  [#107](https://github.com/metarhia/JSTP/pull/107)
  **\[semver-minor\]**
- **cli:** move cli.js to tools and make it executable
  _(Alexey Orlenko)_
  [#107](https://github.com/metarhia/JSTP/pull/107)
  **\[semver-minor\]**
- **cli:** fix prompt display bug
  _(Denys Otrishko)_
  [#107](https://github.com/metarhia/JSTP/pull/107)
  **\[semver-minor\]**
- **cli:** fix 'disconnect' error handling bug
  _(Denys Otrishko)_
  [#107](https://github.com/metarhia/JSTP/pull/107)
  **\[semver-minor\]**
- **test:** add Node.js 7.9 and 7.10 to .travis.yml
  _(Alexey Orlenko)_
  [#124](https://github.com/metarhia/JSTP/pull/124)
- **tcp:** fix URL parsing in client creation
  _(Mykola Bilochub)_
  [#128](https://github.com/metarhia/JSTP/pull/128)
- **cli:** fix jstp import statement
  _(Denys Otrishko)_
  [#130](https://github.com/metarhia/JSTP/pull/130)
- **lint:** add import/no-unresolved ESLint rule
  _(Alexey Orlenko)_
  [#133](https://github.com/metarhia/JSTP/pull/133)
- **cli:** modify split behaviour
  _(Denys Otrishko)_
  [#132](https://github.com/metarhia/JSTP/pull/132)
- **cli:** implement autocompletion for cli commands
  _(Denys Otrishko)_
  [#132](https://github.com/metarhia/JSTP/pull/132)
- **cli:** refine error messages
  _(Denys Otrishko)_
  [#135](https://github.com/metarhia/JSTP/pull/135)
- **cli:** avoid crashing on incorrect user input
  _(Mykola Bilochub)_
  [#137](https://github.com/metarhia/JSTP/pull/137)
- **ws:** fix emitting error when callback is provided
  _(Mykola Bilochub)_
  [#136](https://github.com/metarhia/JSTP/pull/136)
- **cli:** support different transports for connection
  _(Mykola Bilochub)_
  [#138](https://github.com/metarhia/JSTP/pull/138)
- **cli:** fix cli autocompletion
  _(Denys Otrishko)_
  [#140](https://github.com/metarhia/JSTP/pull/140)
- **parser:** fix '[' being parsed as an empty array
  _(Mykola Bilochub)_
  [#144](https://github.com/metarhia/JSTP/pull/144)
- **parser:** fix exceptions being ignored
  _(Mykola Bilochub)_
  [#143](https://github.com/metarhia/JSTP/pull/143)
- **cli:** simplify cli autocompletion
  _(Denys Otrishko)_
  [#150](https://github.com/metarhia/JSTP/pull/150)
- **test:** migrate serde tests to tap
  _(Dmytro Nechai)_
  [#153](https://github.com/metarhia/JSTP/pull/153)
- **meta:** update AUTHORS
  _(Alexey Orlenko)_
  [#156](https://github.com/metarhia/JSTP/pull/156)
- **test:** fix naming issues in serde test cases
  _(Dmytro Nechai)_
  [#161](https://github.com/metarhia/JSTP/pull/161)
- **connection:** fix error handling in optional cbs
  _(Alexey Orlenko)_
  [#147](https://github.com/metarhia/JSTP/pull/147)
  **\[semver-major\]**
- **test:** add JSON5 specs test suite
  _(Alexey Orlenko)_
  [#158](https://github.com/metarhia/JSTP/pull/158)
- **doc:** modernize README.md and add CoC
  _(Alexey Orlenko)_
  [#166](https://github.com/metarhia/JSTP/pull/166)
- **cli:** add method autocompletion
  _(Denys Otrishko)_
  [#141](https://github.com/metarhia/JSTP/pull/141)
- **doc:** add notes for the 2017-04-11 meeting
  _(Alexey Orlenko)_
  [#165](https://github.com/metarhia/JSTP/pull/165)
- **npm:** don't publish tests in the npm package
  _(Alexey Orlenko)_
  [#159](https://github.com/metarhia/JSTP/pull/159)
- **test:** refactor serde tests a bit
  _(Dmytro Nechai)_
  [#169](https://github.com/metarhia/JSTP/pull/169)
- **test:** migrate message parser tests to tap
  _(Dmytro Nechai)_
  [#168](https://github.com/metarhia/JSTP/pull/168)
- **test:** fix using incorrect field in serde tests
  _(Mykola Bilochub)_
  [#172](https://github.com/metarhia/JSTP/pull/172)
- **parser:** fix not throwing error in some cases
  _(Mykola Bilochub)_
  [#171](https://github.com/metarhia/JSTP/pull/171)
- **lib, test:** remove JSOS
  _(Dmytro Nechai)_
  [#170](https://github.com/metarhia/JSTP/pull/170)
- **cli:** fix crush on event reception
  _(Mykola Bilochub)_
  [#173](https://github.com/metarhia/JSTP/pull/173)
- **cli:** fix crash on socket errors
  _(Mykola Bilochub)_
  [#174](https://github.com/metarhia/jstp/pull/174)
- **doc:** update links to JSTP repos
  _(Alexey Orlenko)_
  [#177](https://github.com/metarhia/jstp/pull/177)
- **test:** migrate remoteError tests to tap
  _(Dmytro Nechai)_
  [#167](https://github.com/metarhia/jstp/pull/167)
- **parser:** rework error handling
  _(Mykola Bilochub)_
  [#178](https://github.com/metarhia/jstp/pull/178)
- **parser:** disallow unterminated multiline comments
  _(Mykola Bilochub)_
  [#179](https://github.com/metarhia/jstp/pull/179)
- **dist:** add nyc output files to dotignore files
  _(Alexey Orlenko)_
  [#180](https://github.com/metarhia/jstp/pull/180)
- **cli:** refactor cli.js
  _(Denys Otrishko)_
  [#127](https://github.com/metarhia/jstp/pull/127)
- **build:** run native addon build in parallel
  _(Mykola Bilochub)_
  [#185](https://github.com/metarhia/jstp/pull/185)
- **test:** migrate common.js tests to tap
  _(Dmytro Nechai)_
  [#176](https://github.com/metarhia/jstp/pull/176)
- **tcp:** fix listening on port 0
  _(Alexey Orlenko)_
  [#189](https://github.com/metarhia/jstp/pull/189)
- **test:** refactor tests
  _(Dmytro Nechai)_
  [#182](https://github.com/metarhia/jstp/pull/182)
- **tcp:** fixup "fix listening on port 0"
  _(Alexey Orlenko)_
  [#191](https://github.com/metarhia/jstp/pull/191)
- **cli:** fix event handling
  _(Denys Otrishko)_
  [#196](https://github.com/metarhia/jstp/pull/196)
- **lib:** change event signature
  _(Denys Otrishko)_
  [#187](https://github.com/metarhia/jstp/pull/187)
  **\[semver-major\]**
- **deps:** update deps and add package-lock.json
  _(Alexey Orlenko)_
  [#186](https://github.com/metarhia/jstp/pull/186)
- **lib:** add address method to Server
  _(Denys Otrishko)_
  [#190](https://github.com/metarhia/jstp/pull/190)
  **\[semver-minor\]**
- **dist:** ignore clang autocompletion files
  _(Alexey Orlenko)_
  [#194](https://github.com/metarhia/jstp/pull/194)
- **test:** add Node.js 8 to .travis.yml
  _(Alexey Orlenko)_
  [#195](https://github.com/metarhia/jstp/pull/195)
- **test:** autodetect available browsers in karma
  _(Denys Otrishko)_
  [#193](https://github.com/metarhia/jstp/pull/193)
- **tcp:** fix TLS server creation
  _(Alexey Orlenko)_
  [#197](https://github.com/metarhia/jstp/pull/197)
- **test:** migrate handshake and server tests
  _(Dmytro Nechai)_
  [#183](https://github.com/metarhia/jstp/pull/183)
- **doc:** update links to repos
  _(Timur Shemsedinov)_
  [#203](https://github.com/metarhia/jstp/pull/203)
- **test:** migrate call and callback tests
  _(Dmytro Nechai)_
  [#200](https://github.com/metarhia/jstp/pull/200)
- **test:** migrate event and remote-proxy tests
  _(Dmytro Nechai)_
  [#199](https://github.com/metarhia/jstp/pull/199)
- **test:** migrate inspect and remote-proxy tests
  _(Dmytro Nechai)_
  [#198](https://github.com/metarhia/jstp/pull/198)
- **doc:** fix extra spaces inside links in README.md
  _(Alexey Orlenko)_
  [#205](https://github.com/metarhia/jstp/pull/205)
- **parser:** implement NaN and Infinity parsing
  _(Mykola Bilochub)_
  [#201](https://github.com/metarhia/jstp/pull/201)
- **parser:** disallow empty hex, octal, binary literals
  _(Mykola Bilochub)_
  [#207](https://github.com/metarhia/jstp/pull/207)
- **parser:** fix parsing of big integer values
  _(Mykola Bilochub)_
  [#208](https://github.com/metarhia/jstp/pull/208)
- **cli:** fix exception on unestablished connection
  _(Denys Otrishko)_
  [#210](https://github.com/metarhia/jstp/pull/210)
- **cli:** refactor disconnect command processor
  _(Mykola Bilochub)_
  [#212](https://github.com/metarhia/jstp/pull/212)
- **test:** run lint first
  _(Dmytro Nechai)_
  [#215](https://github.com/metarhia/jstp/pull/215)
- **dist:** update tap
  _(Dmytro Nechai)_
  [#214](https://github.com/metarhia/jstp/pull/214)
- **dist:** add coverage task
  _(Dmytro Nechai)_
  [#214](https://github.com/metarhia/jstp/pull/214)
- **test:** remove mocha and karma
  _(Dmytro Nechai)_
  [#213](https://github.com/metarhia/jstp/pull/213)
- **dist:** rename test commands
  _(Dmytro Nechai)_
  [#213](https://github.com/metarhia/jstp/pull/213)
- **parser:** parse noctal number literals
  _(Mykola Bilochub)_
  [#221](https://github.com/metarhia/jstp/pull/221)
- **parser:** improve string parsing performance
  _(Mykola Bilochub)_
  [#220](https://github.com/metarhia/jstp/pull/220)
- **parser:** allow numeric literals as object keys
  _(Mykola Bilochub)_
  [#223](https://github.com/metarhia/jstp/pull/223)
- **test:** use lodash.isEqual instead of tap.strictSame
  _(Dmytro Nechai)_
  [#206](https://github.com/metarhia/jstp/pull/206)
- **lib:** optimize connection events
  _(Denys Otrishko)_
  [#222](https://github.com/metarhia/jstp/pull/222)
  **\[semver-major\]**
- **parser,tools:** parse Unicode identifiers
  _(Mykola Bilochub)_
  [#218](https://github.com/metarhia/jstp/pull/218)
- **build:** choose the Unicode tables via env variable
  _(Alexey Orlenko)_
  [#218](https://github.com/metarhia/jstp/pull/218)
- **lib:** refactor server and client API
  _(Denys Otrishko)_
  [#209](https://github.com/metarhia/jstp/pull/209)
  **\[semver-major\]**
- **doc:** update examples according to the new API
  _(Denys Otrishko)_
  [#209](https://github.com/metarhia/jstp/pull/209)
  **\[semver-major\]**
- **lib:** make `safeRequire()` return tuple
  _(Dmytro Nechai)_
  [#226](https://github.com/metarhia/jstp/pull/226)
- **deps:** update deps and regenerate package-lock.json
  _(Alexey Orlenko)_
  [#225](https://github.com/metarhia/jstp/pull/225)
- **deps:** update `tap`
  _(Dmytro Nechai)_
  [#227](https://github.com/metarhia/jstp/pull/227)
- **doc:** fix indentation in README.md
  _(Denys Otrishko)_
  [#232](https://github.com/metarhia/jstp/pull/232)
- **dist:** fix language statistics on GitHub
  _(Mykola Bilochub)_
  [#233](https://github.com/metarhia/jstp/pull/233)
- **cli:** update cli according to api changes
  _(Denys Otrishko)_
  [#230](https://github.com/metarhia/jstp/pull/230)
- **src:** remove native serializer
  _(Dmytro Nechai)_
  [#228](https://github.com/metarhia/jstp/pull/228)
- **src,tools:** update Unicode version
  _(Mykola Bilochub)_
  [#234](https://github.com/metarhia/jstp/pull/234)
- **test:** refactor fixtures for serde tests
  _(Dmytro Nechai)_
  [#236](https://github.com/metarhia/jstp/pull/236)
- **parser:** parse Unicode escape sequences in keys
  _(Mykola Bilochub)_
  [#219](https://github.com/metarhia/jstp/pull/219)
- **doc:** remove unused variable from README example
  _(Mykola Bilochub)_
  [#240](https://github.com/metarhia/jstp/pull/240)
- **lib,test,tools:** fix linter errors with ESLint 4
  _(Alexey Orlenko)_
  [#242](https://github.com/metarhia/jstp/pull/242)
- **deps:** update ESLint and eslint-plugin-import
  _(Alexey Orlenko)_
  [#242](https://github.com/metarhia/jstp/pull/242)
- **parser:** allow uppercase letters in number literals
  _(Mykola Bilochub)_
  [#239](https://github.com/metarhia/jstp/pull/239)
- **doc:** remove examples/data-formats
  _(Alexey Orlenko)_
  [#238](https://github.com/metarhia/jstp/pull/238)
- **parser:** deprecate legacy octal integer literals
  _(Mykola Bilochub)_
  [#247](https://github.com/metarhia/jstp/pull/247)
- **lib:** rewrite i-face introspection without promises
  _(Timur Shemsedinov)_
  [#245](https://github.com/metarhia/jstp/pull/245)
- **test:** add tests for JSON5 stringify
  _(Dmytro Nechai)_
  [#237](https://github.com/metarhia/jstp/pull/237)
- **test:** add tests for number parsing
  _(Dmytro Nechai)_
  [#241](https://github.com/metarhia/jstp/pull/241)
- **deps:** update the dependencies and recreate lock
  _(Alexey Orlenko)_
  [#249](https://github.com/metarhia/jstp/pull/249)
- **test:** add Node.js 6.11 and 8.1 to .travis.yml
  _(Alexey Orlenko)_
  [#248](https://github.com/metarhia/jstp/pull/248)
- **cli:** support connections via Unix domain sockets
  _(Mykola Bilochub)_
  [#251](https://github.com/metarhia/jstp/pull/251)
- **lib:** make the code style more consistent
  _(Timur Shemsedinov)_
  [#244](https://github.com/metarhia/jstp/pull/244)
- **lib:** refactor return style
  _(Timur Shemsedinov)_
  [#256](https://github.com/metarhia/jstp/pull/256)
- **test:** add handshake timeout test
  _(Dmytro Nechai)_
  [#255](https://github.com/metarhia/jstp/pull/255)
- **lib,src:** rename record serialization to serde
  _(Dmytro Nechai)_
  [#229](https://github.com/metarhia/jstp/pull/229)
- **lint:** add comma-dangle rule to eslint
  _(Dmytro Nechai)_
  [#257](https://github.com/metarhia/jstp/pull/257)
- **tools:** disable history for `readline.Interface`
  _(Mykola Bilochub)_
  [#259](https://github.com/metarhia/jstp/pull/259)
- **test:** fix race condition in connection-handshake
  _(Dmytro Nechai)_
  [#260](https://github.com/metarhia/jstp/pull/260)
- **src:** fix building on the old gcc versions
  _(Mykola Bilochub)_
  [#264](https://github.com/metarhia/jstp/pull/264)
- **test:** enable tests for js parser implementation
  _(Alexey Orlenko)_
  [#258](https://github.com/metarhia/jstp/pull/258)
- **build:** fix building with Node.js 6 on macOS
  _(Alexey Orlenko)_
  [#265](https://github.com/metarhia/jstp/pull/265)
- **test:** rewrite the Travis config
  _(Alexey Orlenko)_
  [#263](https://github.com/metarhia/jstp/pull/263)
- **lib:** fix W3C WebSocket event forwarding
  _(Dmytro Nechai)_
  [#266](https://github.com/metarhia/jstp/pull/266)
- **test:** add .appveyor.yml
  _(Alexey Orlenko)_
  [#261](https://github.com/metarhia/jstp/pull/261)
- **test:** use tap's built-in todo test facilities
  _(Alexey Orlenko)_
  [#267](https://github.com/metarhia/jstp/pull/267)
- **test:** add tests for websocket transport
  _(Dmytro Nechai)_
  [#268](https://github.com/metarhia/jstp/pull/268)
- **dist:** add code coverage folders to .eslintignore
  _(Dmytro Nechai)_
  [#272](https://github.com/metarhia/jstp/pull/272)
- **test:** add wss tests
  _(Dmytro Nechai)_
  [#271](https://github.com/metarhia/jstp/pull/271)
- **lib,src:** rename term packet usages to message
  _(Denys Otrishko)_
  [#270](https://github.com/metarhia/jstp/pull/270)
  **\[semver-major\]**
- **deps:** update devDependencies
  _(Alexey Orlenko)_
  [#275](https://github.com/metarhia/jstp/pull/275)
- **deps:** add missing uuid dependency
  _(Alexey Orlenko)_
  [#280](https://github.com/metarhia/jstp/pull/280)
- **doc:** fix a mistake in README.md
  _(Alexey Orlenko)_
  [#278](https://github.com/metarhia/jstp/pull/278)
- **test:** fix a typo
  _(Dmytro Nechai)_
  [#276](https://github.com/metarhia/jstp/pull/276)
- **bench:** add simple benchmark
  _(Dmytro Nechai)_
  [#253](https://github.com/metarhia/jstp/pull/253)
- **lib:** emit events about connection messages
  _(Denys Otrishko)_
  [#252](https://github.com/metarhia/jstp/pull/252)
  **\[semver-minor\]**
- **lint:** use handle-callback-err rule
  _(Alexey Orlenko)_
  [#279](https://github.com/metarhia/jstp/pull/279)
- **lib:** implement API versioning
  _(Denys Otrishko)_
  [#231](https://github.com/metarhia/jstp/pull/231)
  **\[semver-minor\]**
- **lib:** add handling of EAGAIN error on connection
  _(Mykola Bilochub)_
  [#281](https://github.com/metarhia/jstp/pull/281)
- **lib:** fix server's `connect` event
  _(Mykola Bilochub)_
  [#284](https://github.com/metarhia/jstp/pull/284)
- **lib:** disable update of messageId on callback send
  _(Mykola Bilochub)_
  [#285](https://github.com/metarhia/jstp/pull/285)
- **test:** add transport tests
  _(Dmytro Nechai)_
  [#273](https://github.com/metarhia/jstp/pull/273)
- **lib:** refactor server's getClients method
  _(Denys Otrishko)_
  [#288](https://github.com/metarhia/jstp/pull/288)
- **lib:** allow to set event handlers in application
  _(Denys Otrishko)_
  [#286](https://github.com/metarhia/jstp/pull/286)
  **\[semver-minor\]**
- **lib:** allow to broadcast events from server
  _(Denys Otrishko)_
  [#287](https://github.com/metarhia/jstp/pull/287)
  **\[semver-minor\]**
- **server:** fix handshake timeout logic
  _(Alexey Orlenko)_
  [#290](https://github.com/metarhia/jstp/pull/290)
- **connection:** refactor heartbeatCallback to a lambda
  _(Alexey Orlenko)_
  [#291](https://github.com/metarhia/jstp/pull/291)
- **lib:** fix multiple calls of callback in connect
  _(Mykola Bilochub)_
  [#293](https://github.com/metarhia/jstp/pull/293)
- **doc:** start working on new documentation
  _(Alexey Orlenko)_
  [#277](https://github.com/metarhia/jstp/pull/277)
- **test:** rewrite ws, wss and W3C ws tests
  _(Dmytro Nechai)_
  [#295](https://github.com/metarhia/jstp/pull/295)
- **test:** don't use tap's todo test annotation
  _(Dmytro Nechai)_
  [#299](https://github.com/metarhia/jstp/pull/299)
- **test:** fix serialization todo test case
  _(Dmytro Nechai)_
  [#299](https://github.com/metarhia/jstp/pull/299)
- **deps:** update dependencies
  _(Alexey Orlenko)_
  [#297](https://github.com/metarhia/jstp/pull/297)
- **bench:** add distributed benchmark
  _(Dmytro Nechai)_
  [#292](https://github.com/metarhia/jstp/pull/292)
- **doc:** fix linter errors in markdown files
  _(Alexey Orlenko)_
  [#301](https://github.com/metarhia/jstp/pull/301)
- **lint:** revive markdown linting
  _(Alexey Orlenko)_
  [#301](https://github.com/metarhia/jstp/pull/301)
- **lint,deps:** move ESLint config to separate package
  _(Alexey Orlenko)_
  [#302](https://github.com/metarhia/jstp/pull/302)
- **lib:** refactor remoteProxy using classes
  _(Dmytro Nechai)_
  [#269](https://github.com/metarhia/jstp/pull/269)
- **doc:** add connection API documentation
  _(Dmytro Nechai)_
  [#300](https://github.com/metarhia/jstp/pull/300)
- **lib:** remove unnecessary spread operator
  _(Dmytro Nechai)_
  [#304](https://github.com/metarhia/jstp/pull/304)
- **deps:** update dependencies
  _(Dmytro Nechai)_
  [#305](https://github.com/metarhia/jstp/pull/305)
- **test:** update Travis config to use the current Node
  _(Alexey Orlenko)_
  [#307](https://github.com/metarhia/jstp/pull/307)
- **connection:** make callback method private
  _(Alexey Orlenko)_
  [#306](https://github.com/metarhia/jstp/pull/306)
  **\[semver-major\]**
- **server:** add a way to update API
  _(Dmytro Nechai)_
  [#309](https://github.com/metarhia/jstp/pull/309)
- **application:** make `1.0.0` the default version
  _(Dmytro Nechai)_
  [#310](https://github.com/metarhia/jstp/pull/310)
- **server:** add a way for updating API on connections
  _(Dmytro Nechai)_
  [#310](https://github.com/metarhia/jstp/pull/310)
- **lib:** implement sessions
  _(Mykola Bilochub)_
  [#289](https://github.com/metarhia/jstp/pull/289)
  **\[semver-major\]**
- **test:** add test for resending on connection drop
  _(Dmytro Nechai)_
  [#289](https://github.com/metarhia/jstp/pull/289)
  **\[semver-major\]**
- **lib:** fix connection restore
  _(Dmytro Nechai)_
  [#289](https://github.com/metarhia/jstp/pull/289)
  **\[semver-major\]**
- **connection:** use ping-pong instead of heartbeat
  _(Dmytro Nechai)_
  [#303](https://github.com/metarhia/jstp/pull/303)
  **\[semver-major\]**
- **deps:** update dependencies
  _(Alexey Orlenko)_
  [#308](https://github.com/metarhia/jstp/pull/308)

## Version 0.6.8 (2017-03-03, @aqrln)

This is a tiny semver-patch release.

Notable changes:

- **client:** handle errors in connectAndInspect
  _(Alexey Orlenko)_
  [#106](https://github.com/metarhia/JSTP/pull/106)

All changes:

- **client:** handle errors in connectAndInspect
  _(Alexey Orlenko)_
  [#106](https://github.com/metarhia/JSTP/pull/106)
- **src:** fix incorrect indentation in CodePointToUtf8
  _(Alexey Orlenko)_
  [#103](https://github.com/metarhia/JSTP/pull/103)
- **test:** add Node.js 7.8 to .travis.yml
  _(Alexey Orlenko)_
  [#119](https://github.com/metarhia/JSTP/pull/119)

## Version 0.6.7 (2017-03-14, @aqrln)

This is a bugfix release.

Notable changes:

- **lib:** make failed addon loading more informative
  _(Alexey Orlenko)_
  [#90](https://github.com/metarhia/JSTP/pull/90)
- **w3c-ws:** emit missing error event
  _(Alexey Orlenko)_
  [#93](https://github.com/metarhia/JSTP/pull/93)
- **w3c-ws:** fix invalid property access
  _(Alexey Orlenko)_
  [#94](https://github.com/metarhia/JSTP/pull/94)
- **connection:** check that method arguments exist
  _(Alexey Orlenko)_
  [#100](https://github.com/metarhia/JSTP/pull/100)

All changes:

- **doc:** fix linter warning in CHANGELOG.md
  _(Alexey Orlenko)_
  [#80](https://github.com/metarhia/JSTP/pull/80)
- **tools:** remove crlf.js from dot-ignore files
  _(Alexey Orlenko)_
  [#83](https://github.com/metarhia/JSTP/pull/83)
- **npm:** don't include doc/ and mkdocs.yml to package
  _(Alexey Orlenko)_
  [#82](https://github.com/metarhia/JSTP/pull/82)
- **doc:** add session WG meeting
  _(Mykola Bilochub)_
  [#81](https://github.com/metarhia/JSTP/pull/81)
- **lint:** update remark
  _(Alexey Orlenko)_
  [#87](https://github.com/metarhia/JSTP/pull/87)
- **test:** add Node.js 6.10 and 7.6 to .travis.yml
  _(Alexey Orlenko)_
  [#86](https://github.com/metarhia/JSTP/pull/86)
- **tools:** move build-native.js to tools
  _(Alexey Orlenko)_
  [#89](https://github.com/metarhia/JSTP/pull/89)
- **lib:** make failed addon loading more informative
  _(Alexey Orlenko)_
  [#90](https://github.com/metarhia/JSTP/pull/90)
- **w3c-ws:** emit missing error event
  _(Alexey Orlenko)_
  [#93](https://github.com/metarhia/JSTP/pull/93)
- **w3c-ws:** fix invalid property access
  _(Alexey Orlenko)_
  [#94](https://github.com/metarhia/JSTP/pull/94)
- **test:** add Node.js 7.7 to .travis.yml
  _(Alexey Orlenko)_
  [#95](https://github.com/metarhia/JSTP/pull/95)
- **connection:** change style of a forward declaration
  _(Alexey Orlenko)_
  [#96](https://github.com/metarhia/JSTP/pull/96)
- **lib:** change multiline function signatures style
  _(Alexey Orlenko)_
  [#97](https://github.com/metarhia/JSTP/pull/97)
- **tools:** generate authors list automatically
  _(Alexey Orlenko)_
  [#88](https://github.com/metarhia/JSTP/pull/88)
- **meta:** update AUTHORS and .mailmap
  _(Alexey Orlenko)_
  [#88](https://github.com/metarhia/JSTP/pull/88)
- **meta:** fix misleading language in LICENSE
  _(Alexey Orlenko)_
  [#88](https://github.com/metarhia/JSTP/pull/88)
- **connection:** check that method arguments exist
  _(Alexey Orlenko)_
  [#100](https://github.com/metarhia/JSTP/pull/100)

## Version 0.6.6 (2017-02-20, @aqrln)

This is mostly a bugfix release. Additionally, parser performance is improved.

Notable changes:

- **server:** clean internal structures on close
  _(Alexey Orlenko)_
  [#59](https://github.com/metarhia/JSTP/pull/59)
- **src,build:** add missing header
  _(Mykola Bilochub)_
  [#64](https://github.com/metarhia/JSTP/pull/64)
- **parser:** make parser single-pass
  _(Mykola Bilochub)_
  [#61](https://github.com/metarhia/JSTP/pull/61)
- **lib:** fix behavior with util.inspect
  _(Alexey Orlenko)_
  [#72](https://github.com/metarhia/JSTP/pull/72)
- **parser:** fix bug causing node to crash
  _(Mykola Bilochub)_
  [#75](https://github.com/metarhia/JSTP/pull/75)
- **server:** handle connection errors before handshake
  _(Alexey Orlenko)_
  [#78](https://github.com/metarhia/JSTP/pull/78)
- **connection:** close connection on transport error
  _(Alexey Orlenko)_
  [#78](https://github.com/metarhia/JSTP/pull/78)

All changes:

- **server:** clean internal structures on close
  _(Alexey Orlenko)_
  [#59](https://github.com/metarhia/JSTP/pull/59)
- **src,build:** add missing header
  _(Mykola Bilochub)_
  [#64](https://github.com/metarhia/JSTP/pull/64)
- **src:** add curly braces in `switch` statements
  _(Mykola Bilochub)_
  [#62](https://github.com/metarhia/JSTP/pull/62)
- **build:** fail CI if native addon build fails
  _(Alexey Orlenko)_
  [#65](https://github.com/metarhia/JSTP/pull/65)
- **parser:** make parser single-pass
  _(Mykola Bilochub)_
  [#61](https://github.com/metarhia/JSTP/pull/61)
- **src:** fix single-line comment spacing
  _(Mykola Bilochub)_
  [#67](https://github.com/metarhia/JSTP/pull/67)
- **parser:** improve string parsing
  _(Mykola Bilochub)_
  [#66](https://github.com/metarhia/JSTP/pull/66)
- **src:** fix inconsistency in empty string creation
  _(Mykola Bilochub)_
  [#70](https://github.com/metarhia/JSTP/pull/70)
- **doc:** document protocol versioning policy
  _(Alexey Orlenko)_
  [#56](https://github.com/metarhia/JSTP/pull/56)
- **lib:** fix behavior with util.inspect
  _(Alexey Orlenko)_
  [#72](https://github.com/metarhia/JSTP/pull/72)
- **deps,build:** update webpack to 2.x
  _(Alexey Orlenko)_
  [#73](https://github.com/metarhia/JSTP/pull/73)
- **build,test:** avoid unnecessary recompiling
  _(Alexey Orlenko)_
  [#74](https://github.com/metarhia/JSTP/pull/74)
- **doc:** update badges in README.md and doc/index.md
  _(Alexey Orlenko)_
  [#71](https://github.com/metarhia/JSTP/pull/71)
- **parser:** fix bug causing node to crash
  _(Mykola Bilochub)_
  [#75](https://github.com/metarhia/JSTP/pull/75)
- **tools:** automate the release preparation
  _(Alexey Orlenko)_
  [#77](https://github.com/metarhia/JSTP/pull/77)
- **server:** handle connection errors before handshake
  _(Alexey Orlenko)_
  [#78](https://github.com/metarhia/JSTP/pull/78)
- **connection:** close connection on transport error
  _(Alexey Orlenko)_
  [#78](https://github.com/metarhia/JSTP/pull/78)

## Version 0.5.2 (2017-03-03, @aqrln)

This is a backport release that brings the most essential changes and bugfixes
from v0.6 to currently used in at least one real project v0.5.

Notable changes:

- **parser:** fix memory leaks
  _(Alexey Orlenko)_
  [371f7dd](https://github.com/metarhia/JSTP/commit/371f7ddc79e1728a3139cfb1734aa2d11d8197e9)
- **parser:** fix bugs in JSRS parser
  _(Alexey Orlenko)_
  [#109](https://github.com/metarhia/JSTP/pull/109)
- **src,build:** improve the native module subsystem
  _(Alexey Orlenko)_
  [#110](https://github.com/metarhia/JSTP/pull/110)
  **\[semver-minor\]**
- **build:** compile in ISO C++11 mode
  _(Alexey Orlenko)_
  [#37](https://github.com/metarhia/JSTP/pull/37)
  **\[semver-minor\]**
- **parser:** fix a possible memory leak
  _(Alexey Orlenko)_
  [#44](https://github.com/metarhia/JSTP/pull/44)
- **parser:** make parser single-pass
  _(Mykola Bilochub)_
  [#61](https://github.com/metarhia/JSTP/pull/61)
- **parser:** improve string parsing
  _(Mykola Bilochub)_
  [#66](https://github.com/metarhia/JSTP/pull/66)
- **parser:** fix bug causing node to crash
  _(Mykola Bilochub)_
  [#75](https://github.com/metarhia/JSTP/pull/75)
- **connection:** check that method arguments exist
  _(Alexey Orlenko)_
  [#100](https://github.com/metarhia/JSTP/pull/100)

All changes:

- **parser:** fix memory leaks
  _(Alexey Orlenko)_
  [371f7dd](https://github.com/metarhia/JSTP/commit/371f7ddc79e1728a3139cfb1734aa2d11d8197e9)
- **parser:** fix bugs in JSRS parser
  _(Alexey Orlenko)_
  [#109](https://github.com/metarhia/JSTP/pull/109)
- **parser:** fix compiler warnings
  _(Alexey Orlenko)_
  [851a2c6](https://github.com/metarhia/JSTP/commit/851a2c695ca48cc6d5f606756a54bdb571f94f59)
- **examples:** fix inconsistency with specification
  _(Alexey Orlenko)_
  [05461bf](https://github.com/metarhia/JSTP/commit/05461bfb133e0adbb12e5db5338e9c0754213647)
- **lint:** ignore Object Serialization examples
  _(Alexey Orlenko)_
  [94609f0](https://github.com/metarhia/JSTP/commit/94609f01e081e844fa66598ee2dea541368a733b)
- **dist**: update LICENSE
  _(Alexey Orlenko)_
  [8c5f830](https://github.com/metarhia/JSTP/commit/8c5f83097e75a1af065e861b5453a684e33d1fc5)
- **src:** simplify and update license boilerplates
  _(Alexey Orlenko)_
  [16b1e95](https://github.com/metarhia/JSTP/commit/16b1e9597133e85429be0cbaf3d3fe9e7ea58b15)
- **test:** add Node.js 7.3 and 7.4 to .travis.yml
  _(Alexey Orlenko)_
  [fa722e7](https://github.com/metarhia/JSTP/commit/fa722e7ee0a36f65c985e9570d0f234503e70de4)
- **src,build:** improve the native module subsystem
  _(Alexey Orlenko)_
  [#110](https://github.com/metarhia/JSTP/pull/110)
  **\[semver-minor\]**
- **src,build:** add missing header
  _(Mykola Bilochub)_
  [#64](https://github.com/metarhia/JSTP/pull/64)
- **build:** compile in ISO C++11 mode
  _(Alexey Orlenko)_
  [#37](https://github.com/metarhia/JSTP/pull/37)
  **\[semver-minor\]**
- **doc:** document versioning policy
  _(Alexey Orlenko)_
  [#42](https://github.com/metarhia/JSTP/pull/42)
- **parser:** fix a possible memory leak
  _(Alexey Orlenko)_
  [#44](https://github.com/metarhia/JSTP/pull/44)
- **test:** add Node.js 7.5 to .travis.yml
  _(Alexey Orlenko)_
  [#47](https://github.com/metarhia/JSTP/pull/47)
- **doc:** fix a typo in protocol.md
  _(Alexey Orlenko)_
  [#55](https://github.com/metarhia/JSTP/pull/55)
- **server:** clean internal structures on close
  _(Alexey Orlenko)_
  [#59](https://github.com/metarhia/JSTP/pull/59)
- **src:** add curly braces in `switch` statements
  _(Mykola Bilochub)_
  [#62](https://github.com/metarhia/JSTP/pull/62)
- **parser:** make parser single-pass
  _(Mykola Bilochub)_
  [#61](https://github.com/metarhia/JSTP/pull/61)
- **src:** fix single-line comment spacing
  _(Mykola Bilochub)_
  [#67](https://github.com/metarhia/JSTP/pull/67)
- **parser:** improve string parsing
  _(Mykola Bilochub)_
  [#66](https://github.com/metarhia/JSTP/pull/66)
- **src:** fix inconsistency in empty string creation
  _(Mykola Bilochub)_
  [#70](https://github.com/metarhia/JSTP/pull/70)
- **doc:** document protocol versioning policy
  _(Alexey Orlenko)_
  [#56](https://github.com/metarhia/JSTP/pull/56)
- **parser:** fix bug causing node to crash
  _(Mykola Bilochub)_
  [#75](https://github.com/metarhia/JSTP/pull/75)
- **connection:** close connection on transport error
  _(Alexey Orlenko)_
  [#78](https://github.com/metarhia/JSTP/pull/78)
- **doc:** fix mistyped repository name
  _(Alexey Orlenko)_
  [#111](https://github.com/metarhia/JSTP/pull/111)
- **test:** fix typos in connection.test.js
  _(Alexey Orlenko)_
  [#112](https://github.com/metarhia/JSTP/pull/112)
- **tools:** remove crlf.js from dot-ignore files
  _(Alexey Orlenko)_
  [#83](https://github.com/metarhia/JSTP/pull/83)
- **npm:** don't include doc/ and mkdocs.yml to package
  _(Alexey Orlenko)_
  [#82](https://github.com/metarhia/JSTP/pull/82)
- **test:** add Node.js 6.10 and 7.6 to .travis.yml
  _(Alexey Orlenko)_
  [#86](https://github.com/metarhia/JSTP/pull/86)
- **w3c-ws:** emit missing error event
  _(Alexey Orlenko)_
  [#93](https://github.com/metarhia/JSTP/pull/93)
- **test:** add Node.js 7.7 to .travis.yml
  _(Alexey Orlenko)_
  [#95](https://github.com/metarhia/JSTP/pull/95)
- **lib:** fix behavior with util.inspect
  _(Alexey Orlenko)_
  [#114](https://github.com/metarhia/JSTP/pull/114)
- **server:** handle connection errors before handshake
  _(Alexey Orlenko)_
  [#115](https://github.com/metarhia/JSTP/pull/115)
- **w3c-ws:** fix invalid property access
  _(Alexey Orlenko)_
  [#116](https://github.com/metarhia/JSTP/pull/116)
- **src:** fix incorrect indentation in CodePointToUtf8
  _(Alexey Orlenko)_
  [#103](https://github.com/metarhia/JSTP/pull/103)
- **connection:** check that method arguments exist
  _(Alexey Orlenko)_
  [#100](https://github.com/metarhia/JSTP/pull/100)
- **meta:** update AUTHORS and .mailmap
  _(Alexey Orlenko)_
  [#117](https://github.com/metarhia/JSTP/pull/117)
- **meta:** fix misleading language in LICENSE
  _(Alexey Orlenko)_
  [#117](https://github.com/metarhia/JSTP/pull/117)
- **connection:** handle optional callbacks properly
  _(Alexey Orlenko)_
  [#113](https://github.com/metarhia/JSTP/pull/113)
- **test:** add Node.js 7.8 to .travis.yml
  _(Alexey Orlenko)_
  [#119](https://github.com/metarhia/JSTP/pull/119)
- **lint:** add bitHound config
  _(Alexey Orlenko)_
  [#120](https://github.com/metarhia/JSTP/pull/120)
- **lib:** decouple ensureClientConnected()
  _(Alexey Orlenko)_
  [#120](https://github.com/metarhia/JSTP/pull/120)
- **client:** handle errors in connectAndInspect
  _(Alexey Orlenko)_
  [#120](https://github.com/metarhia/JSTP/pull/120)
- **test:** refactor RawServerMock
  _(Alexey Orlenko)_
  [#120](https://github.com/metarhia/JSTP/pull/120)
- **deps:** update dependencies
  _(Alexey Orlenko)_
  [#120](https://github.com/metarhia/JSTP/pull/120)
