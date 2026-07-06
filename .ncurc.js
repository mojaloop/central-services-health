module.exports = {
  // Reject only dependencies whose upgrade is empirically broken; document the concrete failure.
  reject: [
    // tape >=5.10.0 ships a tsconfig.json extending the unpublished @ljharb/tsconfig, which breaks
    // ts-node script-mode runs of node_modules/tape/bin/tape with TS6053 (verified on 5.10.2 via
    // npm pack diff against 5.9.0). Hold at 5.9.x until fixed upstream or the test scripts pass an
    // explicit --project to ts-node.
    "tape"
  ]
}
