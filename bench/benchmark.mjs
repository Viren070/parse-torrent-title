/**
 * Benchmarks this parser against the other torrent-title parsers it shares a
 * lineage with, and writes bench/RESULTS.md.
 *
 * Every parser is cloned, built and run locally over the same corpus with the
 * same timing method, so the numbers come from one machine rather than from
 * each project's own README.
 *
 *   node bench/benchmark.mjs
 *   node bench/benchmark.mjs --only ours,go --rounds 25
 *   node bench/benchmark.mjs --no-setup     reuse existing clones
 *
 * Everything it downloads or generates lives in bench/.work, which is ignored.
 */
import { execFileSync, execSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { arch, cpus, totalmem } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(here, '..');
const work = join(here, '.work');
const corpusPath = join(work, 'corpus.json');

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? fallback : args[i + 1];
};
const has = (name) => args.includes(`--${name}`);

const WARMUP = Number(flag('warmup', 5));
const ROUNDS = Number(flag('rounds', 15));
const only = flag('only', null)
  ?.split(',')
  .map((s) => s.trim());

// --------------------------------------------------------------------------
// Shell helpers
// --------------------------------------------------------------------------

function run(command, options = {}) {
  return execSync(command, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', options.showStderr ? 'inherit' : 'pipe'],
    maxBuffer: 64 * 1024 * 1024,
    ...options
  });
}

function tryRun(command, options = {}) {
  try {
    return run(command, options).trim();
  } catch {
    return null;
  }
}

function toolVersion(command) {
  const out = tryRun(command);
  return out ? out.split('\n')[0].trim() : null;
}

function gitClone(url, dir) {
  if (existsSync(dir)) return;
  console.log(`  cloning ${url}`);
  run(`git clone --depth 1 ${url} "${dir}"`);
}

/**
 * `git -C` on a directory that is not itself a repository walks up to the
 * enclosing one, which would silently record this repo's hash for a clone that
 * failed to appear, so the toplevel is verified before the hash is trusted.
 */
function describeCommit(dir) {
  const toplevel = tryRun(`git -C "${dir}" rev-parse --show-toplevel`);
  if (!toplevel) return null;
  const wanted = dir.replace(/\\/g, '/').replace(/\/$/, '').toLowerCase();
  if (toplevel.replace(/\\/g, '/').toLowerCase() !== wanted) return null;

  const hash = tryRun(`git -C "${dir}" rev-parse HEAD`);
  if (!hash) return null;
  const date = tryRun(`git -C "${dir}" log -1 --format=%cs`);
  // Untracked files are ignored: the benchmark drops its own runners and
  // installed dependencies into the clones, which does not change the parser.
  const dirty = tryRun(
    `git -C "${dir}" status --porcelain --untracked-files=no`
  );
  return {
    hash,
    short: hash.slice(0, 10) + (dirty ? ' + uncommitted changes' : ''),
    date
  };
}

// --------------------------------------------------------------------------
// Corpus
// --------------------------------------------------------------------------

mkdirSync(work, { recursive: true });
const { buildCorpus } = await import(
  `file://${join(here, 'corpus.cjs').replace(/\\/g, '/')}`
).then((m) => m.default ?? m);
const corpus = buildCorpus();
writeFileSync(corpusPath, JSON.stringify(corpus));
const lengths = corpus.map((t) => t.length).sort((a, b) => a - b);
console.log(
  `corpus: ${corpus.length} titles from the test suite ` +
    `(median ${lengths[lengths.length >> 1]} chars, longest ${lengths[lengths.length - 1]})\n`
);

/**
 * Each runner prints one JSON line: the fastest of `rounds` passes over the
 * whole corpus, plus a checksum that keeps the work from being optimised away.
 */
const RUNNER_ARGS = [corpusPath, String(WARMUP), String(ROUNDS)];

// --------------------------------------------------------------------------
// Targets
// --------------------------------------------------------------------------

