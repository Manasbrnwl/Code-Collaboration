import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {v4 as uuidv4} from "uuid";
import toast from "react-hot-toast";

const Home = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const generateRoomId = (e) => {
    e.preventDefault()
    setRoomId(uuidv4());
    toast.success("Room ID generated successfully");
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (roomId && username) {
      toast.success(`Joined Room as ${username}`)
      navigate(`/editor/${roomId}`,{
        state: {username},
      })
      return
    }
    toast.error("Please fill both the fields!!")
  }

  return (
    <div className="flex justify-center items-center bg-slate-700 w-[100vw] h-[100vh]">
      <div className="card">
        <div className="card-body bg-slate-900 border-8 border-solid border-cyan-550 rounded-2xl h-[50vh] w-[50vw] min-w-[300px] min-h-[500px]">
          <div className="text-3xl text-gray-300 flex justify-center items-center h-[20%] w-[100%]">
            <img src="icons.png" alt="logo" className="me-5 h-11" />
            <div className="px-5 border-l-2 border-cyan-50">CodePulse</div>
          </div>
          <div className="h-[80%] w-[100%] lg:grid lg:grid-cols-2 lg:gap-4 border-t-4 border-cyan-50Z flex flex-col">
            <div className="flex items-center justify-center flex-col">
              <div className="text-3xl text-gray-100">CodePulse</div>
              <div className="text-lg text-gray-300">Real-Time Editor</div>
            </div>
            <div className="flex items-center justify-start">
              <form action="post" className="flex flex-col w-[30rem]">
                <label className="block mb-2 mx-2 lg:mx-0">
                  <span className="block text-2xl font-medium text-slate-200">
                    Room ID
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={roomId}
                    onChange={(e)=>{setRoomId(e.target.value)}}
                    className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                    placeholder="Enter Room Id to join"
                  />
                </label>
                <label className="block mb-2 mx-2 lg:mx-0">
                  <span className="block text-2xl font-medium text-slate-200">
                    Username
                  </span>
                  <input
                    type="text"
                    name="name"
                    value={username}
                    onChange={(e)=>{setUsername(e.target.value)}}
                    className="mt-1 px-3 py-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md sm:text-sm focus:ring-1"
                    placeholder="Enter Your Name"
                  />
                </label>
                <button className="text-white bg-lime-800 w-[20%] h-[40px] rounded-md my-2 mx-2 lg:mx-0" onClick={handleSubmit}>
                  Join
                </button>
                <div className="text-md text-white mx-2 lg:mx-0">
                  Don't have a room ID? Create{" "}
                  <Link className="text-green-700 line-clamp-1 lg:line-clamp-none" onClick={generateRoomId}> New Room </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
