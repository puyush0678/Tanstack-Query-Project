import { Link, Outlet, useNavigate, useParams, useSubmit } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import Header from '../Header.jsx';
import { deleteEvent,fetchEvent } from '../../util/http.js';
import { useState } from 'react';
import Modal from '../UI/Modal.jsx';

export default function EventDetails() {
  const params=useParams();
  const [closeModal,setCloseModal]=useState(false)
  const { data, isError, error } = useQuery({
    queryKey: ['events', params.id],
    queryFn: ({ signal }) => fetchEvent({ signal, id: params.id }),
    staleTime: 10000
  });
  const navigate=useNavigate()
  const { mutate,isError:isDeleteError,error:deleteError } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events',params.id] });
      navigate('/events');
    },
  });
  const handleDelete=()=>{
mutate({id:params.id})

  }
  const handleCloseModal=()=>{
    setCloseModal(false)
  }
  if (isError|| isDeleteError) {
    content = (
      <>
        <ErrorBlock
          title="Failed to load event"
          message={error.info?.message ||deleteError.info?.message|| 'Failed to load event. Please check your inputs and try again later.'}
        />
        <div className="form-actions">
          <Link to="../" className="button">
            Okay
          </Link>
        </div>
      </>
    );
  }
let content=<div></div>;
if(data)
{
  content= <>
  <Outlet />
  <Header>
    <Link to="/events" className="nav-item">
      View all Events
    </Link>
  </Header>
  <article id="event-details">
    <header>
      <h1>{data.title|| 'Event Title'}</h1>
      <nav>
        <button onClick={()=>{
          setCloseModal(true)
        }}>Delete</button>
        <Link to="edit">Edit</Link>
      </nav>
    </header>
    <div id="event-details-content">
      <img src={`http://localhost:3000/${data.image}`||""} alt="" />
      <div id="event-details-info">
        <div>
          <p id="event-details-location">{data.location||"Event Location"}</p>
          <time dateTime={`Todo-DateT$Todo-Time`}>{`${data.date} & ${data.time}`||"Event Date And Time"}</time>
        </div>
        <p id="event-details-description">{data.description||"Event Description"}</p>
      </div>
    </div>
  </article>
</>
}

  return <>{closeModal&&<Modal onClose={handleCloseModal}><div><h1>Sure, Do You Want Delete</h1></div><div><button className='button b1' onClick={handleDelete}>Yes</button><button className='button b1' onClick={handleCloseModal}> No</button></div>
  </Modal>}{content}</>
}
