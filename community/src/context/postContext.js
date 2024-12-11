import React, { createContext, useContext, useState } from 'react';

const postContext = createContext();

export const usePosts = () => {
    return useContext(postContext);
};

export const PostProvider = ({ children }) => {
    const [posts, setPosts] = useState([]);

    return <postContext.Provider value={{ posts, setPosts }}>{children}</postContext.Provider>;
};
