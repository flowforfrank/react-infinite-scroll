import InfiniteScroll from './InfiniteScroll'

function App() {

    return (
        <InfiniteScroll
            url="https://dummyjson.com/posts"
            limit={50}
            render={posts => posts.map((item, index) => (
                <article key={index}>
                    #{item.id}: {item.title}
                </article>
            ))}
        >
            {/* In case this needs to be a component, the ref must be passed using forwardRef */}
            <div className="loader">Loading...</div>
        </InfiniteScroll>
    )
}

export default App
