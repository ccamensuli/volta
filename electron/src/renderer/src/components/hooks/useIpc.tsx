import { useState, useRef, useEffect } from 'react'
import { v4 as uuid } from 'uuid'

interface IpcOutput {
  sendMessage: (message: IpcMessage) => IpcMessage['id']
  on: (func: (data: IpcMessage) => void) => void
  once: (func: (data: IpcMessage) => void) => void
  loading: boolean
  error: Error | null
  datas: unknown[]
  id: IpcMessage['id']
}

function useIpc(channel): IpcOutput {
  const [loading, setLoading] = useState<boolean>(false)
  const [datas, setDatas] = useState<any[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [id, setId] = useState<string | null | undefined>('')

  const on = (func: (data: IpcMessage) => void): void => {
    return window.volta.on(channel, (data: string) => {
      try {
        const res = JSON.parse(data)
        console.info(`EVENT ON ${res.id} ${channel} : ${res.action}`)
        setDatas(res)
        return func(res)
      } catch (e) {
        console.error(e)
        setError(e)
        throw e
      } finally {
        setLoading(false)
      }
    })
  }

  const once = (func: (data: IpcMessage) => void): void => {
    return window.volta.once(channel, (data: string) => {
      try {
        const res = JSON.parse(data)
        console.info(`EVENT ONCE ${res.id} ${channel} : ${res.action}`)
        setDatas(res)
        return func(res)
      } catch (e) {
        console.error(e)
        throw e
      } finally {
        setLoading(false)
      }
    })
  }

  const sendMessage = (message: IpcMessage): IpcMessage['id'] => {
    try {
      setLoading(true)
      message.id = uuid()
      console.info(`SEND  ${message.id} ${message.channel} : ${message.action}`)
      window.volta.sendMessage(channel, JSON.stringify(message))
      setId(message.id)
      return message.id
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  return {
    sendMessage,
    on,
    once,
    loading,
    error,
    datas,
    id
  }
}

export default useIpc
