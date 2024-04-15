import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import './Users.css';

const UsersPageSkeleton = () => {
    const skeletonArray = new Array(16).fill(null);
    return (
        <div className='profile-grid'>
            {skeletonArray.map((_, index) => (
                <Skeleton key={index} animation="wave" variant="rounded" height={120} />
            ))}
        </div>
    );
}

export default UsersPageSkeleton;
