import Stripe from "stripe";
import User from "../models/User.js";
import Course from "../models/Course.js";
import { clerkClient } from "@clerk/express";
import { courseProgress } from "../models/CourseProgress.js";
import {Purchase} from '../models/Purchase.js'

//get user data
// Get User Data
export const getUserData = async (req, res) => {
    try {

        const userId = req.auth().userId

        const user = await User.findById(userId)

        if (!user) {
            return res.json({ success: false, message: 'User Not Found' })
        }

        res.json({ success: true, user })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
// export const getUserData = async (req, res) => {
//   try {
//     const userId = req.auth().userId;
//     console.log("Auth payload:", req.auth());

//     let user = await User.findById(userId);

//     if (!user) {
//       //pulling out the user from the clerk(lazy-upsert)
//       const clerkUser = await clerkClient.users.getUser(userId);
//       user = await User.create({
//         _id: userId,
//         name: clerkUser.fullName || clerkUser.username || "Unknown",
//         email: clerkUser.emailAddresses[0].emailAddress,
//         imageUrl:
//           clerkUser.imageUrl || // fallback if needed
//           "https://via.placeholder.com/150",
//         enrolledCourses: [],
//       });

//       return res.json({ success: false, message: "User Not Found" });
//     }

//     res.json({ success: true, user });
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

//users enrolled courses with lect links

export const userEnrolledCourses = async (req, res) => {
  try {
    const userId = req.auth().userId;
    //the upserted user should be available by now
    const userData = await User.findById(userId).populate("enrolledCourses");

    res.json({ success: true, enrolledCourses: userData.enrolledCourses });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//purchase course
export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;

    const userId = req.auth().userId;

    const courseData = await Course.findById(courseId);
    const userData = await User.findById(userId);

    if (!userData || !courseData) {
      return res.json({ success: false, message: "Data Not Found" });
    }

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount: (
        courseData.coursePrice -
        (courseData.discount * courseData.coursePrice) / 100
      ).toFixed(2),
    };

    const newPurchase = await Purchase.create(purchaseData);

    // Stripe Gateway Initialize
    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

    const currency = process.env.CURRENCY.toLocaleLowerCase();

    // Creating line items to for Stripe
    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(newPurchase.amount) * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollments`,
      cancel_url: `${origin}/`,
      line_items: line_items,
      mode: "payment",
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//update user course progress
export const updateUserCourseProgress = async(req,res)=>{
  try {
    const userId = req.auth().userId
    const {courseId, lectureId} = req.body
    const progressData = await courseProgress.findOne({userId,courseId});

    if(progressData){
      if(progressData.lectureCompleted.includes(lectureId)){

        res.json({success:true, message:'Lecture Already Completed'})
      }
      progressData.lectureCompleted.push(lectureId);
      await progressData.save();


    }else{
      await  CourseProgress.create({
        userId,
        courseId,
        lectureCompleted:[lectureId]
      })
    }
    res.json({success:true, message:'Progress Updated'});
  } catch (error) {
    res.json({success:false,message:error.message})
    
  }
}

//get user course progress
export const getUserCourseProgress = async(req,res) =>{
  try {
    const userId = req.auth().userId
    const {courseId} = req.body
    const progressData = await courseProgress.findOne({userId,courseId});
    res.json({success:true, progressData})
  } catch (error) {
    res.json({success:false,message:error.message})
  }
}

//add user ratings to course
export const addUserRating = async (req, res) => {

    const userId = req.auth().userId;
    const { courseId, rating } = req.body;

    // Validate inputs
    if (!courseId || !userId || !rating || rating < 1 || rating > 5) {
        return res.json({ success: false, message: 'InValid Details' });
    }

    try {
        // Find the course by ID
        const course = await Course.findById(courseId);

        if (!course) {
            return res.json({ success: false, message: 'Course not found.' });
        }

        const user = await User.findById(userId);

        if (!user || !user.enrolledCourses.includes(courseId)) {
            return res.json({ success: false, message: 'User has not purchased this course.' });
        }

        // Check is user already rated
        const existingRatingIndex = course.courseRating.findIndex(r => r.userId === userId);

        if (existingRatingIndex > -1) {
            // Update the existing rating
            course.courseRating[existingRatingIndex].rating = rating;
        } else {
            // Add a new rating
            course.courseRating.push({ userId, rating });
        }

        await course.save();

        return res.json({ success: true, message: 'Rating added' });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

