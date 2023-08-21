module.exports = {
  // Add a TODO comment indicating the reason for each rejected dependency upgrade added to this list, and what should be done to resolve it (i.e. handle it through a story, etc).
  reject: [
    "@hapi/hapi", // versions >20.2.2 are breaking changes
    "@types/hapi__hapi" // versions >20.0.10 are breaking changes
  ]
}
