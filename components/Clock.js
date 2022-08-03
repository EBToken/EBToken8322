import { useEffect, useState } from 'react'
import style from './Clock.module.css'

function Clock(props) {
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  const getTimeUntil = (deadline) => {
    const time = Date.parse(deadline) - Date.parse(new Date());
    setSeconds(Math.floor((time/1000) % 60));
    setMinutes(Math.floor((time/1000/60) % 60));
    setHours(Math.floor((time/(1000*60*60)% 24)));
    setDays(Math.floor((time/(1000*60*60*24))));
  }

  useEffect(() => {
    getTimeUntil(props.deadline);
  })

  useEffect(() => {
    setInterval(() => getTimeUntil(props.deadline), 1000)
  }, [props.deadline])

  const leading0 = (num) => {
    return num < 10 ? '0' + num : num
  }

return (
    
         <div class="row timer  mb-3">
         <div class="col-3">
           <h3>{leading0(days)}</h3>
           <p>Days</p>
         </div>
         <div class="col-3">
           <h3>{leading0(hours)}</h3>
           <p>Hours</p>
         </div>
         <div class="col-3">
           <h3>{leading0(minutes)}</h3>
           <p>Minutes</p>
         </div>
         <div class="col-3">
            <h3>{leading0(seconds)}</h3>
           <p>Seconds</p>
         </div>
       </div>
  )
}

export default Clock