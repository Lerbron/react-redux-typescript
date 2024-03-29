import React, { useEffect } from 'react'
import { pendingReq } from '@/utils/http'

export default (ComponentFn: React.ElementType) => {
  const PageHoc= (props: any) => {
    useEffect(() => {
      return () => {
        Object.keys(pendingReq).map(reqKey => {
          pendingReq[reqKey] && pendingReq[reqKey]('page unmount')
        })
      }
    }, [])

    return <ComponentFn {...props} />
  }

  return PageHoc
}