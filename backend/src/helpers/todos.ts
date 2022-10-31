import { TodosAccess } from './todosAcess'

import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
//import * as createError from 'http-errors' 


// TODO: Implement businessLogic 
const todoAccess= new TodosAccess();
const bucketName = process.env.ATTACHMENT_S3_BUCKET;
export async function createTodo(createTodoRequest: CreateTodoRequest,
    user: string
  ): Promise<TodoItem>{

    const itemId = uuid.v4()
    const userId = user
    const createdAt=new Date().toISOString()
    const logger=createLogger('new todo');
    logger.info('user created a new todo')
   // const attachmentUrl=AttachmentUtils
    return await todoAccess.createTodos({
        todoId: itemId,
        userId: userId,
        name: createTodoRequest.name,
        dueDate: createTodoRequest.dueDate,
        createdAt: createdAt,
        done:false,
        attachmentUrl:`https://${bucketName}.s3.amazonaws.com/${itemId}`
      })
  }

  export async function getTodos(userId:String
  ): Promise<TodoItem[]>{
    const logger=createLogger('getting todos');
    logger.info('user retrieving todos',{
        userId:userId
    })
    return await todoAccess.getAllTodos(userId);
  }

  export async function deleteTodos(todoId:String,userId:String
    ): Promise<true>{
        const logger=createLogger('drop todo');
    logger.info('user deleted a  todo',{
        'todoId':todoId
    })
      return await todoAccess.deleteTodos(todoId,userId);
    }

export async function updateTodos(todo:UpdateTodoRequest,todoId:string,userId:string
    ): Promise<UpdateTodoRequest>{
        const logger=createLogger('updating todo');
        logger.info('user updated a todo')
        return await todoAccess.updateTodos({
            name:todo.name,
            dueDate:todo.dueDate,
            done:todo.done
        },todoId,userId);
    }


export function createAttachmentPresignedUrl(todoId:string
    ): Promise<string>{
          return AttachmentUtils(todoId);
    }