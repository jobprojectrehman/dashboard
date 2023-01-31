import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/helper'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBack2Line } from 'react-icons/ri'
import {
  deleteAppointmentThunk,
  getStateValues,
} from '../../features/appointment/appointmentSlice'
import Warning from '../Warning'
import { showWarning } from '../../features/functions/functionSlice'
import ListWrapper from '../../Wrapper/dashboard/ListWrapper'

const List = () => {
  const dispatch = useDispatch()
  const { appointment, function: warningHolder } = useSelector((state) => state)

  const handleDelete = (_id) => {
    const name = 'deleteId'
    const value = _id
    dispatch(getStateValues({ name, value }))
    dispatch(showWarning())
  }

  if (appointment.isLoading) {
    return (
      <div>
        <h1 className='title'>Loading...</h1>
        <div className='loading'></div>
      </div>
    )
  }
  return (
    <ListWrapper>
      {/* Show warning  */}
      {warningHolder.warning && (
        <Warning
          action={() => dispatch(deleteAppointmentThunk(appointment.deleteId))}
        />
      )}
      {/* show table */}
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>StartTime</th>
            <th>EndTime</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
          {appointment.list?.map((item) => {
            return (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.slot?.startTime}</td>
                <td>{item.slot?.endTime}</td>
                <td>{formatDate(item.date.split('T')[0])}</td>
                <td>
                  <Link className='btn' to={`${item._id}`}>
                    <FiEdit />
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className='btn'
                  >
                    <RiDeleteBack2Line />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </ListWrapper>
  )
}

export default List
