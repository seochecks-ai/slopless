# Joblint [![Build Status](https://travis-ci.org/errata-ai/Joblint.svg?branch=master)](https://travis-ci.org/errata-ai/Joblint) ![Vale version](https://img.shields.io/badge/vale-%3E%3D%20v1.7.0-blue.svg) ![license](https://img.shields.io/github/license/mashape/apistatus.svg)

> [`Joblint`](https://github.com/rowanmanning/joblint): Test tech job posts for issues with sexism, culture, expectations, and recruiter fails.

This repository contains a [Vale-compatible](https://github.com/errata-ai/vale) implementation of the guidelines enforced by the `Joblint` ([LICENSE](https://github.com/rowanmanning/joblint/blob/master/LICENSE)) linter.

## Getting Started

To get started, add the package to your configuration file (as shown below) and then run `vale sync`.

```ini
StylesPath = styles
MinAlertLevel = suggestion

Packages = Joblint

[*]
BasedOnStyles = Joblint
```