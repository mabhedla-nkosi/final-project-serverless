import { todosAcess } from '../dataLayer/todosAcess'
//import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
//import * as uuid from 'uuid'
//import * as createError from 'http-errors'
import {parseUserId} from "../auth/utils"
import {TodoUpdate} from "../models/TodoUpdate"

// TODO: Implement businessLogic
const uuidv4 = require('uuid/v4')
const toDoAccess = new todosAcess()
const logger = createLogger('TodosAccess')

export async function getTodosForUser(jwtToken: string): Promise<TodoItem[]> {
    logger.info('Get Todo')
    const userId = parseUserId(jwtToken)
    return toDoAccess.getTodosForUser(userId)
}

export async function createTodo(createTodoRequest: CreateTodoRequest, jwtToken: string): Promise<TodoItem> {
    logger.info('Create Todo')
    const userId = parseUserId(jwtToken)
    const todoId =  uuidv4()
    const bucketName = process.env.IMAGES_S3_BUCKET

    if(createTodoRequest.name.length===0){
        throw new Error("Name should be not empty.")
    }else if(!createTodoRequest.dueDate){
        throw new Error("Date should be not empty.")
    }
    
    return toDoAccess.createTodo({
        userId: userId,
        todoId: todoId,
        attachmentUrl:  `https://${bucketName}.s3.amazonaws.com/${todoId}`, 
        createdAt: new Date().getTime().toString(),
        done: false,
        ...createTodoRequest,
    })
}

export async function updateTodo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
    logger.info('Update todo')
    const userId = parseUserId(jwtToken);
    if(updateTodoRequest.name.length===0){
        throw new Error("Name should be not empty.")
    }else if(!updateTodoRequest.dueDate){
        throw new Error("Date should be not empty.")
    }
    return toDoAccess.updateTodo(updateTodoRequest, todoId, userId)
}

export async function deleteTodo(todoId: string, jwtToken: string): Promise<string> {
    logger.info('Delete todo')
    const userId = parseUserId(jwtToken);
    return toDoAccess.deleteTodo(todoId, userId)
}

export async function presignedUrl(todoId: string): Promise<string> {
    logger.info('Presigned url')
    return toDoAccess.presignedUrl(todoId)
}
