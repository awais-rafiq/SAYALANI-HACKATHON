import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'

import Router from 'next/router'
import { useEffect , useState } from 'react'
import Link from 'next/link'

import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'


import { ref } from "firebase/storage";
import { uploadBytes } from 'firebase/storage';
import { storage, db } from '../database'
import { getDownloadURL } from 'firebase/storage';


import { doc, addDoc, collection, getDocs, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import AttendanceChart from "../components/Bar/bar"


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [open, setOpen] = useState(true);
  const [list , setList] = useState<any[]>([])
  const [students , setStudents] = useState<any[]>([])
  const [courses , setCourses] = useState<any[]>([])
  const [sortedIDS , setSortedIDS] = useState([])




  const Menus = [
    { title: "Student", src: "Chart_fill" , l : "students" },
    { title: "Courses", src: "Chat" , l : "courses" },
    { title: "Attendance", src: "User", gap: true , l : "attendance" },
    
  ];

  const getter = async () => {

    const querySnapshot:any = await getDocs(query(collection(db, "students")));


    let eventlist:any[]= []
    await querySnapshot.forEach((doc:any) => {
       eventlist.push({  
        id: doc.id,
        name : doc.data().name,
        phone: doc.data().phone,
        address: doc.data().address,
        dob :  doc.data().dob,
      });
    })

    setStudents(eventlist)

    const querySnapshot2:any = await getDocs(query(collection(db, "courses")));


    let eventlist2:any[]= []
    await querySnapshot2.forEach((doc:any) => {
       eventlist2.push({  
        id: doc.id,
        name: doc.data().name,
        code: doc.data().code,
        description: doc.data().description,

      });
    })

    setCourses(eventlist2)
    console.log(courses);




    const querySnapshot3 = await getDocs(query(collection(db, "attendance")));
    


    let eventlist3 = []
    await querySnapshot3.forEach((doc) => {
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
      const sortedCourseIDs:any= [];
    
      for (const attendanceRecord of eventlist) {
        if (!sortedCourseIDs.includes(attendanceRecord.courseID)) {
          sortedCourseIDs.push(attendanceRecord.courseID);
        }
      }
    
      sortedCourseIDs.sort((a:any, b:any) => a - b);
    
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



  const publiceventhandler = ()=>{
    Router.push('/publicevents')
  }
  return (
   <main>
  <div className="flex">
      <div
        className={` ${
          open ? "w-72" : "w-20 "
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
            className={`cursor-pointer duration-500 ${
              open && "rotate-[360deg]"
            }`}
          />
          <h1
            className={`text-white origin-left font-medium text-xl duration-200 ${
              !open && "scale-0"
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
      <div className="h-full mx-auto w-4/5">
              <h1>Insights</h1>
              <div className='w-1/2'>
              <h5 className='font-bold'>Total students</h5>
              <h5 className='bg-red-600 rounded-full text-white text-center'>{students.length}</h5>

              <h5 className='font-bold mt-10'>Total Courses</h5>
              <h5 className='bg-red-600 rounded-full text-white text-center'>{courses.length}</h5>
              </div>
              <AttendanceChart list={list} />
      </div>
      
    </div>
   </main>
  )
}
