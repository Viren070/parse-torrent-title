# Changelog

## [0.6.2](https://github.com/Viren070/parse-torrent-title/compare/v0.6.1...v0.6.2) (2026-02-01)


### Bug Fixes

* skip cam if first ([ce37cd5](https://github.com/Viren070/parse-torrent-title/commit/ce37cd5b9e737e217e25befb01becd4f80e88bec))

## [0.6.1](https://github.com/Viren070/parse-torrent-title/compare/v0.6.0...v0.6.1) (2026-01-18)


### Bug Fixes

* use correct esm import syntax ([aaf2743](https://github.com/Viren070/parse-torrent-title/commit/aaf274392297a9f6542bc583ecb8dd425c4eef7e))

## [0.6.0](https://github.com/Viren070/parse-torrent-title/compare/v0.5.5...v0.6.0) (2026-01-18)


### Features

* sync go-ptt changes ([8578d45](https://github.com/Viren070/parse-torrent-title/commit/8578d45b1824ebe3fab5f24b0549cedbae35641f))


### Bug Fixes

* improve parsing - site ([8578d45](https://github.com/Viren070/parse-torrent-title/commit/8578d45b1824ebe3fab5f24b0549cedbae35641f))
* remove trailing absolute episode from title ([8578d45](https://github.com/Viren070/parse-torrent-title/commit/8578d45b1824ebe3fab5f24b0549cedbae35641f))

## [0.5.5](https://github.com/Viren070/parse-torrent-title/compare/v0.5.4...v0.5.5) (2026-01-15)


### Bug Fixes

* add color corrected edition handler ([289e8cd](https://github.com/Viren070/parse-torrent-title/commit/289e8cd362b6c8c4b40bb8029228cc6d754ae3cd))
* loosen check for separators between 3 digit number and add dbox handler ([5a4c815](https://github.com/Viren070/parse-torrent-title/commit/5a4c815b278c0fbab33cc9927956d450e9a1655c))

## [0.5.4](https://github.com/Viren070/parse-torrent-title/compare/v0.5.3...v0.5.4) (2026-01-15)


### Bug Fixes

* fix crunchyrol handler ([cbdea92](https://github.com/Viren070/parse-torrent-title/commit/cbdea92aea8e1460f2635a0a8288d39bbb61190e))

## [0.5.3](https://github.com/Viren070/parse-torrent-title/compare/v0.5.2...v0.5.3) (2026-01-15)


### Bug Fixes

* allow 3 digit number as absolute episode at the end of title before res/quality/codec ([ea31871](https://github.com/Viren070/parse-torrent-title/commit/ea3187179d80d0ce5f9cbfa9312344a7013efd06))

## [0.5.2](https://github.com/Viren070/parse-torrent-title/compare/v0.5.1...v0.5.2) (2026-01-07)


### Bug Fixes

* allow absolute episode with version after for no space-hyphen-space separator ([80f673f](https://github.com/Viren070/parse-torrent-title/commit/80f673f58eff19dd3b3697da8546e9b9e7f394af))

## [0.5.1](https://github.com/Viren070/parse-torrent-title/compare/v0.5.0...v0.5.1) (2025-12-10)


### Bug Fixes

* add missing boundary in releaseTypes handler ([9cf947f](https://github.com/Viren070/parse-torrent-title/commit/9cf947fc80d63a546d77612ecdc2260f75426753))

## [0.5.0](https://github.com/Viren070/parse-torrent-title/compare/v0.4.1...v0.5.0) (2025-12-09)


### Features

* add iTunes and showtime network handlers ([9d91db8](https://github.com/Viren070/parse-torrent-title/commit/9d91db812130620c05bad9a0a9ed2e03bb3de82e))


### Bug Fixes

* make it language handler more strict to prevent false positive ([8453fee](https://github.com/Viren070/parse-torrent-title/commit/8453fee3b69cc89038b1631762586893137a169d))
* only match sp when with other lang codes ([d04fc49](https://github.com/Viren070/parse-torrent-title/commit/d04fc4981270d6eff40e5fbb812b1665d6efe61f))

## [0.4.1](https://github.com/Viren070/parse-torrent-title/compare/v0.4.0...v0.4.1) (2025-11-27)


### Bug Fixes

* update site handler ([6189dae](https://github.com/Viren070/parse-torrent-title/commit/6189dae818bd0e5f5afcc1ffb480af16248e911e))

## [0.4.0](https://github.com/Viren070/parse-torrent-title/compare/v0.3.0...v0.4.0) (2025-11-27)


### Features

* add av1, vp9/8 codec handlers ([c73ead7](https://github.com/Viren070/parse-torrent-title/commit/c73ead7360a6441616939d1c7424fa44cbd24505))


### Bug Fixes

* update site handlers ([1f4de65](https://github.com/Viren070/parse-torrent-title/commit/1f4de65463e1c1c569f2a4e645c201053abf3a0d))

## [0.3.0](https://github.com/Viren070/parse-torrent-title/compare/v0.2.0...v0.3.0) (2025-11-22)


### Features

* improve language parsing ([6f4f339](https://github.com/Viren070/parse-torrent-title/commit/6f4f3390975bf6840f892c242e72a570cd35d8ab))

## [0.2.0](https://github.com/Viren070/parse-torrent-title/compare/v0.1.3...v0.2.0) (2025-11-15)


### Features

* allow building custom parsers, export transforms/validators ([a59e102](https://github.com/Viren070/parse-torrent-title/commit/a59e10273b92b1382e96ebca88fdfc097c427b57))


### Bug Fixes

* add handler for SDTV quality pattern ([937f7e1](https://github.com/Viren070/parse-torrent-title/commit/937f7e157a219da3f7c5695d939a37edac15e3fa))
* add handler for WEBCap quality pattern ([ddc8cf3](https://github.com/Viren070/parse-torrent-title/commit/ddc8cf3468b4a4010ba66ea2cae8524a9b7264c3))
* adjust site parsing ([e688d93](https://github.com/Viren070/parse-torrent-title/commit/e688d934139f2f275d905772f0ed910f97028b72))
* ensure ppv is parsed and removed as its own field ([0a9497a](https://github.com/Viren070/parse-torrent-title/commit/0a9497a54cec7f5349a3a7ea45d8b91aa91f36f5))
* exclude generic Spanish if Latin American Spanish is present ([332c781](https://github.com/Viren070/parse-torrent-title/commit/332c78193f77b74c5382569c066a19a9f212c28f))
* remove xcid/divx quality handler and add workprint handler ([925e50d](https://github.com/Viren070/parse-torrent-title/commit/925e50d8d1b863b58e3ff681de304e4a9bfeedbd))
* update HDTV quality pattern to exclude '-ELITE.NET' suffix ([c3532c6](https://github.com/Viren070/parse-torrent-title/commit/c3532c6807df5f539a916e98d142ba4ec7139d4f))

## [0.1.3](https://github.com/Viren070/parse-torrent-title/compare/v0.1.2...v0.1.3) (2025-11-03)


### Bug Fixes

* improve season/episode parsing ([a0becbe](https://github.com/Viren070/parse-torrent-title/commit/a0becbec31714535fad7688f79d53b66b37de367))

## [0.1.2](https://github.com/Viren070/parse-torrent-title/compare/v0.1.1...v0.1.2) (2025-11-03)


### Bug Fixes

* improve season/episode parsing ([9a7091b](https://github.com/Viren070/parse-torrent-title/commit/9a7091bc18823e8cbb92c2102d71448e72f61ec0))

## [0.1.1](https://github.com/Viren070/parse-torrent-title/compare/v0.1.0...v0.1.1) (2025-11-01)


### Bug Fixes

* correct export statement for ParsedResult in index.ts ([826b264](https://github.com/Viren070/parse-torrent-title/commit/826b264ceb261e94b4cae3f471424a186e7203c8))

## 0.1.0 (2025-11-01)


### Features

* initial commit ([d92c02d](https://github.com/Viren070/parse-torrent-title/commit/d92c02da64a7b64bb55713227f02b90a996a381a))
