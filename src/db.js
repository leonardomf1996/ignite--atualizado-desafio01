import fs from 'node:fs/promises';

const databasePath = new URL('../db.json', import.meta.url);

export class Db {
   #database = {};

   constructor() {
      fs.readFile(databasePath, 'utf8')
         .then((data) => {
            this.#database = JSON.parse(data);
         }).catch(() => {
            this.#persist();
         })
   }

   #persist() {
      fs.writeFile(databasePath, JSON.stringify(this.#database));
   }

   create(table, data) {
      if (Array.isArray(this.#database[table])) {
         this.#database[table].push(data);
      } else {
         this.#database[table] = [data]
      }

      this.#persist();

      return data;
   }

   list(table) {
      return this.#database[table] ?? [];
   }

   getById(table, id) {
      return this.#database[table].filter(row => row.id === id);
   }

   update(table, id, data) {
      const rowIndex = this.#database[table].findIndex(row => row.id === id);

      if (rowIndex > -1) {
         this.#database[table][rowIndex] = { id, ...data };
         this.#database[table][rowIndex].updated_at = new Date();

         this.#persist();
      }
   }

   delete(table, id) {
      const rowIndex = this.#database[table].findIndex(row => row.id === id);

      if (rowIndex > -1) {
         this.#database[table].splice(rowIndex, 1);
         this.#persist();
      }
   }

   completeTask(table, id) {
      const rowIndex = this.#database[table].findIndex(row => row.id === id);

      if (rowIndex > -1) {
         this.#database[table][rowIndex].completed_at = new Date();
         this.#database[table][rowIndex].updated_at = new Date();

         this.#persist();
      }
   }
}