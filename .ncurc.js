module.exports = {
  // Reject only dependencies whose upgrade is empirically broken; document the concrete failure.
  reject: [
    // tape >=5.10.0 ships a tsconfig.json extending the unpublished @ljharb/tsconfig, which breaks
    // ts-node script-mode runs of node_modules/tape/bin/tape with TS6053 (verified on 5.10.2 via
    // npm pack diff against 5.9.0). Hold at 5.9.x until fixed upstream or the test scripts pass an
    // explicit --project to ts-node.
    "tape",
    // @types/node's major must match the Node runtime major in .nvmrc (currently 24). A higher major
    // makes tsc accept Node-26-only APIs that then crash at runtime on Node 24 — a failure mode the
    // test gates cannot catch (it only weakens type checking). Bump together with the runtime.
    "@types/node"
  ]
}
