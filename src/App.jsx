import { useState , useEffect} from 'react'
import './App.css'
//========================================================
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import AutoFixHighOutlinedIcon from '@mui/icons-material/AutoFixHighOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import AddTaskIcon from '@mui/icons-material/AddTask';
import IconButton from '@mui/material/IconButton';
//========================================================
function ColorToggleButton({filter , setFilter}) {

 const handleChange = (event,newAlignment) => {
    if (newAlignment !== null) {
      setFilter(newAlignment);
    }
  };

  return (
    <ToggleButtonGroup
      
      value={filter}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
      sx={{
        marginTop : '6px',
        backgroundColor: '#2f2e2e6e',
        borderRadius: 2,
        padding: '6px',
        '& .MuiToggleButton-root': {
          color: '#ffffff',
          border: 'none',
          textTransform: 'uppercase',
          '&.Mui-selected': {
            color: '#4caf50', 
            backgroundColor: 'rgba(76, 175, 80, 0.15)', 
            '&:hover': {
              backgroundColor: 'rgba(76, 175, 80, 0.25)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
        },
      }}
    >
      <ToggleButton value="all">all</ToggleButton>
      <ToggleButton value="complete">complete</ToggleButton>
      <ToggleButton value="Active">Active</ToggleButton>
    </ToggleButtonGroup>
  );
}

//========================================================
function PopupCheck({ show, setShow, message }) {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!show) return;
    setClosing(false); 
    const timer = setTimeout(() => setClosing(true), 1800);
    return () => clearTimeout(timer);
  }, [show, message]); 

  function handleAnimationEnd() {
    if (closing) {
      setShow(false);
      setClosing(false);
    }
  }

  if (!show && !closing) return null;

  return (
    <div
      className={closing ? "popup-check popupscale2" : "popup-check popupscale"}
      onAnimationEnd={handleAnimationEnd}
    >
      {message}
    </div>
  );
}






function PopupDelete ({show ,setShow , id , tasks , setTasks}){
  const [closing, setClosing] = useState(false);
  function handleDelete(ID){
  setTimeout(() => setTasks(prev => prev.filter((task) => task.id !== ID)), 500);
  setClosing(true);
}
 function handleCancel(){
    setClosing(true);
  }
  function handleAnimationEnd(){
    if (closing){
      setShow(false);  
      setClosing(false);
    }
  }
  if (!show && !closing) return null;



return (
    <div className={closing ? "popup popupscale2" : "popup popupscale"} onAnimationEnd={handleAnimationEnd}>
      <div className='background'>
        <span>are you sure to delete : <p>{tasks.find((task) => task.id === id)?.title}</p></span>
      <div>
      <button onClick={() => handleDelete(id)}>Yes</button>
      <button onClick={handleCancel}>Cancel</button>
      </div>
      </div>
    </div>
)
 
}

function App() {
  const [tasks , setTasks] = useState(()=> {

    const getTasks = localStorage.getItem("tasks");
    return getTasks ? JSON.parse(getTasks) : [];
  });
  const [inputValueTitle , setInputValueTitle] = useState("");
  const [inputValueDetails , setInputValueDetails] = useState("");
  const [editingId , setEditingId] = useState(null);
  const [isEditing , setIsEditing] = useState(false);
  const [isDeleting , setIsDeleting] = useState(null);
  const [show , setShow] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showCheckPopup, setShowCheckPopup] = useState(false);
  const [checkMessage, setCheckMessage] = useState("");
//=====================================================================
useEffect(() => {
  localStorage.setItem("tasks",JSON.stringify(tasks))
}, [tasks]);
const filteredTasks = tasks.filter((task) => {
  if (filter === "all") return true;
  return filter === "complete" ? task.isDone : !task.isDone;
});


 
function addTask(){

  if (inputValueTitle == "") {
    return;
  }else {
    setTasks([...tasks , {id : Date.now() , title : inputValueTitle, details : "" ,isDone:false}]);
  setInputValueTitle("");
  }
}

function handleCheck(ID){
  const task = tasks.find((t) => t.id === ID);
  setTasks(tasks.map((task) => ID === task.id ? {...task, isDone: !task.isDone} : task));
  setCheckMessage(task.isDone ? "CANCEL CHECKED" : "CHECKED");
  setShowCheckPopup(true);
}


function handleCancelAndYes(ID){
  setShow(true);
  setIsDeleting(ID);
  }


function handleEdit(ID,title,details){
  setEditingId(ID);
  setIsEditing(true);
  setInputValueTitle(title);
  setInputValueDetails(details);
}
function onSave(ID){
  setTasks(tasks.map((task) => {
    if (ID == task.id){
      return {...task , title : inputValueTitle , details : inputValueDetails}
    }else{return task}
  }));
  setIsEditing(false);
  setEditingId(null);
  setInputValueTitle("");
  setInputValueDetails("");

}




//============================================================
  return (
    <div className="container">
      <PopupDelete show={show} setShow={setShow} id={isDeleting} tasks={tasks} setTasks={setTasks}/>
      <PopupCheck show={showCheckPopup} setShow={setShowCheckPopup} message={checkMessage} />
        <h1>My Todo Application</h1>
        <hr />
        <div style={{display : `${isEditing ? "none" : "flex"}`}} className="input-button">
          <input placeholder="Add a New Task" className='title' type="text" value={inputValueTitle} onChange={(event) => setInputValueTitle(event.target.value)} />
         
           <IconButton 
                onClick={addTask}
                
                sx={{
                      '&:hover .MuiSvgIcon-root path': {
                      fill: '#21fb21',
    },
  }}
  >
    <AddTaskIcon />
  add
        </IconButton>
         
        </div>
        <ColorToggleButton filter={filter} setFilter={setFilter} />
        <div className="wrapper">
    <ul>
      {
        filteredTasks.length === 0 ? <li className='lazy'>No Tasks yet</li> :
      filteredTasks.map((task) => {
        return (
        isEditing && editingId == task.id ? (
          <li className={isEditing && editingId == task.id ? "wrapper-li-icon2" : "wrapper-li-icon"} dir="ltr" key={task.id}>
          <div  className="wrapper-li">
           <div>
             <label htmlFor="title">Title:</label>
          <div className="before"><input id='title' name='title' type="text" value={inputValueTitle} onChange={(event) => setInputValueTitle(event.target.value)} /></div>
           </div>
            <div>
              <label htmlFor="details">Details:</label>
              <div className="before"><input id='details' name='details' type="text" value={inputValueDetails} onChange={(event) => setInputValueDetails(event.target.value)}  /></div>
            </div>
          <div><button onClick={()=> onSave(task.id)}>SAVE</button></div>
        </div>
        </li>
        ):(
        <li className={task.isDone ? "wrapper-li-icon checky" : "wrapper-li-icon"} dir="ltr" key={task.id}>
          <div className="wrapper-li">
          <p className={task.isDone ? "check" : ""}>{task.title}</p>
        <span>{task.details}</span>
        </div>
        <div className="all-icons">
        <button onClick={() => handleCheck(task.id)} className={task.isDone ? "checkGreen" : ""} >
          <CheckCircleOutlinedIcon sx={{fontSize : "21px"}} /> Check
          </button>
        <button onClick={() => handleEdit(task.id,task.title,task.details)}><AutoFixHighOutlinedIcon sx={{fontSize : "21px"}} />Edit</button>
        <button onClick={() => handleCancelAndYes(task.id)}><HighlightOffOutlinedIcon sx={{fontSize : "21px"}} />Delete</button>
        </div>
        </li>
      )
   ) })}
  
    </ul>

    </div>
      </div>
  )
}

export default App
