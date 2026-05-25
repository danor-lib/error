# CHANGELOG

## v2.0.0 - 2026.05.25 15
* feat!: `RichError` no longer mimics the native Error constructor. it is now not allowed to construct a `RichError` directly via `Error()`
* feat!: due to a change in design philosophy, the first parameter `message` of `RichError` is no longer considered necessary
  * the `message` parameter is now merged into `options`. `options` is the only parameter
  * in my design philosophy, an error should only contain a code and associated data. Text-based message should be rendered by the terminal (including i18n and terminal highlighting)
* feat: add extra properties `datasPruned`, `pruner`, `prune()`
* docs: update README
* test: refactor `describe()` and `it()` with `test()` from `node:test`
* regular: improve enviroment
* regular: bump up dependencies


## v1.0.0 - 2026.04.17 16
* feat: add extra properties `code`, `at`, `data`, `internal`
* feat: add extra getter property `root` to find the first error in the error chain based on the `cause` property
* docs: add README and English version
* regular: init enviroment
* regular: init dependencies
