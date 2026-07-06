module.exports = {
  // Add a TODO comment indicating the reason for each rejected dependency upgrade added to this list, and what should be done to resolve it (i.e. handle it through a story, etc).
  reject: [
    // TODO: eslint v10 is a breaking major (flat-config/rule changes); upgrade together with @typescript-eslint support via a dedicated story
    "eslint",
    // TODO: typescript v6 is a breaking major requiring tsconfig migration (moduleResolution/downlevelIteration) and may change emitted output of this published library; handle via a dedicated story
    "typescript",
    // TODO: @types/node v26 targets Node 26; repo runs Node 24 (.nvmrc) — keep on latest 25.x until the Node runtime is upgraded
    "@types/node",
    // TODO: pre-commit@2.0.0 (2026-04) is the first release after 9 years of dormancy (1.2.2 is from 2016); hold at 1.2.2 until the release is vetted (supply-chain caution)
    "pre-commit",
    // TODO: tape >=5.10.0 ships a tsconfig.json extending the unpublished @ljharb/tsconfig, which breaks ts-node script-mode runs of node_modules/tape/bin/tape (TS6053); hold at 5.9.0 until fixed upstream or the test scripts pass an explicit --project to ts-node
    "tape"
  ]
}
