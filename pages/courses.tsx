import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'

import Router from 'next/router'
import { useEffect , useState } from 'react'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

import {  ref } from "firebase/storage";
import { uploadBytes } from 'firebase/storage';
import {storage , db} from '../database'
import { getDownloadURL } from 'firebase/storage';


import { doc, addDoc, collection, getDocs, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const courseArray = [
    { name: 'Course 1', code: 'CS101' },
    { name: 'Course 2', code: 'CS102' },
  ];


    const [name , setName] = useState("")
    const [description , setDescription] = useState("")
    const [code , setCode] = useState("")
    const [courses , setCourses] = useState<any[]>([])


  const [open, setOpen] = useState(true);
  const Menus = [
    { title: "Student", src: "Chart_fill" , l : "students" },
    { title: "Courses", src: "Chat" , l : "courses" },
    { title: "Attendance", src: "User", gap: true , l : "attendance" },
    
  ];
  const getter = async () => {

    const querySnapshot:any = await getDocs(query(collection(db, "courses")));


    let eventlist:any[]= []
    await querySnapshot.forEach((doc:any) => {
       eventlist.push({  
        id: doc.id,
        name: doc.data().name,
        code: doc.data().code,
        description: doc.data().description,

      });
    })

    setCourses(eventlist)
    console.log(courses);
  }
  useEffect(() => {

    
    getter()


  }, [])
 

  const submitHandler =async (e:any)=>{
    e.preventDefault();
  

    const data = {name , code , description}
      await addDoc(collection(db, "courses"),data);
      getter()
    
  }

  const updatehandler = async (course: any) => {


    let u: string = course.id
    await updateDoc(doc(db, "courses", u), {
      name: name,
      code: code,
      description: description,
    });
    getter()

    // let updated = {
    //   id: u,
    //   Eid: eid,
    //   title: title,
    //   location: location,
    //   description: description,
    //   time: time,
    //   date: date,
    //   creator: c,
    // }
    // let updatedevents = events.map((e) => { if (event.id == e.id) { return updated } else { return e } })
    // setEvents(updatedevents)

  }
  const removehandler = async (course: any) => {

    await deleteDoc(doc(db, "courses", course.id));
  getter()
 
   
  }
  const publiceventhandler = ()=>{
    Router.push('/publicevents')
  }
  return (
   <main>
    {/* {courses.length >0 && <p>{courses[1].name}</p>} */}
    
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
      <div className="h-full">
        <div className="mx-auto w-4/5">
        <form className=''>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">Add Course</h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            This Course will be displayed publicly so be careful what you share.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900">
                Course name.
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  
                  <input
                  onChange={(e)=>{setName(e.target.value)}}
                  value={name}
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
                Course code.
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  
                  <input
                   onChange={(e)=>{setCode(e.target.value)}}
                   value={code}
                    type="text"
                    name="username"
                    
                    
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Code here"
                  />
                </div>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                Description
              </label>
              <div className="mt-2">
                <textarea
                 onChange={(e)=>{setDescription(e.target.value)}}
                 value={description}
                  id="description"
                  name="description"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  
                />
              </div>
              
            </div>


        
          </div>
        </div>

      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">

        <button
        onClick={(e)=>submitHandler(e)}
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Add course
        </button>
      </div>
    </form>
        </div>
    <section className='w-4/5 mx-auto'>
    <table className="table-auto w-full">
      <thead>
        <tr>
          <th className="px-4 py-2">Course name</th>
          <th className="px-4 py-2">Course code</th>
          <th className="px-4 py-2">Edit</th>
          <th className="px-4 py-2">Delete</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.code}>
            <td className="px-4 py-2">{course.name}</td>
            <td className="px-4 py-2">{course.code}</td>
            <td className="px-4 py-2">
              <button className="btn btn-primary" onClick={() => { updatehandler(course) }}>Edit</button>
            </td>
            <td className="px-4 py-2">
              <button className="btn btn-danger" onClick={() => { removehandler(course) }}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </section>
    
      </div>
    </div>
   </main>
  )
}
