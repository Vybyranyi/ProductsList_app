import React from 'react';
import styles from './SortControl.module.scss';

export interface ISortControlProps {
    sortOrder: 'name' | 'count' | 'weight';
    onSortChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function SortControl({ sortOrder, onSortChange }: ISortControlProps) {
    return (
        <div className={styles.sortControl}>
            <label htmlFor="sort-select">Sort by:</label>
            <select id="sort-select" value={sortOrder} onChange={onSortChange}>
                <option value="name">Name</option>
                <option value="count">Count</option>
                <option value="weight">Weight</option>
            </select>
        </div>
    );
}