import express from 'express'
import { addUserRating, getUserCourseProgress, getUserData, purchaseCourse, updateUserCourseProgress, userEnrolledCourses } from '../controllers/userController.js'
import { requireAuth } from '@clerk/express'

const userRouter = express.Router()

userRouter.get('/data' , requireAuth() , getUserData)
userRouter.get('/enrolled-courses' , requireAuth(),userEnrolledCourses)
userRouter.post('/purchase' , requireAuth(), purchaseCourse)

userRouter.post('/update-course-progress',updateUserCourseProgress)
userRouter.post('/get-course-progress',getUserCourseProgress)
userRouter.post('/add-rating',addUserRating)

export default userRouter;

