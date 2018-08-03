# Versioning

## Package versioning

When we reach 1.0, we will just adhere to [semantic
versioning](http://semver.org/) strictly, but semver says nothing about
versions `<1.0.0`. Thus we extend semver's rules applying them to these
versions this way: in `0.minor.patch` scheme `minor` acts as a major semver
version and `patch` as both minor and patch, regardless of whether a change is
a feature or a bugfix.

Accordingly, if labels named `semver-major` or `semver-minor` are added to any
issue or pull request before we have released `v1.0.0`, they actually assume
minor and patch subversions.

## Protocol versioning

Before the package reaches version 1.0.0, the protocol version is bound to the
first of the `metarhia-jstp` package versions that implement the same
specification of the protocol. It would be nice to have it versioned
independently, but it's too late to do it, since we haven't been versioning it
from the beginning and we have made changes to the specification multiple
times.

When the package reaches 1.0.0, the protocol version will be unconditionally
bumped to 1.0.0 too, regardless of whether `metarhia-jstp@1.0.0` brings any
changes to the protocol. We will then take this as a starting point and the
protocol specification will be versioned with semver independently from the
package.
