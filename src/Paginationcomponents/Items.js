
import Singleitems from "./Singleitems";
import EmptyState from "../components/EmptyState";


function Items({currentItems, onRetry, searchTerm = "", onClearSearch})
{
    

    return(
        <div className="mt-2 mb-5 w-full">
        {currentItems?.length === 0 ? (
            searchTerm ? <EmptyState title="No matching discussions" description={`We couldn't find a discussion matching “${searchTerm}”. Try another keyword or clear your search.`} actionLabel="Clear search" onAction={onClearSearch} /> : <EmptyState title="No discussions yet" description="Start a discussion or try another topic filter." />
        ) : typeof currentItems?.[0] === "string" ? (
            currentItems[0].toLowerCase().includes("could not load") ? (
                <EmptyState title={currentItems[0]} description="Check your connection and try loading discussions again." actionLabel="Try again" onAction={onRetry} />
            ) : (
                <EmptyState title={currentItems[0]} description="Try another topic, or start a new discussion with the community." />
            )
        ) : (
            currentItems?.map((item)=>(<Singleitems item={item} key={item?._id} />))
        )}
        </div>
    )
}

export default Items;
