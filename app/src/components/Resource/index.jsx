import React from 'react'
import Box from '@mui/material/Box'
import styles from './Resource.module.css'

export default function Resource({ balance, color, image }) {
  return (
    <div className={styles.resource__item}>
      <Box
        sx={{
          backgroundColor: color,
          width: '100%',
          height: '100%',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          flexDirection: 'column',
        }}
      >
        <img
          height='52px'
          alt='resource'
          src={image}
          className={styles.resource__img}
        />
        <p className={styles.resource__text}>
          {Number(Number(balance).toFixed(2))}
        </p>
      </Box>
    </div>
  )
}