const targets = [
  {
    name: 'ours',
    label: '@viren070/parse-torrent-title',
    language: 'TypeScript',
    repo: null,
    dir: repoRoot,
    note: 'this repo',
    setup() {
      run('npx tsc', { cwd: repoRoot });
      return describeCommit(repoRoot);
    },
    measure() {
      const runner = join(work, 'run-ours.cjs');
      writeFileSync(
        runner,
        nodeRunner(join(repoRoot, 'dist', 'index.js'), 'esm')
      );
      return JSON.parse(
        execFileSync(process.execPath, [runner, ...RUNNER_ARGS], {
          encoding: 'utf8'
        })
      );
    }
  },
  {
    name: 'go',
    label: 'MunifTanjim/go-ptt',
    language: 'Go',
    repo: 'https://github.com/MunifTanjim/go-ptt',
    dir: join(work, 'goptt'),
    note: 'the port this library came from',
    setup() {
      const dir = join(work, 'goptt');
      gitClone(this.repo, dir);
      const runnerDir = join(dir, 'cmd', 'pttbench');
      mkdirSync(runnerDir, { recursive: true });
      writeFileSync(join(runnerDir, 'main.go'), GO_RUNNER);
      run(`go build ./cmd/pttbench`, { cwd: dir });
      return describeCommit(dir);
    },
    measure() {
      const dir = join(work, 'goptt');
      const binary = join(
        dir,
        process.platform === 'win32' ? 'pttbench.exe' : 'pttbench'
      );
      return JSON.parse(
        execFileSync(binary, RUNNER_ARGS, { encoding: 'utf8' })
      );
    }
  },
  {
    name: 'rust',
    label: 'g0ldyy/torrent-parse-rank',
    language: 'Rust',
    repo: 'https://github.com/g0ldyy/torrent-parse-rank',
    dir: join(work, 'rustptt'),
    note: 'ptt-core, single-threaded',
    setup() {
      const dir = join(work, 'rustptt');
      gitClone(this.repo, dir);
      const runnerDir = join(work, 'rust-runner');
      mkdirSync(join(runnerDir, 'src'), { recursive: true });
      writeFileSync(
        join(runnerDir, 'Cargo.toml'),
        rustManifest(join(dir, 'crates', 'ptt-core'))
      );
      writeFileSync(join(runnerDir, 'src', 'main.rs'), RUST_RUNNER);
      run('cargo build --release', { cwd: runnerDir });
      return describeCommit(dir);
    },
    measure() {
      const runnerDir = join(work, 'rust-runner');
      return JSON.parse(
        run(
          `cargo run --release --quiet -- ${RUNNER_ARGS.map(quote).join(' ')}`,
          {
            cwd: runnerDir
          }
        )
      );
    }
  },
  {
    name: 'python',
    label: 'dreulavelle/PTT',
    language: 'Python',
    repo: 'https://github.com/dreulavelle/PTT',
    dir: join(work, 'pyptt'),
    note: 'upstream of the Rust port',
    setup() {
      const dir = join(work, 'pyptt');
      gitClone(this.repo, dir);
      const venv = join(work, 'venv');
      if (!existsSync(venv)) run(`python -m venv "${venv}"`);
      run(`"${venvPython(venv)}" -m pip install --quiet --upgrade pip`);
      run(`"${venvPython(venv)}" -m pip install --quiet "${dir}"`);
      writeFileSync(join(work, 'run-python.py'), PYTHON_RUNNER);
      return describeCommit(dir);
    },
    measure() {
      const venv = join(work, 'venv');
      return JSON.parse(
        run(
          `"${venvPython(venv)}" "${join(work, 'run-python.py')}" ${RUNNER_ARGS.map(quote).join(' ')}`
        )
      );
    }
  },
  {
    name: 'ours-parallel',
    label: '@viren070/parse-torrent-title',
    language: 'TypeScript',
    repo: null,
    dir: repoRoot,
    parallel: true,
    note: 'worker_threads pool',
    setup() {
      run('npx tsc', { cwd: repoRoot });
      return describeCommit(repoRoot);
    },
    measure() {
      const workerPath = join(work, 'pool-worker.cjs');
      const runner = join(work, 'run-pool.cjs');
      writeFileSync(workerPath, NODE_WORKER);
      writeFileSync(runner, NODE_POOL_RUNNER);
      const entry = `file://${join(repoRoot, 'dist', 'index.js').replace(/\\/g, '/')}`;
      return JSON.parse(
        execFileSync(
          process.execPath,
          [runner, ...RUNNER_ARGS, workerPath, entry],
          { encoding: 'utf8' }
        )
      );
    }
  },
  {
    name: 'rust-parallel',
    label: 'g0ldyy/torrent-parse-rank',
    language: 'Rust',
    repo: 'https://github.com/g0ldyy/torrent-parse-rank',
    dir: join(work, 'rustptt'),
    parallel: true,
    note: 'ptt-core parse_many',
    setup() {
      return describeCommit(join(work, 'rustptt'));
    },
    measure() {
      const runnerDir = join(work, 'rust-runner');
      return JSON.parse(
        run(
          `cargo run --release --quiet -- ${RUNNER_ARGS.map(quote).join(' ')} many`,
          { cwd: runnerDir }
        )
      );
    }
  },
  {
    name: 'js',
    label: 'TheBeastLT/parse-torrent-title',
    language: 'JavaScript',
    repo: 'https://github.com/TheBeastLT/parse-torrent-title',
    dir: join(work, 'jsptt'),
    note: 'smaller handler set, see caveats',
    setup() {
      const dir = join(work, 'jsptt');
      gitClone(this.repo, dir);
      if (!existsSync(join(dir, 'node_modules'))) {
        // ci rather than install, so the clone's lockfile is left untouched.
        run('npm ci --omit=dev --no-audit --no-fund', { cwd: dir });
      }
      return describeCommit(dir);
    },
    measure() {
      const runner = join(work, 'run-js.cjs');
      writeFileSync(runner, nodeRunner(join(work, 'jsptt', 'index.js'), 'cjs'));
      return JSON.parse(
        execFileSync(process.execPath, [runner, ...RUNNER_ARGS], {
          encoding: 'utf8'
        })
      );
    }
  }
];

