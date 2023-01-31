import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { formatDate, formatPrice } from '../../utils/helper'
import { FiEdit } from 'react-icons/fi'
import { RiDeleteBack2Line } from 'react-icons/ri'
import Warning from '../Warning'
import { showWarning } from '../../features/functions/functionSlice'
import {
  deleteSingleOrderThunk,
  getStateValues,
} from '../../features/order/orderSlice'
import ListWrapper from '../../Wrapper/dashboard/ListWrapper'

const List = () => {
  const dispatch = useDispatch()
  const { order, function: warningHolder } = useSelector((state) => state)

  const handleDelete = (_id) => {
    const name = 'deleteId'
    const value = _id
    dispatch(getStateValues({ name, value }))
    dispatch(showWarning())
  }

  return (
    <ListWrapper>
      {/* Show warning  */}
      {warningHolder.warning && (
        <Warning
          action={() => dispatch(deleteSingleOrderThunk(order.deleteId))}
        />
      )}
      {/* show table */}
      <table>
        <tbody>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Stock</th>
            <th>payment</th>
            <th>Total</th>
            <th>status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
          {order.list?.map((item) => {
            return (
              <tr key={item._id}>
                <td className='image-holder'>
                  {item.cart.map((item) => (
                    <img src={item.uploadImage[0].secure_url} alt='' />
                  ))}
                </td>
                <td>
                  {item.cart.map((item) => (
                    <div
                      style={{
                        height: '105px',
                        display: 'grid',
                        alignItems: `center`,
                        borderBottom: '2px solid var(--grey-3)',
                      }}
                    >
                      {item.title}
                    </div>
                  ))}
                </td>
                <td>
                  {item.cart.map((item) => (
                    <div
                      style={{
                        height: '105px',
                        display: 'grid',
                        alignItems: `center`,
                        borderBottom: '2px solid var(--grey-3)',
                      }}
                    >
                      {item.quantity}
                    </div>
                  ))}
                </td>
                <td>
                  {item.cart.map((item) => (
                    <div
                      style={{
                        height: '105px',
                        display: 'grid',
                        alignItems: `center`,
                        borderBottom: '2px solid var(--grey-3)',
                      }}
                    >
                      {item.totalStock}
                    </div>
                  ))}
                </td>
                <td>{item.redirect_status}</td>
                <td>{formatPrice(item.total)}</td>
                <td>{item.shipment ? `completed` : `Processing`}</td>
                <td>{formatDate(item.date)}</td>
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
