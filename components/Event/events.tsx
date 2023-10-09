import React from 'react'
import styles from '../../styles/events.module.css'
import { useState } from 'react'
import Button from 'react-bootstrap/Button';
import { async } from '@firebase/util';
import { doc, addDoc, collection, getDocs, setDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";
import { useRouter } from 'next/router'
import { ChangeEvent } from "react"
import { ref } from "firebase/storage";
import { uploadBytes } from 'firebase/storage';
import { storage, db } from '../../database'
import { getDownloadURL } from 'firebase/storage';
import { useEffect } from 'react'
import Card from 'react-bootstrap/Card';
import { toast } from "react-toastify";
import Form from 'react-bootstrap/Form';

type typeofevent = {
  id: string,
  Eid: string,
  title: string,
  date: string,
  time: string,
  location: string,
  description: string,
  creator: string
}


const events = () => {
  const [id, setId] = useState("")
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")

  const [Creator, setCreator] = useState("")
  const [eid, setEid] = useState("")
  const [events, setEvents] = useState<typeofevent[]>([])



  useEffect(() => {

    getter()

  }, [])

  const eventsubmithandler = async () => {
    if (!title || !date || !time || !location || !description || !id) {
      toast.warn('Enter the required data about the your Event!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
    try {
      let creator123: any = localStorage.getItem("uid")
      console.log(creator123);

      localStorage.setItem("creator123", creator123)
      setCreator(creator123)
      console.log(Creator);

      const newdoc = {
        Eid: id,
        title: title,
        date: date,
        time: time,
        location: location,
        description: description,
        creator: creator123
      }
      const docRef = await addDoc(collection(db, "events."), newdoc);
      toast('Event arranged successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setEvents([...events, { ...newdoc, id: docRef.id }])


    } catch (error) {
      console.log("ERROR");

    }
  }
  const getter = async () => {

    const querySnapshot = await getDocs(query(collection(db, "events."), where("creator", "==", localStorage.getItem("uid"))));


    let eventlist: typeofevent[] = []
    querySnapshot.forEach((doc) => {
      eventlist.push({
        Eid: doc.data().Eid,
        id: doc.id,
        title: doc.data().title,
        date: doc.data().time,
        time: doc.data().time,
        location: doc.data().location,
        description: doc.data().description,
        creator: doc.data().creator,

      });
    })

    setEvents(eventlist)
  }
  const updatehandler = async (event: typeofevent) => {

    let u: string = event.id
    let c: string = event.creator
    await updateDoc(doc(db, "events.", u), {
      Eid: eid,
      title: title,
      location: location,
      description: description,
      time: time,
      date: date,
      creator: c,
    });
    toast('Event updated successfully!', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    let updated = {
      id: u,
      Eid: eid,
      title: title,
      location: location,
      description: description,
      time: time,
      date: date,
      creator: c,
    }
    let updatedevents = events.map((e) => { if (event.id == e.id) { return updated } else { return e } })
    setEvents(updatedevents)

  }
  const removehandler = async (event: typeofevent) => {

    await deleteDoc(doc(db, "events.", event.id));
    toast('Event disintegrated successfully', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    let filtered = events.filter((e: typeofevent) => {
      if (event.id != e.id)
        return e
    })
    setEvents(filtered)
  }
  return (
    <>
      <div className={styles.textc}>
        <h1 className={styles.text}>Create an event with us!</h1>
        <span className={styles.bulb}></span>
      </div>

      <div className="container"><div className="row">
        <div className="col"><Form>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Event ID</Form.Label>
            <Form.Control type="text" placeholder="Enter ID" onChange={(e) => { setId(e.target.value) }}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" placeholder="Enter Title" onChange={(e) => { setTitle(e.target.value) }} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" placeholder="Enter Date"  onChange={(e) => { setDate(e.target.value) }}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Time</Form.Label>
            <Form.Control type="time" placeholder="Enter Time" onChange={(e) => { setTime(e.target.value) }} />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" placeholder="Enter Location"  onChange={(e) => { setLocation(e.target.value) }}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Description</Form.Label>
            <Form.Control type="text" placeholder="Enter Description" onChange={(e) => { setDescription(e.target.value) }} />
          </Form.Group>

          <Button variant="primary" type="submit" onClick={eventsubmithandler}>
            Submit Event
          </Button>
        </Form></div></div></div>







{/* 
      <div className="container">

        <div className="row">
          <div className="col-3"></div><div className="col-2">ID</div><div className="col-4"><input type="text" onChange={(e) => { setId(e.target.value) }} placeholder="Unique ID" name="id"></input></div>
        </div>
        <div className="row">
          <div className="col-3"></div><div className="col-2">Title</div><div className="col-4"><input type="text" onChange={(e) => { setTitle(e.target.value) }} placeholder="Title" name="text"></input></div>
        </div>
        <div className="row">
          <div className="col-3"></div><div className="col-2">Date</div><div className="col-4"><input type="date" onChange={(e) => { setDate(e.target.value) }} name="date"></input></div>
        </div>
        <div className="row">
          <div className="col-3"></div><div className="col-2">Time</div><div className="col-4"><input type="time" onChange={(e) => { setTime(e.target.value) }} name="time"></input></div>
        </div>
        <div className="row">
          <div className="col-3"></div><div className="col-2">Location</div><div className="col-4"><input type="text" onChange={(e) => { setLocation(e.target.value) }} placeholder="location" name="location"></input></div>
        </div>
        <div className="row">
          <div className="col-3"></div><div className="col-2">Description</div><div className="col-4"><input type="text" onChange={(e) => { setDescription(e.target.value) }} placeholder="description" name="descriprtion"></input></div>
        </div>
        <div className="row">
          <div className="col-5"></div><div className="col-1"><Button onClick={eventsubmithandler} variant="info">SubmitEvent</Button>{' '}</div><div className="col-6"></div>
        </div>

      </div> */}

      <div className={`container-fluid ${styles.uploadcard}`}>


      </div>
      {/* MAPPING */}
      {events.map((event: typeofevent) => {
        return (
          <>
            <hr />
            <h3 className={styles.eventtitle}>{event.title}</h3>
            <div className="container">
              <div className="row">
                <div className="col-3"></div><div className="col-2">Date</div><div className="col-2"></div><div className="col-4">{event.date}</div><div className="col-1"></div>
              </div>
              <div className="row">
                <div className="col-3"></div><div className="col-2">Time</div><div className="col-2"></div><div className="col-4">{event.time}</div><div className="col-1"></div>
              </div>
              <div className="row">
                <div className="col-3"></div><div className="col-2">Description</div><div className="col-2"></div><div className="col-4">{event.description}</div><div className="col-1"></div>
              </div>
              <div className="row">
                <div className="col-3"></div><div className="col-2">Location</div><div className="col-2"></div><div className="col-4">{event.location}</div><div className="col-1"></div>
              </div>

              <div className="row">
                <div className="col-4"></div>
                <div className="col-4"><Button variant="danger" onClick={() => { updatehandler(event) }}>Update</Button>{' '}
                  <Button variant="info" onClick={() => { removehandler(event) }}>Remove</Button>{' '}</div>
                <div className="col-4"></div>
              </div>
            </div>
            <hr />
          </>
        )
      })}
    </>
  )
}

export default events