import React from 'react'
import { useSelector } from 'react-redux'
import { Pie, PieChart, Tooltip } from 'recharts'

const CountAllChart = () => {
  const { product, order, contact, user } = useSelector((state) => state)

  const data01 = [
    {
      name: 'Products',
      value: product.count,
    },
  ]
  const data02 = [
    {
      name: 'users',
      value: user.count,
    },
    {
      name: 'Orders',
      value: order.count,
    },
    {
      name: 'Orders',
      value: contact.count,
    },
  ]

  return (
    <>
      <PieChart width={260} height={230}>
        <Tooltip />
        <Pie
          data={data01}
          dataKey='value'
          nameKey='name'
          cx='50%'
          cy='50%'
          outerRadius={50}
          fill='#8884d8'
        />
        <Pie
          data={data02}
          dataKey='value'
          nameKey='name'
          cx='50%'
          cy='50%'
          innerRadius={60}
          outerRadius={80}
          fill='#82ca9d'
          label
        />
      </PieChart>
    </>
  )
}

export default CountAllChart
