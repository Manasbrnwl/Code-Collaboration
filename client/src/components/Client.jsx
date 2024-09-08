import React from 'react'
import Avatar from 'react-avatar'

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const Client = ({username}) => {
  const color = getRandomColor();
  return (
    <div className='flex items-center mb-3'>
      <Avatar name={username.toString()} size={50} round="14px" color={color} />
      <span className='ms-4 text-lg text-white'>{username.toString()}</span>
    </div>
  )
}

export default Client