import api from "./api";

const getcategory = () => api.get("/categories").then((res) => res.data);


export {getcategory}
