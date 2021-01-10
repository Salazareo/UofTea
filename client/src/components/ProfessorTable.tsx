import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Redirect, useLocation } from 'react-router-dom';
import { Table } from 'semantic-ui-react';
import { RootState } from '../redux/reducers';
import { parseProfQueryFromUrl, parseUrlFromProfQueryObj, ProfSortOptions } from './ProfessorFilters';



export interface ProfTableData {
  professor: string;
  recommended: number | 'N/A';
  clarity: number | 'N/A';
  engaging: number | 'N/A';
  campus: string; // scarborough, st. george, mississuaga
}

export enum Campuses {
  utm = 'Mississauga',
  utsc = 'Scarborough',
  utsg = 'St. George'
}

export const ProfessorTable = (props: { professors: ProfTableData[] }) => {

  const { darkmode } = useSelector((state: RootState) => state.darkmodeReducer);

  const location = useLocation();

  const queryObj = parseProfQueryFromUrl(location.search);
  const { sort, ascending } = queryObj;
  const [{ filterSort, filterAscending }, changeSort] = useState({
    filterSort: sort || ProfSortOptions.recommended,
    filterAscending: ascending || 'descending'
  });

  if (sort !== filterSort || filterAscending !== ascending) {
    return <Redirect to={`/browse/professors?${parseUrlFromProfQueryObj({ ...queryObj, sort: filterSort, ascending: filterAscending })}`} />
  }

  return <Table
    sortable
    striped
    inverted={darkmode}>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell
          onClick={() => {
            changeSort((oldValues) => {
              return {
                filterSort: ProfSortOptions.professor,
                filterAscending: oldValues.filterSort === 'professor' ? (oldValues.filterAscending === 'descending' ? 'ascending' : 'descending') : 'descending'
              }
            })
          }}
          sorted={sort === 'professor' ? (ascending || 'descending') : undefined}
        >
          Professor Name
      </Table.HeaderCell>
        <Table.HeaderCell
          onClick={() => {
            changeSort((oldValues) => {
              return {
                filterSort: ProfSortOptions.campus,
                filterAscending: oldValues.filterSort === 'campus' ? (oldValues.filterAscending === 'descending' ? 'ascending' : 'descending') : 'descending'
              }
            })
          }}
          sorted={sort === 'campus' ? (ascending || 'descending') : undefined}>
          Main Campus
      </Table.HeaderCell>
        <Table.HeaderCell
          onClick={() => {
            changeSort((oldValues) => {
              return {
                filterSort: ProfSortOptions.recommended,
                filterAscending: oldValues.filterSort === 'recommended' ? (oldValues.filterAscending === 'descending' ? 'ascending' : 'descending') : 'descending'
              }
            })
          }}
          sorted={sort === 'recommended' ? (ascending || 'descending') : undefined}>
          Recommended
      </Table.HeaderCell>
        <Table.HeaderCell
          onClick={() => {
            changeSort((oldValues) => {
              return {
                filterSort: ProfSortOptions.clarity,
                filterAscending: oldValues.filterSort === 'clarity' ? (oldValues.filterAscending === 'descending' ? 'ascending' : 'descending') : 'descending'
              }
            })
          }}
          sorted={sort === 'clarity' ? (ascending || 'descending') : undefined}>
          Clarity
      </Table.HeaderCell>
        <Table.HeaderCell
          onClick={() => {
            changeSort((oldValues) => {
              return {
                filterSort: ProfSortOptions.engaging,
                filterAscending: oldValues.filterSort === 'engaging' ? (oldValues.filterAscending === 'descending' ? 'ascending' : 'descending') : 'descending'
              }
            })
          }}
          sorted={sort === 'engaging' ? (ascending || 'descending') : undefined}>
          Engagement
      </Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {props.professors.map(({ professor, recommended, clarity, engaging, campus }) => (
        <Table.Row key={professor}>
          <Table.Cell selectable
            style={{ color: darkmode ? '#6495ED' : 'navy', fontWeight: '600' }}><NavLink to={`/professors/${professor}`}>{professor}</NavLink></Table.Cell>
          <Table.Cell >{Campuses[campus.toLowerCase() as keyof typeof Campuses]}</Table.Cell>
          <Table.Cell >{recommended !== 'N/A' ? recommended.toFixed(1) : recommended}{recommended !== 'N/A' ? '%' : ''}</Table.Cell>
          <Table.Cell >{clarity !== 'N/A' ? clarity.toFixed(1) : clarity}{clarity !== 'N/A' ? '%' : ''}</Table.Cell>
          <Table.Cell >{engaging !== 'N/A' ? engaging.toFixed(1) : engaging}{engaging !== 'N/A' ? '%' : ''}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table >
}