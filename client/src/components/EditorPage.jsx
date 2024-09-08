import React, { useEffect, useRef, useState } from "react";
import Client from "./Client";
import Editor from "./Editor";
import toast from "react-hot-toast";
import {
  useNavigate,
  useLocation,
  useParams,
  Navigate,
} from "react-router-dom";
import { initSocket } from "../socket";

const EditorPage = () => {
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const location = useLocation();
  const { roomId } = useParams();
  const [clients, setClients] = useState([]);
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on("connect_error", (err) => handleError(err));
      socketRef.current.on("connect_failed", (err) => handleError(err));

      const handleError = (e) => {
        console.log("Socket error =>", e);
        toast.error("Socket connection failed");
        navigate("/");
      };

      socketRef.current.emit("join", {
        roomId,
        username: location.state?.username,
      });
      //user added
      socketRef.current.on(
        "newUserJoined",
        ({ client, username, socketId }) => {
          console.log(codeRef.current);
          setClients(client);
          if (username !== location.state?.username) {
            toast.success(`${username} joined the room`);
          }
          socketRef.current.emit("sync-code", {
            socketId,
            code: codeRef.current,
          });
        }
      );
      //disconnected
      socketRef.current.on("disconnected", ({ socketId, username }) => {
        setClients((prev) => {
          return prev.filter((client) => client.socketId !== socketId);
        });
        toast.success(`${username} leave`);
      });
    };
    init();
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off("newUserJoined");
      socketRef.current.off("disconnected");
    };
  }, []);

  if (!location.state?.username) {
    return <Navigate to="/" />;
  }

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID Copied");
    } catch (error) {
      toast.error("Unable to copy room ID");
    }
  };

  const leaveRoom = () => {
    navigate("/");
  };

  return (
    <div className="grid grid-cols-6 gap-1 max-h-[100vh] max-w-[100vw] h-[100vh] bg-slate-700">
      <div className="bg-slate-900">
        <div className="text-3xl text-gray-300 flex justify-center items-center h-[10%] w-[100%] border-y-2 border-cyan-50">
          <img src="/icons.png" alt="logo" className="h-10 me-5" />
          <div className="px-5 border-l-2 border-cyan-50">CodePulse</div>
        </div>
        <div className="flex flex-col h-[80%] w-[100%] p-5">
          <div className="text-3xl text-white font-mono">Members</div>
          <hr className="border-gray-600 my-3 overflow-auto" />
          {clients.map((client) => (
            <Client key={client.socketId} username={client.username} />
          ))}
        </div>
        <div className="flex justify-center items-center gap-4 h-[10%] w-[100%] border-y-2 border-cyan-50">
          <button
            onClick={copyRoomId}
            className="text-white bg-lime-800 w-[40%] h-[40px] rounded-md my-2"
          >
            Copy Room ID
          </button>
          <button
            className="text-white bg-red-800 w-[40%] h-[40px] rounded-md my-2"
            onClick={leaveRoom}
          >
            Leave Room
          </button>
        </div>
      </div>
      <div className="col-span-5 bg-slate-500">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default EditorPage;
