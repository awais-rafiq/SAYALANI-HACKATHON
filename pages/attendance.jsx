import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'

import Router from 'next/router'
import { useEffect, useState } from 'react'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

import { ref } from "firebase/storage";
import { uploadBytes } from 'firebase/storage';
import { storage, db } from '../database'
import { getDownloadURL } from 'firebase/storage';


import { doc, addDoc, collection, getDocs, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import AttendanceChart from "../components/Bar/bar"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const courseArray = [
    { name: 'Course 1', code: 'CS101' },
    { name: 'Course 2', code: 'CS102' },
  ];


  const [stuID, setStuID] = useState("")
  const [courseID, setCourseID] = useState("")
  const [date, setDate] = useState("")
  const [status, setStatus] = useState("")

  const [list , setList] = useState([])
  const [sortedIDS , setSortedIDS] = useState([])


  


  const [open, setOpen] = useState(true);
  const Menus = [
    { title: "Student", src: "Chart_fill" , l : "students" },
    { title: "Courses", src: "Chat" , l : "courses" },
    { title: "Attendance", src: "User", gap: true , l : "attendance" },
    
  ];

  const getter = async () => {

    const querySnapshot = await getDocs(query(collection(db, "attendance")));
    


    let eventlist = []
    await querySnapshot.forEach((doc) => {
      eventlist.push({
        id: doc.id,
        stuID: doc.data().stuID,
        courseID: doc.data().courseID,
        date: doc.data().date,
        status: doc.data().status,
      });
    })

    // setList(eventlist)


    const attendance = [
      { id: 1, stuID: 1, courseID: 1, date: '2023-08-08', status: 'Present' },
      { id: 2, stuID: 2, courseID: 1, date: '2023-08-08', status: 'Absent' },
      { id: 3, stuID: 3, courseID: 2, date: '2023-08-09', status: 'Present' },
      { id: 4, stuID: 4, courseID: 2, date: '2023-08-09', status: 'Absent' },
      { id: 5, stuID: 5, courseID: 3, date: '2023-08-10', status: 'Present' },
    ];
    
    const getSortedCourseIDs = () => {
      const sortedCourseIDs= [];
    
      for (const attendanceRecord of eventlist) {
        if (!sortedCourseIDs.includes(attendanceRecord.courseID)) {
          sortedCourseIDs.push(attendanceRecord.courseID);
        }
      }
    
      sortedCourseIDs.sort((a, b) => a - b);
    
      return sortedCourseIDs;
    };
    
    const sortedCourseIDs = getSortedCourseIDs();

    
    setSortedIDS(sortedCourseIDs)
    console.log("onlu sorted ids : " ,sortedIDS);



    //
    const sortedAttendance = eventlist.sort((a, b) => {
      const courseIDIndex = sortedCourseIDs.indexOf(a.courseID);
      const otherCourseIDIndex = sortedCourseIDs.indexOf(b.courseID);
    
      if (courseIDIndex === otherCourseIDIndex) {
        return 0;
      }
    
      if (courseIDIndex < otherCourseIDIndex) {
        return -1;
      } else {
        return 1;
      }
    });
    
console.log(sortedAttendance);
setList(sortedAttendance)

  }
 
  useEffect(() => {


    getter()
  


  }, [])


  const submitHandler = async (e) => {
    e.preventDefault();


    const data = { stuID, courseID, date, status }
    await addDoc(collection(db, "attendance"), data);
    getter()

  }

  const updatehandler = async (attendance) => {


    let u = attendance.id
    await updateDoc(doc(db, "attendance", u), {
      stuID : stuID,
      courseID : courseID,
      date: date,
      status: status,
    });
    getter()

  
  }
  const removehandler = async (attendance) => {

    await deleteDoc(doc(db, "attendance", attendance.id));
    getter()


  }
  const publiceventhandler = () => {
    Router.push('/publicevents')
  }
  return (
    <main>
      {/* {courses.length >0 && <p>{courses[1].name}</p>} */}

      <div className="flex">
        <div
          className={` ${open ? "w-72" : "w-20 "
            } bg-red-400 h-screen p-5  pt-8 relative duration-300`}
        >
          <img
            src="/control.png"
            className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
           border-2 rounded-full  ${!open && "rotate-180"}`}
            onClick={() => setOpen(!open)}
          />
          <div className="flex gap-x-4 items-center">
            <img
              src="/logo.png"
              className={`cursor-pointer duration-500 ${open && "rotate-[360deg]"
                }`}
            />
            <h1
              className={`text-white origin-left font-medium text-xl duration-200 ${!open && "scale-0"
                }`}
            >
              Designer
            </h1>
          </div>
          <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <Link href={`/${Menu.l}`}>
            <li
              key={index}
              className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-2"} ${
                index === 0 && "bg-light-white"
              } `}
            >
              <img src={`/${Menu.src}.png`} />
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                {Menu.title}
              </span>
            </li></Link>
          ))}
        </ul>
        </div>
        <div className="h-full">
          <div className="mx-auto w-4/5 ">
            <form className=''>
              <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                  <h2 className="text-base font-semibold leading-7 text-gray-900">Add Attendance</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-600">
                    This Course will be displayed publicly so be careful what you share.
                  </p>

                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                      <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                        Student ID
                      </label>
                      <div className="mt-2">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">

                          <input
                            onChange={(e) => { setStuID(e.target.value) }}
                            value={stuID}
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="name"
                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="name here"
                          />
                        </div>
                      </div>


                      <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                        Course ID
                      </label>
                      <div className="mt-2">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">

                          <input
                             onChange={(e) => { setCourseID(e.target.value) }}
                            value={courseID}
                            type="text"
                            name="username"


                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Code here"
                          />
                        </div>
                      </div>


                      <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                        Date
                      </label>
                      <div className="mt-2">
                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">

                          <input
                            onChange={(e) => { setDate(e.target.value) }}
                            value={date}
                            type="date"
                            name="username"


                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Code here"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                        Status
                      </label>
                      <div className="mt-2">
                        <select
                          className="select select-bordered w-full max-w-xs rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-300"
                          onChange={(e)=> setStatus(e.target.value)}
                          value={status}
                        >
                          <option value="" selected disabled>Choose an option</option>
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                        </select>
                      </div>

                    </div>



                  </div>
                </div>

              </div>

              <div className="mt-6 flex items-center justify-end gap-x-6">

                <button
                   onClick={(e) => submitHandler(e)}
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Add Attendance
                </button>
              </div>
            </form>
          </div>
          <section className='w-4/5 mx-auto'>
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2">ID</th>
                  <th className="px-4 py-2">courseId</th>
                  <th className="px-4 py-2">studentId</th>
                 
                  <th className="px-4 py-2">date</th>
                  <th className="px-4 py-2">status</th>
                  <th className="px-4 py-2">Update</th>
                  <th className="px-4 py-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {list.map((attendance) => (
                  <tr key={attendance.id}>
                    <td className="px-4 py-2">{attendance.id}</td>
                    <td className="px-4 py-2 text-red-500 font-bold">{attendance.courseID}</td>
                    <td className="px-4 py-2">{attendance.stuID}</td>
                   
                    <td className="px-4 py-2">{attendance.date}</td>
                    <td className="px-4 py-2">{attendance.status}</td>
                    <td className="px-4 py-2">
                      <button className="btn btn-primary" onClick={() => { updatehandler(attendance) }}>Update</button>
                    </td>
                    <td className="px-4 py-2">
                      <button className="btn btn-danger" onClick={() => { removehandler(attendance) }}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <AttendanceChart list={list} />

        </div>
      </div>
    </main>
  )
}
