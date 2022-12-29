migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nuqffai4r5m66wt")

  collection.createRule = "@request.data.paid = null || @request.data.paid = false"

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nuqffai4r5m66wt")

  collection.createRule = null

  return dao.saveCollection(collection)
})
