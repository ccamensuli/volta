import { useState } from 'react'

export default function Horloge(): JSX.Element {
  const [test] = useState<string>('test')

  return (
    <>
      <div>{test}</div>
    </>
  )
}
