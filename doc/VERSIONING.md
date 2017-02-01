# Versioning

When we reach 1.0, we will just adhere to [semantic
versioning](http://semver.org/) strictly, but semver says nothing about
versions `<1.0.0`. Thus we extend semver's rules applying them to these
versions this way: in `0.minor.patch` scheme `minor` acts as a major semver
version and `patch` as both minor and patch, regardless of whether a change is
a feature or a bugfix.

Accordingly, if labels named `semver-major` or `semver-minor` are added to any
issue or pull request before we have released `v1.0.0`, they actually assume
minor and patch subversions.
