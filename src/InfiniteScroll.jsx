import React, { useEffect, useRef, useState } from 'react'

const InfiniteScroll = ({
    url,
    limit,
    render,
    children
}) => {
    const element = useRef(null)
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [isLastPage, setIsLastPage] = useState(false)
    const [endpoint, setEndpoint] = useState(`${url}?limit=${limit || 50}`)
    const childWithRef = React.cloneElement(children, { ref: element })

    const getUrl = (url, page, limit) => {
        return `${url}?limit=${limit || 50}&skip=${page * limit || 50}`
    }

    const setInitialData = async () => {
        const response = await fetch(endpoint)
        const json = await response.json()
    
        setData(json[Object.keys(json)[0]])
        setPage(page + 1)
        setEndpoint(getUrl(url, page, limit))
        setLoading(false)
    }

    const intersectionObserver = new IntersectionObserver(async entries => {
        const entry = entries[0]
        
        if (entry.isIntersecting && !loading) {
            setLoading(true)
            setPage(page + 1)
            setEndpoint(getUrl(url, page, limit))

            const response = await fetch(endpoint)
            const json = await response.json()

            setData([
                ...data,
                ...json[Object.keys(json)[0]]
            ])

            setLoading(false)

            if (json.total === json.skip + json.limit) {
                setIsLastPage(true)
                intersectionObserver.unobserve(element.current)
            }
        }
    })

    useEffect(() => {
        if (!data) {
            setInitialData()
        }

        if (!isLastPage) {
            intersectionObserver.observe(element.current)
        }

        return () => {
            element.current && intersectionObserver.unobserve(element.current)
        }
    }, [loading, page, endpoint])

    return (
        <React.Fragment>
            {data && render(data)}
            {!isLastPage && childWithRef}
        </React.Fragment>
    )
}

export default InfiniteScroll
