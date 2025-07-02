import { createContext } from "react";
import { dummyCourses } from "../assets/assets";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setisEducator] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  //Fetch all courses
  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  };

  //function to calulate avg rating of course
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }
    let totalRating = 0;
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });
    return totalRating / course.courseRatings.length;
  };

  // function to calculate the duration of Chapter
  const calculateChapterTime = (chapter) => {
    let time = 0;
    chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration));
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  //function to cal course duration(total duration)
  const calculateCourseDuration = (course) => {
    let time = 0;

    course.courseContent.map((chapter) =>
      chapter.chapterContent.map((lecture) => (time += lecture.lectureDuration))
    );
    return humanizeDuration(time * 60 * 1000, { units: ["h", "m"] });
  };

  //func to cal no of lectures in the course
  const calculateNoOfLectures = (course) =>{
    let totalLectures = 0;
    course.courseContent.forEach(chapter => {
        if(Array.isArray(chapter.chapterContent)){
            totalLectures += chapter.chapterContent.length;
        }
    });
    return totalLectures;
  }

  //fetch user enrolled courses
  const fetchUserEnrolledCourses = async () => {
    // This function would typically fetch the user's enrolled courses from the backend
    // For now, we will use dummy data
    setEnrolledCourses(dummyCourses);
  };

  useEffect(() => {
    fetchAllCourses()
    fetchUserEnrolledCourses();
  }, []);

  const value = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    isEducator,
    setisEducator,
    calculateNoOfLectures,
    calculateCourseDuration,
    calculateChapterTime,
    enrolledCourses,
    fetchUserEnrolledCourses,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
