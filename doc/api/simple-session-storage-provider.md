# SimpleSessionStorageProvider

## Class: jstp.SimpleSessionStorageProvider

This class implements [`jstp.SessionStorageProvider`][ssp] interface.

### Constructor: new SimpleSessionStorageProvider(\[inactiveSessionLifetime\[, purgeInterval\]\])

- `inactiveSessionLifetime` [`<number>`][number] Determines the minimal lifetime
  of the session which was marked as inactive in milliseconds. Defaults to
  `86400000` (24 hours).
- `purgeInterval` [`<number>`][number] Determines the interval at which session
  purging occurs in milliseconds. Defaults to `3600000` (1 hour).

[ssp]: ./session-storage-provider.md#interface-jstpsessionstorageprovider
[number]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures#Number_type
