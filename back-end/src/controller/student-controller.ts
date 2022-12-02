import { getRepository } from "typeorm"
import { NextFunction, Request, Response } from "express"
import { Student } from "../entity/student.entity"
import { CreateStudentInput, UpdateStudentInput } from "../interface/student.interface"

export class StudentController {
  private studentRepository = getRepository(Student)

  async allStudents(request: Request, response: Response, next: NextFunction) {
    try {
      return this.studentRepository.find()
    } catch (err) {
      next(err)
    }
  }

  async getStudent(request: Request, response: Response, next: NextFunction) {
    try {
      const { params } = request

      const student = await this.studentRepository.findOne({
        where: {
          id: params.id,
        },
      })

      if (!student) {
        throw new Error(`student with id ${params.id} not found`)
      }

      return student
    } catch (err) {
      next(err)
    }
  }

  async createStudent(request: Request, response: Response, next: NextFunction) {
    try {
      const { body: params } = request

      const createStudentInput: CreateStudentInput = {
        first_name: params.first_name,
        last_name: params.last_name,
        photo_url: params.photo_url,
      }
      const student = new Student()
      student.prepareToCreate(createStudentInput)

      return this.studentRepository.save(student)
    } catch (err) {
      next(err)
    }
  }

  async updateStudent(request: Request, response: Response, next: NextFunction) {
    try {
      const { body: params } = request

      const student = await this.studentRepository.findOne(params.id)
      const updateStudentInput: UpdateStudentInput = {
        id: params.id,
        first_name: params.first_name,
        last_name: params.last_name,
        photo_url: params.photo_url,
      }
      student.prepareToUpdate(updateStudentInput)

      return this.studentRepository.save(student)
    } catch (err) {
      next(err)
    }
  }

  async removeStudent(request: Request, response: Response, next: NextFunction) {
    try {
      let studentToRemove = await this.studentRepository.findOne(request.params.id)

      if (!studentToRemove) {
        throw new Error(`student with id ${request.params.id} not found`)
      }

      return await this.studentRepository.remove(studentToRemove)
    } catch (err) {
      next(err)
    }
  }
}
