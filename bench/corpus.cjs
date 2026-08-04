/**
 * Harvests every torrent title the test suite feeds to a parser, for use as a
 * benchmark corpus and as the input set for the prefilter soundness test.
 *
 * Walks the TypeScript AST rather than matching text, so no test-table shape is
 * missed. Titles come from parse call arguments, `title:` properties, tuple
 * table rows and flat arrays of titles.
 */
const { readdirSync, readFileSync } = require('node:fs');
const { join } = require('node:path');
const ts = require('typescript');

const TEST_DIR = join(__dirname, '..', 'src', '__tests__');

const isStringLike = (node) =>
  node !== undefined &&
  (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node));

/** Calls whose first argument is a raw title. */
function isParseCall(node) {
  const callee = node.expression;
  if (ts.isIdentifier(callee)) return callee.text === 'parseTorrentTitle';
  if (ts.isPropertyAccessExpression(callee)) {
    return callee.name.text === 'parse' || callee.name.text === 'parseTitle';
  }
  return false;
}

function buildCorpus() {
  const titles = [];
  const seen = new Set();
  const collect = (node) => {
    if (!isStringLike(node) || !node.text || seen.has(node.text)) return;
    seen.add(node.text);
    titles.push(node.text);
  };

  for (const file of readdirSync(TEST_DIR)) {
    if (!file.endsWith('.test.ts')) continue;
    const source = ts.createSourceFile(
      file,
      readFileSync(join(TEST_DIR, file), 'utf8'),
      ts.ScriptTarget.Latest,
      true
    );

    const walk = (node) => {
      if (ts.isCallExpression(node) && isParseCall(node)) {
        collect(node.arguments[0]);
      } else if (
        ts.isPropertyAssignment(node) &&
        ts.isIdentifier(node.name) &&
        node.name.text === 'title'
      ) {
        // A `title:` under `expected` is an output, not an input.
        const grandparent = node.parent && node.parent.parent;
        const underExpected =
          grandparent !== undefined &&
          ts.isPropertyAssignment(grandparent) &&
          ts.isIdentifier(grandparent.name) &&
          grandparent.name.text === 'expected';
        if (!underExpected) collect(node.initializer);
      } else if (ts.isArrayLiteralExpression(node)) {
        const rows = node.elements.filter(ts.isArrayLiteralExpression);
        // A tuple table: only element 0 of each row is an input. Rows are not
        // recursed into, so an expected-value array is never mistaken for one.
        if (rows.length >= 2 && rows.length === node.elements.length) {
          for (const row of rows) collect(row.elements[0]);
        } else if (
          node.elements.length >= 3 &&
          node.elements.every(isStringLike) &&
          node.elements.every(
            (e) => e.text.length >= 12 && /[._ ]/.test(e.text)
          )
        ) {
          for (const element of node.elements) collect(element);
        }
      }
      ts.forEachChild(node, walk);
    };
    walk(source);
  }

  return titles;
}

module.exports = { buildCorpus };

if (require.main === module) {
  const titles = buildCorpus();
  const target = process.argv[2];
  if (target) {
    require('node:fs').writeFileSync(target, JSON.stringify(titles));
    console.error(`corpus: ${titles.length} titles -> ${target}`);
  } else {
    process.stdout.write(JSON.stringify(titles));
  }
}
