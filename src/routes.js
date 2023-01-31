import { randomUUID } from 'node:crypto';

import { BuildRoutePath } from './helpers/build-route-path.js';
import { Db } from './db.js';

const db = new Db();

export const routes = [   
   {
      method: 'POST',
      path: BuildRoutePath('/tasks'),
      handler: (request, response) => {
         const requiredFields = ['title', 'description'];

         for (const field of requiredFields) {
            if (!request.body[field]) {
               throw new Error(`Invalid or nonexistent field: ${field}`);
            }
         }
            
         const { title, description } = request.body; 

         // Eu colocaria a data atual tbm em updated_at, mas na descrição não informa se precisa
         const task = {
            id: randomUUID(),
            title,
            description,
            completed_at: null, 
            created_at: new Date(),
            updated_at: null 
         }

         db.create('tasks', task);

         return response.writeHead(201).end(JSON.stringify(task));
      }, 
   },
   {
      method: 'GET',
      path: BuildRoutePath('/tasks'),
      handler: (request, response) => {         
         const tasks = db.list('tasks');

         return response.end(JSON.stringify(tasks));
      },
   },
   {
      method: 'PUT',
      path: BuildRoutePath('/tasks/:id'),
      handler: (request, response) => {     
         const { id } = request.params;
         const { title, description } = request.body;

         const taskAlreadyExists = db.getById('tasks', id);

         if (taskAlreadyExists.length === 0) {
            return response.writeHead(404).end();
         }

         db.update('tasks', id, { title, description });

         return response.writeHead(204).end();
      },
   },
   {
      method: 'DELETE',
      path: BuildRoutePath('/tasks/:id'),
      handler: (request, response) => {     
         const { id } = request.params;

         const taskAlreadyExists = db.getById('tasks', id);

         if (taskAlreadyExists.length === 0) {
            return response.writeHead(404).end();
         }

         db.delete('tasks', id);

         return response.writeHead(204).end();
      },
   },
   {
      method: 'PATCH',
      path: BuildRoutePath('/tasks/:id/complete'),
      handler: (request, response) => {     
         const { id } = request.params;

         const taskAlreadyExists = db.getById('tasks', id);

         if (taskAlreadyExists.length === 0) {
            return response.writeHead(404).end();
         }

         db.completeTask('tasks', id);

         return response.writeHead(204).end();
      },
   },
]