const quote = (value) => `"${value}"`;
const venvPython = (venv) =>
  join(venv, process.platform === 'win32' ? 'Scripts' : 'bin', 'python');

// --------------------------------------------------------------------------
// Runner sources
// --------------------------------------------------------------------------

/**
 * Runner for a Node parser. Always CommonJS: dynamic import() reaches an ESM
 * entry from here, so one template covers both.
 */
function nodeRunner(entry, kind) {
  const load =
    kind === 'esm'
      ? `(await import(${JSON.stringify(`file://${entry.replace(/\\/g, '/')}`)})).parseTorrentTitle`
      : `require(${JSON.stringify(entry)}).parse`;
  return `const fs = require('node:fs');
const [corpusPath, warmup, rounds] = process.argv.slice(2);
const titles = JSON.parse(fs.readFileSync(corpusPath, 'utf8'));

(async () => {
  const parse = ${load};

  for (let r = 0; r < Number(warmup); r++) {
    for (let i = 0; i < titles.length; i++) parse(titles[i]);
  }

  let best = Infinity;
  let checksum = 0;
  for (let r = 0; r < Number(rounds); r++) {
    let sum = 0;
    const start = process.hrtime.bigint();
    for (let i = 0; i < titles.length; i++) {
      const out = parse(titles[i]);
      sum += out && out.title ? out.title.length : 0;
    }
    const ns = Number(process.hrtime.bigint() - start);
    if (ns < best) best = ns;
    checksum = sum;
  }

  process.stdout.write(
    JSON.stringify({ perItemUs: best / 1000 / titles.length, checksum })
  );
})();
`;
}

