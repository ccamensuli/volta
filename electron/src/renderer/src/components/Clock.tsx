import React, { useState, useEffect, useRef } from 'react'
import { useInterval } from 'usehooks-ts'
import moment from 'moment'
import 'moment/locale/fr.js'
import { Button } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

interface ClockProps {
  size: number
  locale?: string
}

function createData(name: string, calories: number, fat: number, carbs: number, protein: number) {
  return { name, calories, fat, carbs, protein }
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9)
]

const Clock: React.FC<ClockProps> = ({ size, locale = 'fr' }) => {
  // state

  useEffect(() => {
    console.log(size, locale, rows)
  }, [])

  const [time, setTime] = useState<Date>(new Date())
  const [delay] = useState<number>(1000)

  useInterval(
    () => {
      // Your custom logic here
      setTime(new Date())
    },
    // Delay in milliseconds or null to stop it
    delay
  )

  const style: React.CSSProperties = {
    fontSize: `${size}px`
  }

  // mutation

  return (
    <>
      <h1 style={style}>{moment(time).format('HH:mm:ss')}</h1>
      <Button variant="contained">Créer Une Alarme</Button>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Fat&nbsp;(g)</TableCell>
              <TableCell align="right">Carbs&nbsp;(g)</TableCell>
              <TableCell align="right">Protein&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Clock
