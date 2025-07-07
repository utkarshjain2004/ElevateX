import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/AppContext'
import axios from 'axios'
import { Line } from 'rc-progress'
import Footer from '../../components/student/Footer'
import { toast } from 'react-toastify'

const MyEnrollments = () => {
  const {
    userData,
    enrolledCourses,
    fetchUserEnrolledCourses,
    navigate,
    backendUrl,
    getToken,
    calculateCourseDuration,
    calculateNoOfLectures
  } = useContext(AppContext)

  const [progressArray, setProgressData] = useState([])

  const getCourseProgress = async () => {
    try {
      const token = await getToken()
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            `${backendUrl}/api/user/get-course-progress`,
            { courseId: course._id },
            { headers: { Authorization: `Bearer ${token}` } }
          )

          const totalLectures = calculateNoOfLectures(course)
          const lectureCompleted = data.progressData
            ? data.progressData.lectureCompleted.length
            : 0

          return { totalLectures, lectureCompleted }
        })
      )
      setProgressData(tempProgressArray)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses()
    }
  }, [userData])

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress()
    }
  }, [enrolledCourses])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main Content */}
      <div className="flex-1 md:px-36 px-8 pt-10">
        <h1 className="text-2xl font-semibold">My Enrollments</h1>

        <table className="md:table-auto table-fixed w-full border mt-6">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
            <tr>
              <th className="px-4 py-3 font-semibold truncate">Course</th>
              <th className="px-4 py-3 font-semibold truncate max-sm:hidden">Duration</th>
              <th className="px-4 py-3 font-semibold truncate max-sm:hidden">Completed</th>
              <th className="px-4 py-3 font-semibold truncate">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {enrolledCourses.map((course, index) => {
              const progress = progressArray[index] || { totalLectures: 0, lectureCompleted: 0 }
              const percent = progress.totalLectures
                ? (progress.lectureCompleted * 100) / progress.totalLectures
                : 0

              return (
                <tr key={index} className="border-b border-gray-500/20">
                  <td className="px-4 py-3 flex items-center space-x-3">
                    <img src={course.courseThumbnail} alt="" className="w-14 sm:w-24 md:w-28" />
                    <div className="flex-1">
                      <p className="mb-1 max-sm:text-sm">{course.courseTitle}</p>
                      <Line
                        className="bg-gray-300 rounded-full"
                        strokeWidth={2}
                        percent={percent}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">
                    {calculateCourseDuration(course)}
                  </td>
                  <td className="px-4 py-3 max-sm:hidden">
                    {`${progress.lectureCompleted} / ${progress.totalLectures}`}
                    <span className="text-xs ml-2">Lectures</span>
                  </td>
                  <td className="px-4 py-3 text-right max-sm:text-xs">
                    <button
                      onClick={() => navigate('/player/' + course._id)}
                      className="px-3 sm:px-5 py-1.5 sm:py-2 bg-emerald-600 text-white rounded"
                    >
                      {progress.lectureCompleted === progress.totalLectures ? 'Completed' : 'On Going'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer always at bottom */}
      <Footer />
    </div>
  )
}

export default MyEnrollments
