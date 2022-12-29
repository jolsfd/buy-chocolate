migrate((db) => {
  const collection = new Collection({
    "id": "nuqffai4r5m66wt",
    "created": "2022-12-18 10:27:29.740Z",
    "updated": "2022-12-18 10:27:29.740Z",
    "name": "chocolate",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "hxgalo8j",
        "name": "absender",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "nzqfiinm",
        "name": "empfaenger",
        "type": "text",
        "required": true,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "musjbzpj",
        "name": "message",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
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
      }
    ],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("nuqffai4r5m66wt");

  return dao.deleteCollection(collection);
})
