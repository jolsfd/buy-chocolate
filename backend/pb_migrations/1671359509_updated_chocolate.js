migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nuqffai4r5m66wt")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "ga0rhsnr",
    "name": "paid",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nuqffai4r5m66wt")

  // remove
  collection.schema.removeField("ga0rhsnr")

  return dao.saveCollection(collection)
})