const GO_RUNNER = `package main

import (
	"encoding/json"
	"fmt"
	"os"
	"strconv"
	"time"

	ptt "github.com/MunifTanjim/go-ptt"
)

func main() {
	raw, err := os.ReadFile(os.Args[1])
	if err != nil {
		panic(err)
	}
	var titles []string
	if err := json.Unmarshal(raw, &titles); err != nil {
		panic(err)
	}
	warmup, _ := strconv.Atoi(os.Args[2])
	rounds, _ := strconv.Atoi(os.Args[3])

	for r := 0; r < warmup; r++ {
		for _, t := range titles {
			ptt.Parse(t)
		}
	}

	best := time.Duration(1<<62 - 1)
	checksum := 0
	for r := 0; r < rounds; r++ {
		sum := 0
		start := time.Now()
		for _, t := range titles {
			if out := ptt.Parse(t); out != nil {
				sum += len(out.Title)
			}
		}
		if elapsed := time.Since(start); elapsed < best {
			best = elapsed
		}
		checksum = sum
	}

	fmt.Printf("{\\"perItemUs\\": %f, \\"checksum\\": %d}",
		float64(best.Nanoseconds())/1000.0/float64(len(titles)), checksum)
}
`;

function rustManifest(ptCorePath) {
  return `[package]
name = "ptt-bench-runner"
version = "0.0.0"
edition = "2021"

[workspace]

[dependencies]
ptt-core = { path = ${JSON.stringify(ptCorePath.replace(/\\/g, '/'))} }
serde_json = "1"

[profile.release]
opt-level = 3
lto = true
codegen-units = 1
`;
}

const RUST_RUNNER = `use std::time::Instant;

fn title_len(parsed: &serde_json::Map<String, serde_json::Value>) -> usize {
    parsed
        .get("title")
        .and_then(|v| v.as_str())
        .map_or(0, |v| v.len())
}

fn main() {
    let args: Vec<String> = std::env::args().collect();
    let raw = std::fs::read_to_string(&args[1]).expect("corpus");
    let titles: Vec<String> = serde_json::from_str(&raw).expect("json");
    let warmup: usize = args[2].parse().unwrap();
    let rounds: usize = args[3].parse().unwrap();
    // "many" uses ptt_core::parse_many, which fans out across threads.
    let batched = args.get(4).map_or(false, |mode| mode == "many");
    let refs: Vec<&str> = titles.iter().map(String::as_str).collect();

    for _ in 0..warmup {
        if batched {
            let _ = ptt_core::parse_many(refs.iter().copied(), false);
        } else {
            for title in &titles {
                let _ = ptt_core::parse_title(title, false);
            }
        }
    }

    let mut best = u128::MAX;
    let mut checksum = 0usize;
    for _ in 0..rounds {
        let mut sum = 0usize;
        let start = Instant::now();
        if batched {
            if let Ok(all) = ptt_core::parse_many(refs.iter().copied(), false) {
                for parsed in &all {
                    sum += title_len(parsed);
                }
            }
        } else {
            for title in &titles {
                if let Ok(parsed) = ptt_core::parse_title(title, false) {
                    sum += title_len(&parsed);
                }
            }
        }
        let elapsed = start.elapsed().as_nanos();
        if elapsed < best {
            best = elapsed;
        }
        checksum = sum;
    }

    print!(
        "{{\\"perItemUs\\": {}, \\"checksum\\": {}}}",
        best as f64 / 1000.0 / titles.len() as f64,
        checksum
    );
}
`;

/** Worker body: parses an assigned slice on demand and reports back. */
const NODE_WORKER = `const { parentPort, workerData } = require('node:worker_threads');
const fs = require('node:fs');
const titles = JSON.parse(fs.readFileSync(workerData.corpusPath, 'utf8'));

(async () => {
  const { parseTorrentTitle: parse } = await import(workerData.entry);
  const { from, to } = workerData;
  const work = () => {
    let sum = 0;
    for (let i = from; i < to; i++) {
      const out = parse(titles[i]);
      sum += out && out.title ? out.title.length : 0;
    }
    return sum;
  };
  work();
  parentPort.on('message', () => parentPort.postMessage(work()));
  parentPort.postMessage('ready');
})();
`;

/**
 * Pool counterpart to the Rust batch entry. Workers are started once and kept
 * warm, so unlike parse_many the measured rounds exclude thread start-up.
 */
