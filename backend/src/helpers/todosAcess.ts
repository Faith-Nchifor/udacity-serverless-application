import * as AWS from 'aws-sdk'
const  AWSXRay= require ('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
//import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

//const logger = createLogger('TodosAccess')

export class TodosAccess{

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todosTable = process.env.TODOS_TABLE) {
      }
      //create todo
      async createTodos(todo: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
          TableName: this.todosTable,
          Item: todo
        }).promise()
    
        return todo
      }

      //update todo
      async updateTodos(todo: TodoUpdate,todoId:String,userId:string): Promise<TodoUpdate> {
        console.log('updating a particular todo item')
        
        await this.docClient.update({
          TableName: this.todosTable,
          Key:{
            'todoId':todoId,
            'userId':userId
          },
          UpdateExpression:"set #n = :todoName, dueDate = :todoDueDate, done= :isDone ",
          ExpressionAttributeValues:{
            ":todoName":todo.name,
            ":todoDueDate":todo.dueDate,
            ":isDone":todo.done
          },
          ExpressionAttributeNames:{
            "#n":'name'
          }
          
        }).promise()
    
        
        return todo
      }
      //next, query todos
      async getAllTodos(userId:String): Promise<TodoItem[]> {
        console.log('Getting todos by user')
    
        const result = await this.docClient.query({
          TableName: this.todosTable,
            //IndexName: 'index-name',
            KeyConditionExpression: 'userId = :paritionKey',
            ExpressionAttributeValues: {
                ':paritionKey': userId
            }
        }).promise()
    
        const items = result.Items
        return items as TodoItem[]
      }
      // delete todo

      async deleteTodos(todoId: String,userId:String): Promise<true> {
        await this.docClient.delete({
          TableName: this.todosTable,
          Key: {
            'todoId':todoId,
            'userId':userId
          }
        }).promise()
    
        return true
      }
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
      console.log('Creating a local DynamoDB instance')
      return new XAWS.DynamoDB.DocumentClient({
        region: 'localhost',
        endpoint: 'http://localhost:8000'
      })
    }
  
    return new XAWS.DynamoDB.DocumentClient()
  }