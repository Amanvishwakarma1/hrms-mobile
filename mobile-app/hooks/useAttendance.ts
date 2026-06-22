import { useState } from "react";

export default function useAttendance(){
    const[status,setStatus]=useState("Not checked in");
    const[checkInTime,setCheckInTime]=useState("");
    const[checkOutTime,setCheckOutTime]=useState("");

    const clockIn = () =>{
        const time = new Date().toLocaleTimeString();
        setCheckInTime(time);
        setStatus("checked in");
    }
    const clockOut = ()=>{
        const time = new Date().toLocaleTimeString();
        setCheckOutTime(time);
        setStatus("checked out");
    }
    return {status,setStatus,clockIn,clockOut,checkInTime,checkOutTime};
} 