const NODE_POOL_RUNNER = `const fs = require('node:fs');
const os = require('node:os');
const { Worker } = require('node:worker_threads');

const [corpusPath, warmup, rounds, workerPath, entry] = process.argv.slice(2);
const titles = JSON.parse(fs.readFileSync(corpusPath, 'utf8'));
const threads = Math.max(1, os.availableParallelism ? os.availableParallelism() : os.cpus().length);
const chunk = Math.ceil(titles.length / threads);

const workers = [];
for (let w = 0; w < threads; w++) {
  workers.push(
    new Worker(workerPath, {
      workerData: {
        corpusPath,
        entry,
        from: w * chunk,
        to: Math.min(titles.length, (w + 1) * chunk)
      }
    })
  );
}

const once = (worker) =>
  new Promise((resolve) => worker.once('message', resolve));

(async () => {
  await Promise.all(workers.map(once));

  const round = async () => {
    const replies = workers.map(once);
    for (const worker of workers) worker.postMessage('go');
    return (await Promise.all(replies)).reduce((a, b) => a + b, 0);
  };

  for (let r = 0; r < Number(warmup); r++) await round();

  let best = Infinity;
  let checksum = 0;
  for (let r = 0; r < Number(rounds); r++) {
    const start = process.hrtime.bigint();
    checksum = await round();
    const ns = Number(process.hrtime.bigint() - start);
    if (ns < best) best = ns;
  }

  for (const worker of workers) await worker.terminate();
  process.stdout.write(
    JSON.stringify({
      perItemUs: best / 1000 / titles.length,
      checksum,
      threads
    })
  );
})();
`;

const PYTHON_RUNNER = `import json, sys, time
from PTT import parse_title

corpus_path, warmup, rounds = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
with open(corpus_path, encoding="utf-8") as handle:
    titles = json.load(handle)

for _ in range(warmup):
    for title in titles:
        parse_title(title)

best = float("inf")
checksum = 0
for _ in range(rounds):
    total = 0
    start = time.perf_counter_ns()
    for title in titles:
        out = parse_title(title)
        value = out.get("title") if out else None
        total += len(value) if value else 0
    elapsed = time.perf_counter_ns() - start
    best = min(best, elapsed)
    checksum = total

print(json.dumps({"perItemUs": best / 1000.0 / len(titles), "checksum": checksum}))
`;

// --------------------------------------------------------------------------
// Run
// --------------------------------------------------------------------------

const selected = targets.filter((t) => !only || only.includes(t.name));
const results = [];

for (const target of selected) {
  process.stdout.write(`${target.name}: `);
  try {
    if (!has('no-setup')) target.setup();
    const commit = describeCommit(target.dir);
    const measured = target.measure();
    results.push({ ...target, commit, ...measured });
    console.log(
      `${measured.perItemUs.toFixed(2)} μs/title ` +
        `(${Math.round(1e6 / measured.perItemUs).toLocaleString()} titles/s, ` +
        `checksum ${measured.checksum}${measured.threads ? `, ${measured.threads} threads` : ''})`
    );
  } catch (error) {
    const reason = String(error.stderr || error.message)
      .trim()
      .split('\n')
      .slice(-3)
      .join(' ');
    results.push({ ...target, error: reason });
    console.log(`skipped (${reason.slice(0, 120)})`);
  }
}

// --------------------------------------------------------------------------
// Report
// --------------------------------------------------------------------------

const ok = results.filter((r) => !r.error);
const ours = ok.find((r) => r.name === 'ours');
const oursParallel = ok.find((r) => r.name === 'ours-parallel');

function renderTable(rows, baseline) {
  if (rows.length === 0) return '_not measured_';
  return [
    '| Parser | Language | μs/title | titles/s | vs this repo |',
    '| --- | --- | ---: | ---: | ---: |',
    ...rows
      .slice()
      .sort((a, b) => a.perItemUs - b.perItemUs)
      .map((r) => {
        const ratio = baseline ? r.perItemUs / baseline.perItemUs : 1;
        const rel = !baseline
          ? '-'
          : r === baseline
            ? '1.00x'
            : `${ratio.toFixed(2)}x ${ratio >= 1 ? 'slower' : 'faster'}`;
        const name = r.repo ? `[${r.label}](${r.repo})` : `**${r.label}**`;
        const suffix = r.note ? ` <br><sub>${r.note}</sub>` : '';
        return (
          `| ${name}${suffix} | ${r.language} | ${r.perItemUs.toFixed(2)} | ` +
          `${Math.round(1e6 / r.perItemUs).toLocaleString()} | ${rel} |`
        );
      })
  ].join('\n');
}

