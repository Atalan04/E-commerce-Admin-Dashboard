import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useDebounce } from "../../hooks/cutomHooks";
import { getProducts } from "../../services/api";

function SearchProducts() {
  const [search,setSearch] = useState("")

  const debounceSearch = useDebounce(search,500)
  
  const {data, isFetching,}=useQuery({
    queryKey:[ "products-search",debounceSearch],
    queryFn:()=> {
      return getProducts({search:debounceSearch})
    },
    enabled:debounceSearch.trim().length>0
  })

  const searchResults = data?.data ?? []

  const SearchHandler =(e: React.ChangeEvent<HTMLInputElement>)=> {
    setSearch(e.target.value)
  } 

  return (
    <div>
      <input type="text" id="search" placeholder="Search" value={search} onChange={SearchHandler} />
      {isFetching && <p>loading ....</p>}
      <ul>
        {searchResults.map(item => <li key={item.id}>{item.title}</li>)}
      </ul>
    </div>
  );
}

export default SearchProducts;
