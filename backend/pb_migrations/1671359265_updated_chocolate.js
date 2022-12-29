migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nuqffai4r5m66wt")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "t9unkqmv",
    "name": "klasse",
    "type": "text",
    "required": true,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("nuqffai4r5m66wt")

  // update
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "t9unkqmv",
    "name": "klasse",
    "type": "text",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null,
      "pattern": ""
    }
  }))

  return dao.saveCollection(collection)
})