const singleTable = renderTable(
  ok.filter((r) => !r.parallel),
  ours
);
const parallelTable = renderTable(
  ok.filter((r) => r.parallel),
  oursParallel
);

const versions = [
  ['Node', toolVersion('node --version')],
  ['Go', toolVersion('go version')],
  ['Rust', toolVersion('rustc --version')],
  ['Python', toolVersion('python --version')]
]
  .filter(([, v]) => v)
  .map(([k, v]) => `- ${k}: \`${v}\``)
  .join('\n');

// Single- and multi-threaded entries share a checkout, so list each once.
const commits = [...new Map(ok.map((r) => [r.label, r])).values()]
  .map((r) => {
    const where = r.repo ? `[${r.label}](${r.repo})` : r.label;
    return r.commit
      ? `- ${where}: \`${r.commit.short}\` (${r.commit.date})`
      : `- ${where}: revision unavailable`;
  })
  .join('\n');

const skipped = results
  .filter((r) => r.error)
  .map((r) => `- ${r.label}: ${r.error}`)
  .join('\n');

const report = `# Benchmarks

Generated by \`node bench/benchmark.mjs\`. Every parser below is cloned, built
and run on this machine over the same corpus with the same timing method, so
these are not each project's self-reported numbers.

## Single-threaded

One title at a time, which is the API all of these parsers offer.

${singleTable}

Lower is better. Each figure is the fastest of ${ROUNDS} passes over the whole
corpus after ${WARMUP} untimed warm-up passes.

## Batch, across cores

Shown separately because these numbers are not comparable with the ones above:
they use every core on the machine.

${parallelTable}

\`torrent-parse-rank\` exposes \`parse_many\`, which spawns a thread scope per
call. The row for this library is a \`worker_threads\` pool kept warm across
rounds, so its measured time excludes worker start-up while the Rust figure
includes thread spawn.

## Corpus

${corpus.length} torrent titles extracted from this repository's test suite
(median ${lengths[lengths.length >> 1]} characters, longest ${lengths[lengths.length - 1]}).
It is regenerated on every run and is not committed.

## Method

Each parser is driven by a small runner in its own language that loads the
corpus, parses every title, and reports the fastest complete pass. Runners sum
the length of each parsed title so the work cannot be optimised away. Timing
covers parsing only: corpus loading and process start-up are excluded.

Single-threaded figures repeat to within a few percent. The batch figures vary
considerably more, since they compete with whatever else the machine is doing
across every core. Treat gaps under about 20% there as noise.

## Caveats

Feature sets are not identical, and a parser that extracts fewer fields has
less work to do:

- \`go-ptt\`, \`dreulavelle/PTT\` and \`torrent-parse-rank\` carry handler
  tables of comparable size to this one (~430 patterns), so those comparisons
  are close to like-for-like.
- \`TheBeastLT/parse-torrent-title\` has a substantially smaller handler set and
  extracts fewer fields. Treat its number as a different workload, not a
  faster implementation of the same one.
- \`go-ptt\` is measured through its Go API, \`ptt.Parse\`. Its npm package
  instead spawns the Go binary as a gRPC server and sends batches to it, which
  adds protobuf encoding and a process hop to every call. That path is a
  deployment choice rather than a parsing speed, so it is not measured here.

## Revisions tested

${commits}
${skipped ? `\n## Skipped\n\n${skipped}\n` : ''}
## Environment

- OS: \`${process.platform} ${arch()}\`
- CPU: \`${cpus()[0]?.model?.trim() ?? 'unknown'}\` (${cpus().length} threads)
- Memory: ${Math.round(totalmem() / 1024 ** 3)} GB
${versions}
`;

writeFileSync(join(here, 'RESULTS.md'), report);
console.log(`\n${singleTable}\n`);
if (ok.some((r) => r.parallel)) console.log(`${parallelTable}\n`);
console.log(`wrote ${join('bench', 'RESULTS.md')}`);
